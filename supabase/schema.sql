-- =========================================================
-- Neyora — Core Supabase schema (Round 2)
-- Run this in the Supabase SQL editor for your project.
-- More tables (inventory, invoices, patterns...) arrive in later rounds.
-- =========================================================

-- ---------- Extensions ----------
create extension if not exists "uuid-ossp";

-- ---------- Enums ----------
create type public.gender_type as enum ('male', 'female', 'other');
create type public.order_status as enum ('pending', 'in_progress', 'completed', 'delivered', 'cancelled');
create type public.user_role as enum ('owner', 'staff', 'admin');

-- ---------- Profiles (extends auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  business_name text,
  phone text,
  role public.user_role not null default 'owner',
  preferred_language text not null default 'en',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Auto-create a profile row whenever a new auth user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, business_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'business_name',
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------- Customers ----------
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  phone text not null,
  email text,
  address text,
  gender public.gender_type,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index customers_owner_id_idx on public.customers(owner_id);

-- ---------- Measurements ----------
create table public.measurements (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  label text not null default 'Standard',
  bust numeric(5,2),
  waist numeric(5,2),
  hip numeric(5,2),
  shoulder numeric(5,2),
  arm_round numeric(5,2),
  sleeve_length numeric(5,2),
  neck numeric(5,2),
  dress_length numeric(5,2),
  height numeric(5,2),
  unit text not null default 'inch',
  created_at timestamptz not null default now()
);

create index measurements_customer_id_idx on public.measurements(customer_id);

-- ---------- Dress types (seeded reference data) ----------
create table public.dress_types (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  category text not null default 'general',
  base_fabric_meters numeric(5,2),
  icon text
);

insert into public.dress_types (name, category, base_fabric_meters) values
  ('Anarkali', 'women', 5.5),
  ('Kurti', 'women', 2.5),
  ('Salwar', 'women', 2.0),
  ('Churidar', 'women', 2.25),
  ('Blouse', 'women', 1.0),
  ('Lehenga', 'women', 6.5),
  ('Gown', 'women', 4.5),
  ('Frock', 'kids', 1.75),
  ('Men''s Shirt', 'men', 2.25),
  ('Kids Wear', 'kids', 1.5);

-- ---------- Orders ----------
create table public.orders (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  dress_type_id uuid references public.dress_types(id),
  measurement_id uuid references public.measurements(id),
  status public.order_status not null default 'pending',
  trial_date date,
  delivery_date date,
  total_amount numeric(10,2) not null default 0,
  advance_paid numeric(10,2) not null default 0,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_owner_id_idx on public.orders(owner_id);
create index orders_delivery_date_idx on public.orders(delivery_date);

-- ---------- updated_at triggers ----------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at before update on public.profiles
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.customers
  for each row execute procedure public.set_updated_at();
create trigger set_updated_at before update on public.orders
  for each row execute procedure public.set_updated_at();

-- ---------- Row Level Security ----------
alter table public.profiles enable row level security;
alter table public.customers enable row level security;
alter table public.measurements enable row level security;
alter table public.orders enable row level security;
alter table public.dress_types enable row level security;

create policy "Profiles are self-viewable" on public.profiles
  for select using (auth.uid() = id);
create policy "Profiles are self-editable" on public.profiles
  for update using (auth.uid() = id);

create policy "Owners manage their own customers" on public.customers
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Owners manage their own measurements" on public.measurements
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Owners manage their own orders" on public.orders
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

create policy "Dress types are readable by everyone" on public.dress_types
  for select using (true);

-- ---------- Dashboard stats view ----------
create or replace view public.dashboard_stats as
select
  o.owner_id,
  count(distinct c.id) as total_customers,
  count(distinct o.id) as total_orders,
  count(distinct o.id) filter (where o.status = 'pending') as pending_orders,
  coalesce(sum(o.total_amount) filter (where o.status <> 'cancelled'), 0) as revenue,
  count(distinct o.id) filter (where o.delivery_date = current_date) as today_deliveries
from public.orders o
full join public.customers c on c.owner_id = o.owner_id
group by o.owner_id;
