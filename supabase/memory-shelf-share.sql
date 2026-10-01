-- 匿名分享只保存主动公开的压缩照片副本，不读取账号旅行快照。
create table if not exists public.memory_shelf_shares (
  share_id uuid primary key,
  management_hash text not null check (length(management_hash) = 64),
  snapshot jsonb not null check (octet_length(snapshot::text) <= 12582912),
  updated_at timestamptz not null default now()
);
alter table public.memory_shelf_shares enable row level security;
revoke all on public.memory_shelf_shares from anon, authenticated;

-- 每个来源每天最多 20 次发布，唯一约束保证并发请求不能突破上限。
create table if not exists public.memory_share_quota (
  source_hash text not null,
  day date not null,
  slot smallint not null check (slot between 0 and 19),
  primary key (source_hash, day, slot)
);
alter table public.memory_share_quota enable row level security;
revoke all on public.memory_share_quota from anon, authenticated;
