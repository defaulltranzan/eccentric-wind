-- Himalayan Magic Adventure — database schema
-- Run once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE).
--
-- Security model: Row Level Security is ON for every table and there are NO
-- public policies. Nothing is readable or writable with the anon key. Only the
-- website's server (holding SUPABASE_SERVICE_ROLE_KEY) can read or write, and it
-- only ever exposes published content and accepts validated bookings.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------- content
-- Treks, expeditions and stories share one shape. `data` holds the full record
-- exactly as the page renderers read it (itinerary, FAQ, costs, article body…);
-- the columns beside it are for listing, ordering and publishing.

create table if not exists public.treks (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 80),
  title       text not null,
  published   boolean not null default false,
  featured    boolean not null default false,
  sort_order  integer not null default 0,
  kind        text,
  data        jsonb not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table if not exists public.expeditions (like public.treks including all);
create table if not exists public.stories (like public.treks including all);

alter table public.expeditions drop constraint if exists expeditions_kind_check;
alter table public.expeditions add constraint expeditions_kind_check check (kind in ('peak', 'eight-thousander'));

create index if not exists treks_published_order_idx       on public.treks (published, sort_order);
create index if not exists expeditions_published_order_idx on public.expeditions (published, sort_order);
create index if not exists stories_published_order_idx     on public.stories (published, sort_order);

-- ---------------------------------------------------------------- bookings
create table if not exists public.bookings (
  id              uuid primary key default gen_random_uuid(),
  ref             text not null unique,
  name            text not null,
  email           text not null,
  phone           text,
  trip_type       text not null default 'custom' check (trip_type in ('trek', 'expedition', 'custom', 'newsletter')),
  trip_slug       text,
  trip_name       text not null,
  preferred_date  date,
  people          integer not null default 1 check (people between 1 and 50),
  message         text,
  status          text not null default 'NEW' check (status in ('NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')),
  notes           text,
  source          text not null default 'contact-form' check (source in ('contact-form', 'trip-page', 'newsletter')),
  user_agent      text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists bookings_created_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx  on public.bookings (status);

-- ---------------------------------------------------------------- updated_at
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  foreach t in array array['treks', 'expeditions', 'stories', 'bookings'] loop
    execute format('drop trigger if exists %I_touch on public.%I', t, t);
    execute format('create trigger %I_touch before update on public.%I for each row execute function public.touch_updated_at()', t, t);
    execute format('alter table public.%I enable row level security', t);
  end loop;
end;
$$;

-- ---------------------------------------------------------------- image storage
-- Public bucket for trek / expedition / story images (uploads go through the
-- server; anyone can view the resulting image URLs, nobody else can upload).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 8388608, array['image/jpeg', 'image/png', 'image/webp', 'image/avif'])
on conflict (id) do update set public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
