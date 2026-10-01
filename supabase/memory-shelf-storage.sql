-- Run AFTER memory-shelf-share.sql, with the old publish function paused.
-- Local installer, NOT applied automatically. First verify org Usage and all other
-- projects: the 800MB guard counts this project, not future unrelated uploads.
begin;
alter table public.memory_shelf_shares add column if not exists owner_id uuid;
alter table public.memory_shelf_shares add column if not exists stored_bytes bigint not null default 0;
-- One-time accounting of legacy embedded JPEGs (including covers).
update public.memory_shelf_shares s set stored_bytes=(
  select coalesce(sum(octet_length(decode(substr(v #>> '{}',24),'base64'))),0)
  from jsonb_path_query(s.snapshot,'$.provinces[*].cities[*].photos[*].dataUrl') v
)+(
  select coalesce(sum(octet_length(decode(substr(v #>> '{}',24),'base64'))),0)
  from jsonb_path_query(s.snapshot,'$.provinces[*].cover') v where v #>> '{}' like 'data:image/jpeg;base64,%'
) where stored_bytes=0 and snapshot->>'version'='1';

create table if not exists public.memory_share_capacity (
  id text primary key,
  credential_hash text,
  used_bytes bigint not null default 0 check(used_bytes>=0),
  reserved_bytes bigint not null default 0 check(reserved_bytes>=0)
);
insert into public.memory_share_capacity(id,used_bytes)
select 'global',coalesce((select sum(stored_bytes) from public.memory_shelf_shares),0)
  +coalesce((select sum((metadata->>'size')::bigint) from storage.objects),0)
on conflict do nothing;

create table if not exists public.memory_share_sessions (
  share_id uuid primary key,
  target_id uuid not null,
  owner_id uuid not null,
  management_hash text not null,
  manifest jsonb not null,
  total_bytes bigint not null check(total_bytes between 1 and 50000000),
  state text not null default 'draft' check(state in('draft','published','cancelling','cancelled','retired')),
  last_active timestamptz not null default now()
);
create table if not exists public.memory_share_files (
  share_id uuid references public.memory_share_sessions(share_id) on delete cascade,
  file_id text not null check(file_id ~ '^[a-zA-Z0-9_-]{1,80}$'),
  bytes integer not null check(bytes between 1 and 307200),
  sha256 text not null check(sha256 ~ '^[a-f0-9]{64}$'),
  uploaded boolean not null default false,
  uploading boolean not null default false,
  primary key(share_id,file_id)
);
alter table public.memory_share_capacity enable row level security;
alter table public.memory_share_sessions enable row level security;
alter table public.memory_share_files enable row level security;
revoke all on public.memory_share_capacity,public.memory_share_sessions,public.memory_share_files from public,anon,authenticated;
revoke all on public.memory_shelf_shares,public.memory_share_quota from public,anon,authenticated;
grant all on public.memory_share_capacity,public.memory_share_sessions,public.memory_share_files,public.memory_shelf_shares,public.memory_share_quota to service_role;

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('memory-share-photos','memory-share-photos',false,307200,array['image/jpeg'])
on conflict(id) do update set public=false,file_size_limit=307200,allowed_mime_types=array['image/jpeg'];
-- Do not add anon/authenticated Storage policies. Audit pre-existing wildcard
-- storage.objects policies before deployment; they must exclude this bucket.

-- Single service-only transaction entry point: all mutations lock global then
-- browser, so concurrent reservations cannot exceed either cumulative limit.
create or replace function public.memory_share_transaction(p_action text,p_input jsonb)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare
  g public.memory_share_capacity%rowtype;
  b public.memory_share_capacity%rowtype;
  s public.memory_share_sessions%rowtype;
  old public.memory_shelf_shares%rowtype;
  f public.memory_share_files%rowtype;
  browser uuid;
  sid uuid;
  target uuid;
  amount bigint;
  slot_count integer;
  result jsonb;
begin
  select * into strict g from public.memory_share_capacity where id='global' for update;
  if p_action in('quota','begin','claim') then
    browser:=(p_input->>'browserId')::uuid;
    insert into public.memory_share_capacity(id,credential_hash) values(browser::text,p_input->>'browserHash') on conflict do nothing;
    select * into strict b from public.memory_share_capacity where id=browser::text for update;
    if b.credential_hash is distinct from p_input->>'browserHash' then raise exception '匿名凭证无效'; end if;
    if p_action='quota' then return jsonb_build_object('browserUsed',b.used_bytes,'browserReserved',b.reserved_bytes,'browserLimit',50000000,'globalUsed',g.used_bytes,'globalReserved',g.reserved_bytes,'globalLimit',800000000); end if;
  end if;
  sid:=(p_input->>'shareId')::uuid;
  if p_action='claim' then
    select * into old from public.memory_shelf_shares where share_id=sid for update;
    if not found then return jsonb_build_object('claimed',false); end if;
    if old.management_hash is distinct from p_input->>'managementHash' then raise exception '分享管理凭证无效'; end if;
    if old.owner_id is not null and old.owner_id<>browser then raise exception '此分享已归属其他匿名浏览器'; end if;
    if old.owner_id is null then
      update public.memory_shelf_shares set owner_id=browser where share_id=sid;
      update public.memory_share_capacity set used_bytes=used_bytes+old.stored_bytes where id=browser::text;
    end if;
    return jsonb_build_object('claimed',true);
  end if;
  if p_action='begin' then
    target:=coalesce((p_input->>'targetId')::uuid,sid);
    select * into old from public.memory_shelf_shares where share_id=target for update;
    if found and (old.management_hash is distinct from p_input->>'managementHash' or old.owner_id is distinct from browser) then raise exception '无权更新此书架'; end if;
    select * into s from public.memory_share_sessions where share_id=sid for update;
    if found then
      if s.owner_id<>browser or s.management_hash is distinct from p_input->>'managementHash' or s.manifest is distinct from p_input->'manifest' or s.target_id<>target then raise exception '上传会话不匹配'; end if;
      if s.state not in('draft','published') then raise exception '上传会话已关闭'; end if;
    else
      amount:=(p_input->'manifest'->>'totalBytes')::bigint;
      if b.used_bytes+b.reserved_bytes+amount>50000000 then raise exception '此匿名浏览器累计分享超过 50MB'; end if;
      if g.used_bytes+g.reserved_bytes+amount>800000000 then raise exception '全站分享空间达到 800MB 上限'; end if;
      select count(*) into slot_count from public.memory_share_quota where source_hash=p_input->>'sourceHash' and day=current_date;
      if slot_count>=20 then raise exception '今天生成海报次数较多，请明天再试'; end if;
      insert into public.memory_share_quota values(p_input->>'sourceHash',current_date,slot_count);
      insert into public.memory_share_sessions(share_id,target_id,owner_id,management_hash,manifest,total_bytes)
      values(sid,target,browser,p_input->>'managementHash',p_input->'manifest',amount);
      insert into public.memory_share_files(share_id,file_id,bytes,sha256)
      select sid,x->>'fileId',(x->>'bytes')::integer,x->>'sha256' from jsonb_array_elements(p_input->'manifest'->'files') x;
      update public.memory_share_capacity set reserved_bytes=reserved_bytes+amount where id in('global',browser::text);
    end if;
    return jsonb_build_object('shareId',sid,'uploadedIds',coalesce((select jsonb_agg(file_id) from public.memory_share_files where share_id=sid and uploaded),'[]'::jsonb));
  end if;
  select * into s from public.memory_share_sessions where share_id=sid for update;
  if not found or s.management_hash is distinct from p_input->>'managementHash' then raise exception '分享管理凭证无效'; end if;
  select * into strict b from public.memory_share_capacity where id=s.owner_id::text for update;
  update public.memory_share_sessions set last_active=now() where share_id=sid;
  if p_action in('upload-start','upload-done','upload-failed') then
    if s.state<>'draft' then raise exception '上传会话已关闭'; end if;
    select * into f from public.memory_share_files where share_id=sid and file_id=p_input->>'fileId' for update;
    if not found or f.bytes<>(p_input->>'bytes')::integer or f.sha256 is distinct from p_input->>'sha256' then raise exception '照片与上传清单不符'; end if;
    if p_action='upload-start' then
      if f.uploading then raise exception '该照片正在上传，请稍后重试'; end if;
      update public.memory_share_files set uploading=true where share_id=sid and file_id=f.file_id;
    else
      update public.memory_share_files set uploading=false,uploaded=uploaded or p_action='upload-done' where share_id=sid and file_id=f.file_id;
    end if;
    return jsonb_build_object('fileId',f.file_id,'bytes',f.bytes);
  end if;
  if p_action='finish' then
    if s.state not in('draft','published') then raise exception '上传会话已关闭'; end if;
    if s.state='draft' then
      if exists(select 1 from public.memory_share_files where share_id=sid and (not uploaded or uploading)) then raise exception '照片尚未全部上传'; end if;
      select * into old from public.memory_shelf_shares where share_id=s.target_id for update;
      if found then
        if old.owner_id is distinct from s.owner_id or old.management_hash is distinct from s.management_hash then raise exception '无权更新此书架'; end if;
        if old.snapshot->>'version'='1' then
          -- Legacy JSON is removed atomically with directory replacement.
          update public.memory_share_capacity set used_bytes=used_bytes-old.stored_bytes where id in('global',s.owner_id::text);
        else
          update public.memory_share_sessions set state='retired' where share_id=(old.snapshot->>'storagePrefix')::uuid;
        end if;
      end if;
      insert into public.memory_shelf_shares(share_id,management_hash,snapshot,owner_id,stored_bytes)
      values(s.target_id,s.management_hash,s.manifest||jsonb_build_object('storagePrefix',sid),s.owner_id,s.total_bytes)
      on conflict(share_id) do update set snapshot=excluded.snapshot,stored_bytes=excluded.stored_bytes,updated_at=now();
      update public.memory_share_capacity set reserved_bytes=reserved_bytes-s.total_bytes,used_bytes=used_bytes+s.total_bytes where id in('global',s.owner_id::text);
      update public.memory_share_sessions set state='published' where share_id=sid;
    end if;
    return jsonb_build_object('shareId',s.target_id,'cleanup',coalesce((select jsonb_agg(jsonb_build_object('shareId',r.share_id,'files',r.manifest->'files')) from public.memory_share_sessions r where r.target_id=s.target_id and r.state='retired'),'[]'::jsonb));
  end if;
  if p_action='cancel-start' then
    if s.state not in('draft','cancelling','cancelled') then raise exception '已发布书架不能取消'; end if;
    if exists(select 1 from public.memory_share_files where share_id=sid and uploading) then raise exception '上传尚未结束，暂不能清理草稿'; end if;
    if s.state='draft' then update public.memory_share_sessions set state='cancelling' where share_id=sid; end if;
    return jsonb_build_object('files',s.manifest->'files','state',s.state);
  end if;
  if p_action='cancel-done' then
    if s.state='cancelling' then
      update public.memory_share_capacity set reserved_bytes=reserved_bytes-s.total_bytes where id in('global',s.owner_id::text);
      update public.memory_share_sessions set state='cancelled' where share_id=sid;
    elsif s.state<>'cancelled' then raise exception '草稿尚未开始清理'; end if;
    return jsonb_build_object('cancelled',true);
  end if;
  if p_action='cleanup-done' then
    if s.state='retired' then
      update public.memory_share_capacity set used_bytes=used_bytes-s.total_bytes where id in('global',s.owner_id::text);
      update public.memory_share_sessions set state='cancelled' where share_id=sid;
    elsif s.state<>'cancelled' then raise exception '书架仍在使用，不能清理'; end if;
    return jsonb_build_object('cleaned',true);
  end if;
  raise exception '不支持的请求';
end $$;
revoke all on function public.memory_share_transaction(text,jsonb) from public,anon,authenticated;
grant execute on function public.memory_share_transaction(text,jsonb) to service_role;
commit;

-- IMPORTANT: a process crash with uploading=true deliberately keeps reservation.
-- Maintenance must check Storage and reconcile the file before clearing that flag.
-- Never delete Storage metadata directly or release quotas before object deletion.
-- No automatic expiry/deletion of published shares. Failed cleanup stays counted.
