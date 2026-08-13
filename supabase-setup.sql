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
