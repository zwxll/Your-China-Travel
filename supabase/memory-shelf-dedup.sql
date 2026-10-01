-- Install AFTER memory-shelf-storage.sql. Deploy the v3 writer before enabling
-- shared objects; never roll back to the old whole-session Storage deletion.
begin;
alter table public.memory_share_capacity add column if not exists clearing boolean not null default false;
alter table public.memory_share_sessions add column if not exists protocol_version integer not null default 2;
alter table public.memory_share_sessions add column if not exists migration_source uuid;
alter table public.memory_share_sessions add column if not exists migration_snapshot jsonb;
create index if not exists memory_share_sessions_migration on public.memory_share_sessions(migration_source);
create table if not exists public.memory_share_objects(
  id uuid primary key default gen_random_uuid(),owner_id uuid not null,
  sha256 text not null check(sha256 ~ '^[a-f0-9]{64}$'),
  bytes integer not null check(bytes between 1 and 307200),storage_path text not null unique,
  state text not null check(state in('pending','ready','deleting','deleted')),
  upload_session_id uuid,charged_as text not null default 'reserved' check(charged_as in('used','reserved'))
);
create unique index if not exists memory_share_objects_owner_hash on public.memory_share_objects(owner_id,sha256) where state<>'deleted';
create table if not exists public.memory_share_object_refs(
  session_id uuid not null references public.memory_share_sessions(share_id),
  file_id text not null,object_id uuid not null references public.memory_share_objects(id),
  primary key(session_id,file_id)
);
create index if not exists memory_share_object_refs_object on public.memory_share_object_refs(object_id);
create index if not exists memory_share_sessions_owner on public.memory_share_sessions(owner_id,target_id);
create index if not exists memory_shelf_shares_owner on public.memory_shelf_shares(owner_id);
create table if not exists public.memory_share_cleanup(
  id uuid primary key default gen_random_uuid(),owner_id uuid not null,
  object_id uuid references public.memory_share_objects(id),storage_path text not null unique,
  bytes bigint not null check(bytes>=0),charged_as text not null check(charged_as in('used','reserved')),
  done boolean not null default false
);
create index if not exists memory_share_cleanup_owner on public.memory_share_cleanup(owner_id) where not done;
create index if not exists memory_share_cleanup_object on public.memory_share_cleanup(object_id);
create table if not exists public.memory_share_revoked_targets(target_id uuid primary key,owner_id uuid not null,revoked_at timestamptz not null default now());
create index if not exists memory_share_revoked_owner on public.memory_share_revoked_targets(owner_id);
alter table public.memory_share_objects enable row level security;
alter table public.memory_share_object_refs enable row level security;
alter table public.memory_share_cleanup enable row level security;
alter table public.memory_share_revoked_targets enable row level security;
revoke all on public.memory_share_objects,public.memory_share_object_refs,public.memory_share_cleanup,public.memory_share_revoked_targets from public,anon,authenticated;
grant select,insert,update,delete on public.memory_share_objects,public.memory_share_object_refs,public.memory_share_cleanup,public.memory_share_revoked_targets to service_role;

create or replace function public.memory_share_dedup_transaction(p_action text,p_input jsonb)
returns jsonb language plpgsql security invoker set search_path=public,pg_temp as $$
declare
  g memory_share_capacity%rowtype;b memory_share_capacity%rowtype;
  s memory_share_sessions%rowtype;o memory_share_objects%rowtype;c memory_share_cleanup%rowtype;
  old memory_shelf_shares%rowtype;
  browser uuid:=(p_input->>'browserId')::uuid;sid uuid:=(p_input->>'shareId')::uuid;
  target uuid;obj uuid;entry jsonb;amount bigint:=0;slots integer;result jsonb;revoked jsonb:='[]';
