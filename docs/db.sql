-- Supabase/Postgres schema for Testimonial CMS
-- Run in Supabase SQL editor or psql.

create extension if not exists "pgcrypto";

create table if not exists public.entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text,
  media_url text,
  media_source integer not null default 0,
  summary text,
  date timestamptz not null default now(),
  tags text[],
  author text not null,
  status text not null check (status in ('draft', 'approved')) default 'draft',
  slug text not null,
  org text not null default 'default',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists entries_org_slug_key on public.entries (org, slug);
create index if not exists entries_org_status_idx on public.entries (org, status);
create index if not exists entries_tags_gin on public.entries using gin (tags);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_entries_updated_at on public.entries;
create trigger set_entries_updated_at
before update on public.entries
for each row execute function public.set_updated_at();

