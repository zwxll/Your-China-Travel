-- 「记录我的中国行」Supabase 初始化脚本
-- 在 Supabase 控制台的 SQL Editor 中完整运行一次。

create table if not exists public.travel_snapshots (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.travel_snapshots enable row level security;

revoke all on public.travel_snapshots from anon;
grant select, insert, update, delete on public.travel_snapshots to authenticated;

drop policy if exists "Users can read their own travel snapshot" on public.travel_snapshots;
create policy "Users can read their own travel snapshot"
on public.travel_snapshots for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own travel snapshot" on public.travel_snapshots;
create policy "Users can create their own travel snapshot"
on public.travel_snapshots for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own travel snapshot" on public.travel_snapshots;
create policy "Users can update their own travel snapshot"
on public.travel_snapshots for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'travel-media',
  'travel-media',
  false,
  10485760,
  array['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Users can read their own travel media" on storage.objects;
create policy "Users can read their own travel media"
on storage.objects for select
to authenticated
using (
  bucket_id = 'travel-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can upload their own travel media" on storage.objects;
create policy "Users can upload their own travel media"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'travel-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can update their own travel media" on storage.objects;
create policy "Users can update their own travel media"
on storage.objects for update
to authenticated
using (
  bucket_id = 'travel-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
)
with check (
  bucket_id = 'travel-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

drop policy if exists "Users can delete their own travel media" on storage.objects;
create policy "Users can delete their own travel media"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'travel-media'
  and (storage.foldername(name))[1] = (select auth.uid()::text)
);

-- ===== 公开城市点评（游客点评）=====
-- 每个用户对每个城市最多一条主点评，userId + cityKey 唯一
create table if not exists public.city_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  city_key text not null,
  city_name text not null,
  nickname text not null default '匿名旅行者',
  avatar_url text not null default '',
  rating numeric not null default 0,
  description text not null default '',
  visit_month text not null default '',
  tags jsonb not null default '[]'::jsonb,
  attractions jsonb not null default '[]'::jsonb,
  photos jsonb not null default '[]'::jsonb,
  visibility jsonb not null default '{}'::jsonb,
  source_updated_at timestamptz,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, city_key)
);

alter table public.city_reviews enable row level security;

revoke all on public.city_reviews from anon;
grant select on public.city_reviews to anon;
grant select, insert, update, delete on public.city_reviews to authenticated;

-- 所有人可读取公开点评（游客点评是公开内容）
drop policy if exists "Anyone can read city reviews" on public.city_reviews;
create policy "Anyone can read city reviews"
on public.city_reviews for select
to anon, authenticated
using (true);

-- 用户只能创建自己的点评
drop policy if exists "Users can create their own city review" on public.city_reviews;
create policy "Users can create their own city review"
on public.city_reviews for insert
to authenticated
with check ((select auth.uid()) = user_id);

-- 用户只能更新自己的点评
drop policy if exists "Users can update their own city review" on public.city_reviews;
create policy "Users can update their own city review"
on public.city_reviews for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- 用户只能删除自己的点评
drop policy if exists "Users can delete their own city review" on public.city_reviews;
create policy "Users can delete their own city review"
on public.city_reviews for delete
to authenticated
using ((select auth.uid()) = user_id);

-- ===== 用户建议与反馈 =====
-- 说明：「建议反馈」入口由浏览器通过 Edge Function `feedback` 写入，
-- 该函数使用 service_role 密钥插入（绕过 RLS），因此本表无需任何 RLS 策略，
-- 且撤销 anon/authenticated 的一切权限，客户端无法直接读取反馈（保护反馈隐私）。
create table if not exists public.user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  feedback_type text[] not null default '{}'::text[],
  category text not null default 'other',
  content text not null,
  rating smallint not null default 0,
  screenshots jsonb not null default '[]'::jsonb,
  page text not null default '',
  route text not null default '',
  module text not null default '',
  viewport text not null default '',
  browser text not null default '',
  app_version text not null default '',
  contact_email text not null default '',
  contact_allowed boolean not null default false,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.user_feedback enable row level security;

revoke all on public.user_feedback from anon;
revoke all on public.user_feedback from authenticated;

-- ===== 个人主页 · 公开资料（公开我的资料信息）=====
-- 每个用户一行个人公开资料。开启「公开我的资料信息」后写入 is_public=true；
-- 他人（含游客）点击点评头像时据此读取该用户的公开昵称/头像/家乡资料。
-- 邮箱、照片、账号登录信息不进入此表，永不对外公开。
create table if not exists public.public_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '旅行者',
  avatar_url text not null default '',
  life_motto text not null default '',
  is_public boolean not null default false,
  hometown_city_name text not null default '',
  hometown_description text not null default '',
  birth_month text not null default '',
  tags jsonb not null default '[]'::jsonb,
  attractions jsonb not null default '[]'::jsonb,
  visited_city_count integer not null default 0 check (visited_city_count >= 0),
  visited_province_count integer not null default 0 check (visited_province_count >= 0),
  travel_distance_km numeric not null default 0 check (travel_distance_km >= 0),
  updated_at timestamptz not null default now()
);

-- 兼容已经创建过 public_profiles 表的项目
alter table public.public_profiles add column if not exists life_motto text not null default '';
alter table public.public_profiles add column if not exists visited_city_count integer not null default 0 check (visited_city_count >= 0);
alter table public.public_profiles add column if not exists visited_province_count integer not null default 0 check (visited_province_count >= 0);
alter table public.public_profiles add column if not exists travel_distance_km numeric not null default 0 check (travel_distance_km >= 0);

alter table public.public_profiles enable row level security;

revoke all on public.public_profiles from anon;
grant select on public.public_profiles to anon;
grant select, insert, update, delete on public.public_profiles to authenticated;

-- 所有人可读取「已公开」的个人资料（未公开的仅本人可见）
drop policy if exists "Anyone can read public profiles" on public.public_profiles;
create policy "Anyone can read public profiles"
on public.public_profiles for select
to anon, authenticated
using (is_public = true or (select auth.uid()) = user_id);

-- 用户只能创建/更新自己的公开资料
drop policy if exists "Users can create their own public profile" on public.public_profiles;
create policy "Users can create their own public profile"
on public.public_profiles for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own public profile" on public.public_profiles;
create policy "Users can update their own public profile"
on public.public_profiles for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

-- 用户只能删除自己的公开资料
drop policy if exists "Users can delete their own public profile" on public.public_profiles;
create policy "Users can delete their own public profile"
on public.public_profiles for delete
to authenticated
using ((select auth.uid()) = user_id);
