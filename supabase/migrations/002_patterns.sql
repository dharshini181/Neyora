-- =========================================================
-- Neyora — Round 4 migration: Pattern Studio
-- Run this in the Supabase SQL editor AFTER supabase/schema.sql
-- =========================================================

create table public.patterns (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  customer_id uuid not null references public.customers(id) on delete cascade,
  measurement_id uuid references public.measurements(id) on delete set null,
  dress_type_id uuid not null references public.dress_types(id),
  pattern_data jsonb not null,   -- PatternResult from lib/pattern-engine/generate.ts
  fabric_data jsonb not null,    -- FabricResult from lib/pattern-engine/generate.ts
  ai_notes text,                 -- Gemini-generated stitching tips (null if no API key set)
  ai_generated boolean not null default false,
  created_at timestamptz not null default now()
);

create index patterns_owner_id_idx on public.patterns(owner_id);
create index patterns_customer_id_idx on public.patterns(customer_id);

alter table public.patterns enable row level security;

create policy "Owners manage their own patterns" on public.patterns
  for all using (auth.uid() = owner_id) with check (auth.uid() = owner_id);