begin
  select * into strict g from memory_share_capacity where id='global' for update;
  if browser is null or p_input->>'browserHash' is null then raise exception '匿名凭证无效';end if;
  insert into memory_share_capacity(id,credential_hash) values(browser::text,p_input->>'browserHash') on conflict do nothing;
  select * into strict b from memory_share_capacity where id=browser::text for update;
  if b.credential_hash is distinct from p_input->>'browserHash' then raise exception '匿名凭证无效';end if;
  if p_action in('begin','migrate-start','migrate-file','migrate-finish','finish') and b.clearing then raise exception '云端分享正在清理中，请完成清理后重试';end if;
  if p_action='claim' then
    if exists(select 1 from memory_share_revoked_targets where target_id=sid and owner_id=browser) then return jsonb_build_object('claimed',false,'revoked',true);end if;
    if b.clearing then raise exception '云端分享正在清理中，请完成清理后重试';end if;
    select * into old from memory_shelf_shares where share_id=sid for update;
    if not found then return jsonb_build_object('claimed',false);end if;
    if old.management_hash is distinct from p_input->>'managementHash' then raise exception '分享管理凭证无效';end if;
    if old.owner_id is not null and old.owner_id<>browser then raise exception '无权管理此分享';end if;
    if old.owner_id is null then
      update memory_shelf_shares set owner_id=browser where share_id=sid;
      update memory_share_capacity set used_bytes=used_bytes+old.stored_bytes where id=browser::text;
    end if;
    return jsonb_build_object('claimed',true,'version',old.snapshot->'version');
  end if;
  if p_action in('migrate-read','migrate-start') then
    if b.clearing then raise exception '云端分享正在清理中，请完成清理后重试';end if;
    select * into old from memory_shelf_shares where share_id=sid and owner_id=browser;
    if not found or old.management_hash is distinct from p_input->>'managementHash' then raise exception '分享管理凭证无效';end if;
    if old.snapshot->>'version'='3' then return jsonb_build_object('done',true);end if;
    if p_action='migrate-read' then return jsonb_build_object('snapshot',old.snapshot);end if;
    if old.snapshot is distinct from p_input->'expectedSnapshot' then raise exception '旧分享已更新，请重新迁移';end if;
    select * into s from memory_share_sessions where owner_id=browser and migration_source=sid and state='draft' order by last_active desc limit 1;
    if not found then
      insert into memory_share_sessions(share_id,target_id,owner_id,management_hash,manifest,total_bytes,protocol_version,migration_source,migration_snapshot)
      values(gen_random_uuid(),sid,browser,p_input->>'managementHash',p_input->'manifest',(p_input->'manifest'->>'totalBytes')::bigint,3,sid,old.snapshot) returning * into s;
    elsif s.migration_snapshot is distinct from old.snapshot then raise exception '旧分享已更新，请重新迁移';end if;
    return jsonb_build_object('shareId',s.share_id,'uploadedIds',coalesce((select jsonb_agg(r.file_id) from memory_share_object_refs r join memory_share_objects x on x.id=r.object_id where r.session_id=s.share_id and x.state='ready'),'[]'));
  end if;
  if p_action='begin' then
    target:=coalesce((p_input->>'targetId')::uuid,sid);
    if exists(select 1 from memory_share_revoked_targets where target_id=target) then raise exception '此分享链接已失效，请重新分享';end if;
    select * into old from memory_shelf_shares where share_id=target;
    if found and (old.owner_id is distinct from browser or old.management_hash is distinct from p_input->>'managementHash') then raise exception '无权更新此书架';end if;
    select * into s from memory_share_sessions where share_id=sid;
    if found then
      if s.owner_id<>browser or s.management_hash is distinct from p_input->>'managementHash' or s.target_id<>target or s.manifest is distinct from p_input->'manifest' or s.protocol_version<>3 then raise exception '上传会话不匹配';end if;
      if s.state not in('draft','published') then raise exception '上传会话已关闭';end if;
    else
      select count(*) into slots from memory_share_quota where source_hash=p_input->>'sourceHash' and day=current_date;
      if slots>=20 then raise exception '今天生成海报次数较多，请明天再试';end if;
      insert into memory_share_quota values(p_input->>'sourceHash',current_date,slots);
      insert into memory_share_sessions(share_id,target_id,owner_id,management_hash,manifest,total_bytes,protocol_version)
      values(sid,target,browser,p_input->>'managementHash',p_input->'manifest',(p_input->'manifest'->>'totalBytes')::bigint,3);
      for entry in select value from jsonb_array_elements(p_input->'manifest'->'files') order by value->>'sha256' loop
        select * into o from memory_share_objects where owner_id=browser and sha256=entry->>'sha256' and state<>'deleted' for update;
        if found then
          if o.bytes<>(entry->>'bytes')::integer then raise exception '照片与上传清单不符';end if;
          if o.state='deleting' then raise exception '照片正在清理，请稍后重试';end if;
        else
          obj:=gen_random_uuid();
          insert into memory_share_objects(id,owner_id,sha256,bytes,storage_path,state)
          values(obj,browser,entry->>'sha256',(entry->>'bytes')::integer,browser::text||'/'||obj::text||'.jpg','pending') returning * into o;
          amount:=amount+o.bytes;
        end if;
        insert into memory_share_object_refs values(sid,entry->>'fileId',o.id);
      end loop;
      if b.used_bytes+b.reserved_bytes+amount>50000000 then raise exception '此匿名浏览器累计分享超过 50MB';end if;
      if g.used_bytes+g.reserved_bytes+amount>800000000 then raise exception '全站分享空间达到 800MB 上限';end if;
      update memory_share_capacity set reserved_bytes=reserved_bytes+amount where id in('global',browser::text);
    end if;
    return jsonb_build_object('shareId',sid,'newBytes',amount,'uploadedIds',coalesce((select jsonb_agg(r.file_id order by r.file_id) from memory_share_object_refs r join memory_share_objects x on x.id=r.object_id where r.session_id=sid and x.state='ready'),'[]'),'reusedIds',coalesce((select jsonb_agg(r.file_id order by r.file_id) from memory_share_object_refs r join memory_share_objects x on x.id=r.object_id where r.session_id=sid and x.state='ready'),'[]'));
  end if;
  if p_action in('upload-start','upload-done','upload-failed','finish','cancel','migrate-file','migrate-finish') then
    select * into s from memory_share_sessions where share_id=sid for update;
    if not found or s.owner_id<>browser or s.management_hash is distinct from p_input->>'managementHash' or s.protocol_version<>3 then raise exception '分享管理凭证无效';end if;
    if p_action in('migrate-file','migrate-finish') then
      select * into old from memory_shelf_shares where share_id=s.migration_source and owner_id=browser;
      if not found or old.management_hash is distinct from s.management_hash or old.snapshot is distinct from s.migration_snapshot or s.state<>'draft' then raise exception '旧分享已更新，请重新迁移';end if;
      if exists(select 1 from memory_share_revoked_targets where target_id=s.target_id) then raise exception '此分享链接已失效，请重新分享';end if;
      if p_action='migrate-file' then
        select value into entry from jsonb_array_elements(s.manifest->'files') where value->>'fileId'=p_input->>'fileId';
        if entry is null or entry->>'sha256' is distinct from p_input->>'sha256' or (entry->>'bytes')::integer<>(p_input->>'bytes')::integer then raise exception '照片与上传清单不符';end if;
        select * into o from memory_share_objects where owner_id=browser and sha256=entry->>'sha256' and state<>'deleted' for update;
        if found then
          if o.bytes<>(entry->>'bytes')::integer then raise exception '照片与上传清单不符';end if;
          if o.state='deleting' then raise exception '照片正在清理，请稍后重试';end if;
        else
          obj:=gen_random_uuid();
          if old.snapshot->>'version'='2' then
            insert into memory_share_objects(id,owner_id,sha256,bytes,storage_path,state,charged_as)
            values(obj,browser,entry->>'sha256',(entry->>'bytes')::integer,(old.snapshot->>'storagePrefix')||'/'||(entry->>'fileId')||'.jpg','ready','used') returning * into o;
          else
            amount:=(entry->>'bytes')::integer;
            if b.used_bytes+b.reserved_bytes+amount>50000000 then raise exception '此匿名浏览器累计分享超过 50MB';end if;
            if g.used_bytes+g.reserved_bytes+amount>800000000 then raise exception '全站分享空间达到 800MB 上限';end if;
            insert into memory_share_objects(id,owner_id,sha256,bytes,storage_path,state)
            values(obj,browser,entry->>'sha256',amount,browser::text||'/'||obj::text||'.jpg','pending') returning * into o;
            update memory_share_capacity set reserved_bytes=reserved_bytes+amount where id in('global',browser::text);
          end if;
        end if;
        insert into memory_share_object_refs values(sid,entry->>'fileId',o.id) on conflict do nothing;
        return jsonb_build_object('ready',o.state='ready');
      end if;
    end if;
    if p_action='migrate-file' then null;
    elsif p_action like 'upload-%' then
      select x.* into o from memory_share_objects x join memory_share_object_refs r on r.object_id=x.id where r.session_id=sid and r.file_id=p_input->>'fileId' for update of x;
      -- Revocation keeps refs for in-flight uploads until their real settlement.
      if not found or o.bytes<>(p_input->>'bytes')::integer or o.sha256 is distinct from p_input->>'sha256' then raise exception '照片与上传清单不符';end if;
      if p_action='upload-start' then
        if s.state<>'draft' or b.clearing then raise exception '上传会话已关闭';end if;
        if o.state='ready' then return jsonb_build_object('ready',true,'path',o.storage_path);end if;
        if o.state<>'pending' then raise exception '照片正在清理，请稍后重试';end if;
        if o.upload_session_id is not null then raise exception '该照片正在上传，请稍后重试';end if;
        update memory_share_objects set upload_session_id=sid where id=o.id;
        return jsonb_build_object('ready',false,'path',o.storage_path);
      else
        if o.upload_session_id is distinct from sid then
          if o.state='ready' then return jsonb_build_object('ready',true);end if;
          raise exception '上传会话不匹配';
        end if;
        if p_action='upload-done' and o.state='pending' then
          update memory_share_objects set state='ready',charged_as='used' where id=o.id;
          update memory_share_capacity set reserved_bytes=reserved_bytes-o.bytes,used_bytes=used_bytes+o.bytes where id in('global',browser::text);
        end if;
        update memory_share_objects set upload_session_id=null where id=o.id;
      end if;
    elsif p_action in('finish','migrate-finish') then
      if exists(select 1 from memory_share_revoked_targets where target_id=s.target_id) then raise exception '此分享链接已失效，请重新分享';end if;
      if s.state not in('draft','published') then raise exception '上传会话已关闭';end if;
      if s.state='draft' then
        if (select count(*) from memory_share_object_refs where session_id=sid)<>jsonb_array_length(s.manifest->'files') or exists(select 1 from memory_share_object_refs r join memory_share_objects x on x.id=r.object_id where r.session_id=sid and x.state<>'ready') then raise exception '照片尚未全部上传';end if;
        select * into old from memory_shelf_shares where share_id=s.target_id;
        if found and (old.owner_id is distinct from browser or old.management_hash is distinct from s.management_hash) then raise exception '无权更新此书架';end if;
        if found and old.snapshot->>'version'<>'3' then
          if p_action<>'migrate-finish' then raise exception '请先完成旧分享迁移';end if;
          if old.snapshot->>'version'='1' then
            update memory_share_capacity set used_bytes=used_bytes-old.stored_bytes where id in('global',browser::text);
          else
            for entry in select value from jsonb_array_elements(old.snapshot->'files') loop
              if not exists(select 1 from memory_share_objects where storage_path=(old.snapshot->>'storagePrefix')||'/'||(entry->>'fileId')||'.jpg' and state<>'deleted') then
                insert into memory_share_cleanup(owner_id,storage_path,bytes,charged_as)
                values(browser,(old.snapshot->>'storagePrefix')||'/'||(entry->>'fileId')||'.jpg',(entry->>'bytes')::bigint,'used') on conflict do nothing;
              end if;
            end loop;
            update memory_share_sessions set state='cancelled' where share_id=(old.snapshot->>'storagePrefix')::uuid;
          end if;
        end if;
        update memory_share_sessions set state='retired' where target_id=s.target_id and share_id<>sid and state='published';
        insert into memory_shelf_shares(share_id,management_hash,snapshot,owner_id,stored_bytes)
        values(s.target_id,s.management_hash,s.manifest||jsonb_build_object('storagePrefix',sid,'objects',(select jsonb_object_agg(r.file_id,x.storage_path) from memory_share_object_refs r join memory_share_objects x on x.id=r.object_id where r.session_id=sid)),browser,0)
        on conflict(share_id) do update set snapshot=excluded.snapshot,stored_bytes=0,updated_at=now();
        update memory_share_sessions set state='published',last_active=now() where share_id=sid;
      end if;
      result:=jsonb_build_object('shareId',s.target_id);
    else
      if s.state='published' then raise exception '已发布书架不能取消';end if;
      update memory_share_sessions set state='cancelled' where share_id=sid;
      result:=jsonb_build_object('cancelled',true);
    end if;
  elsif p_action in('revoke','clear') then
    if p_action='clear' then
      update memory_share_capacity set clearing=true where id=browser::text;
    elsif not exists(select 1 from memory_shelf_shares where share_id=sid and owner_id=browser)
      and not exists(select 1 from memory_share_sessions where owner_id=browser and (target_id=sid or share_id=sid))
      and not exists(select 1 from memory_share_revoked_targets where owner_id=browser and target_id=sid) then raise exception '无权管理此分享';end if;
    insert into memory_share_revoked_targets(target_id,owner_id)
    select target_id,browser from memory_share_sessions where owner_id=browser and (p_action='clear' or target_id=sid or share_id=sid)
    union select share_id,browser from memory_shelf_shares where owner_id=browser and (p_action='clear' or share_id=sid)
    on conflict do nothing;
    select coalesce(jsonb_agg(target_id),'[]') into revoked from memory_share_revoked_targets where owner_id=browser and (p_action='clear' or target_id=sid or target_id in(select target_id from memory_share_sessions where share_id=sid and owner_id=browser));
    for old in select * from memory_shelf_shares where owner_id=browser and share_id in(select value::text::uuid from jsonb_array_elements_text(revoked)) loop
      if old.snapshot->>'version'='1' then
        update memory_share_capacity set used_bytes=used_bytes-old.stored_bytes where id in('global',browser::text);
        amount:=amount+old.stored_bytes;
      end if;
      delete from memory_shelf_shares where share_id=old.share_id;
    end loop;
    -- Legacy files have not been adopted yet. Their exact old paths remain charged.
    for s in select * from memory_share_sessions where owner_id=browser and (p_action='clear' or target_id in(select value::uuid from jsonb_array_elements_text(revoked))) and state not in('cancelled') loop
      if s.protocol_version=2 then
        if exists(select 1 from memory_share_files where share_id=s.share_id and uploading) then raise exception '上传尚未结束，暂不能清理草稿';end if;
        for entry in select value from jsonb_array_elements(s.manifest->'files') loop
          if not exists(select 1 from memory_share_objects where storage_path=s.share_id::text||'/'||(entry->>'fileId')||'.jpg' and state<>'deleted') then
          insert into memory_share_cleanup(owner_id,storage_path,bytes,charged_as)
          values(browser,s.share_id::text||'/'||(entry->>'fileId')||'.jpg',(entry->>'bytes')::bigint,case when s.state in('published','retired') then 'used' else 'reserved' end) on conflict do nothing;
          end if;
        end loop;
      end if;
      update memory_share_sessions set state='cancelled' where share_id=s.share_id;
    end loop;
    result:=jsonb_build_object('revokedIds',revoked,'freedBytes',amount);
  elsif p_action='cleanup-done' then
    select * into c from memory_share_cleanup where id=(p_input->>'cleanupId')::uuid and owner_id=browser for update;
    if not found then raise exception '无权管理此分享';end if;
    if not c.done then
      if c.charged_as='used' then update memory_share_capacity set used_bytes=used_bytes-c.bytes where id in('global',browser::text);
      else update memory_share_capacity set reserved_bytes=reserved_bytes-c.bytes where id in('global',browser::text);end if;
      update memory_share_cleanup set done=true where id=c.id;
      update memory_share_objects set state='deleted' where id=c.object_id;
    end if;
    result:=jsonb_build_object('freedBytes',case when c.done then 0 else c.bytes end);
  elsif p_action not in('quota','list','cleanup-list') then raise exception '不支持的请求';
  end if;
  -- In-flight uploads retain refs even when their session was revoked. Remove only
  -- after settlement; no one can delete the object while an HTTP write is running.
  delete from memory_share_object_refs r using memory_share_sessions z,memory_share_objects x
  where r.session_id=z.share_id and r.object_id=x.id and z.owner_id=browser and z.state in('cancelled','retired') and x.upload_session_id is null;
  for o in select * from memory_share_objects x where owner_id=browser and state in('pending','ready') and upload_session_id is null and not exists(select 1 from memory_share_object_refs r where r.object_id=x.id)
    and not exists(select 1 from memory_shelf_shares z,jsonb_array_elements(z.snapshot->'files') f where z.owner_id=browser and z.snapshot->>'version'='2' and x.storage_path=(z.snapshot->>'storagePrefix')||'/'||(f->>'fileId')||'.jpg') order by sha256 for update loop
    update memory_share_objects set state='deleting' where id=o.id;
    insert into memory_share_cleanup(owner_id,object_id,storage_path,bytes,charged_as) values(browser,o.id,o.storage_path,o.bytes,o.charged_as) on conflict do nothing;
  end loop;
  update memory_share_capacity set clearing=false where id=browser::text and clearing and used_bytes=0 and reserved_bytes=0 and not exists(select 1 from memory_share_cleanup where owner_id=browser and not done);
  select * into b from memory_share_capacity where id=browser::text;
  select * into g from memory_share_capacity where id='global';
  entry:=jsonb_build_object('browserUsed',b.used_bytes,'browserReserved',b.reserved_bytes,'browserLimit',50000000,'globalUsed',g.used_bytes,'globalReserved',g.reserved_bytes,'globalLimit',800000000,'clearing',b.clearing,'cleanupPending',exists(select 1 from memory_share_cleanup where owner_id=browser and not done) or exists(select 1 from memory_share_objects x join memory_share_object_refs r on r.object_id=x.id join memory_share_sessions z on z.share_id=r.session_id where x.owner_id=browser and x.upload_session_id is not null and z.state='cancelled'));
  if p_action='quota' then return entry;end if;
  if p_action='cleanup-list' then return jsonb_build_object('files',coalesce((select jsonb_agg(jsonb_build_object('id',id,'path',storage_path)) from memory_share_cleanup where owner_id=browser and not done),'[]'));end if;
  if p_action='list' then
    return jsonb_build_object('quota',entry,'cleanupPending',entry->'cleanupPending','shares',coalesce((
      select jsonb_agg(v) from (
        select jsonb_build_object('shareId',share_id,'kind','published','provinces',jsonb_path_query_array(snapshot,'$.provinces[*].name'),'photoCount',(select count(*) from jsonb_path_query(snapshot,'$.provinces[*].cities[*].photos[*]')),'updatedAt',updated_at) v from memory_shelf_shares where owner_id=browser
        union all select jsonb_build_object('shareId',share_id,'kind','draft','provinces',jsonb_path_query_array(manifest,'$.provinces[*].name'),'photoCount',(select count(*) from jsonb_path_query(manifest,'$.provinces[*].cities[*].photos[*]')),'updatedAt',last_active) from memory_share_sessions where owner_id=browser and state='draft'
      ) rows),'[]'));
  end if;
  return coalesce(result,'{}')||jsonb_build_object('quota',entry,'cleanupPending',b.clearing or (entry->>'cleanupPending')::boolean);
end $$;
revoke all on function public.memory_share_dedup_transaction(text,jsonb) from public,anon,authenticated;
grant execute on function public.memory_share_dedup_transaction(text,jsonb) to service_role;
-- An old worker must fail before its legacy whole-session Storage deletion.
revoke execute on function public.memory_share_transaction(text,jsonb) from service_role;
commit;
