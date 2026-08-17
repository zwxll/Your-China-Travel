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
