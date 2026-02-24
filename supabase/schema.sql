-- Dangdangpang leaderboard/profile schema
-- Default target: public.profiles
-- If you use another schema, replace "public" below.

create schema if not exists public;

create table if not exists public.profiles (
  id uuid primary key,
  username text not null default '',
  high_score integer not null default 0,
  games_played integer not null default 0,
  updated_at timestamptz not null default now()
);

create index if not exists idx_profiles_high_score_desc
  on public.profiles (high_score desc);

alter table public.profiles enable row level security;

-- For this game we use anonymous device ids (no Supabase Auth login).
-- So allow read/write for anon role.
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles
  for select
  using (true);

drop policy if exists "profiles_insert_all" on public.profiles;
create policy "profiles_insert_all"
  on public.profiles
  for insert
  with check (true);

drop policy if exists "profiles_update_all" on public.profiles;
create policy "profiles_update_all"
  on public.profiles
  for update
  using (true)
  with check (true);
