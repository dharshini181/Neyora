-- =========================================================
-- Neyora — Round 9 migration: Admin Panel
-- Run this in the Supabase SQL editor AFTER 001, 002, and 003.
-- =========================================================

-- SECURITY DEFINER function so admin-role checks in policies don't recurse
-- through RLS on the profiles table itself.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists(
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------- Admins can see everyone's profile + change roles ----------
create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

create policy "Admins can update any profile" on public.profiles
  for update using (public.is_admin()) with check (public.is_admin());

-- ---------- Admins can see revenue across every tailor's orders ----------
create policy "Admins can view all orders" on public.orders
  for select using (public.is_admin());

-- ---------- Admins manage the shared dress type catalogue ----------
create policy "Admins can insert dress types" on public.dress_types
  for insert with check (public.is_admin());
create policy "Admins can update dress types" on public.dress_types
  for update using (public.is_admin()) with check (public.is_admin());
create policy "Admins can delete dress types" on public.dress_types
  for delete using (public.is_admin());

-- ---------- Curated tutorials (admin-picked, shown before the YouTube search fallback) ----------
create table public.curated_tutorials (
  id uuid primary key default uuid_generate_v4(),
  dress_name text not null,
  step_title text not null,
  title text not null,
  youtube_url text not null,
  added_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index curated_tutorials_dress_step_idx on public.curated_tutorials(dress_name, step_title);

alter table public.curated_tutorials enable row level security;

create policy "Anyone can read curated tutorials" on public.curated_tutorials
  for select using (true);
create policy "Admins manage curated tutorials" on public.curated_tutorials
  for all using (public.is_admin()) with check (public.is_admin());

-- ---------- To try the Admin Panel: promote your own account ----------
-- Run this once, replacing the email, after you've signed up:
-- update public.profiles set role = 'admin'
-- where id = (select id from auth.users where email = 'you@example.com');
