-- =========================================================
-- Neyora — Round 7 migration: Inventory + Invoices
-- Run this in the Supabase SQL editor AFTER 001 (schema.sql) and 002.
-- =========================================================

-- ---------- Link orders to a generated pattern (optional) ----------
alter table public.orders add column pattern_id uuid references public.patterns(id) on delete set null;

-- ---------- Inventory ----------
create type public.inventory_category as enum ('fabric', 'thread', 'accessory', 'needle', 'zip', 'button');

create table public.inventory_items (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  category public.inventory_category not null default 'fabric',
  quantity numeric(10,2) not null default 0,
  unit text not null default 'pcs',
  reorder_level numeric(10,2) not null default 0,
  cost_per_unit numeric(10,2),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index inventory_items_owner_id_idx on public.inventory_items(owner_id);

create trigger set_updated_at before update on public.inventory_items
  for each row execute procedure public.set_updated_at();

alter table public.inventory_items enable row level security;
create policy "Owners manage their own inventory" on public.inventory_items
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ---------- Invoices ----------
create table public.invoices (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  order_id uuid not null references public.orders(id) on delete cascade,
  invoice_number text not null,
  fabric_cost numeric(10,2) not null default 0,
  labor_cost numeric(10,2) not null default 0,
  accessories_cost numeric(10,2) not null default 0,
  tax_percent numeric(5,2) not null default 0,
  subtotal numeric(10,2) not null default 0,
  tax_amount numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  issued_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

create index invoices_owner_id_idx on public.invoices(owner_id);
create index invoices_order_id_idx on public.invoices(order_id);
create unique index invoices_owner_invoice_number_idx on public.invoices(owner_id, invoice_number);

alter table public.invoices enable row level security;
create policy "Owners manage their own invoices" on public.invoices
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
