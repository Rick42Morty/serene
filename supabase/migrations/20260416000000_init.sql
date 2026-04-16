-- Serene: initial schema
-- entries table stores a single mood + tags + note + AI response per row
-- Row-Level Security is enabled so users can only read/write their own rows.

create type public.mood_kind as enum (
  'happy',
  'calm',
  'neutral',
  'anxious',
  'overwhelmed',
  'sad',
  'angry'
);

-- user_id matches auth.users.id. We don't add a FK constraint here so this
-- migration can be run during `docker-compose up` before GoTrue has finished
-- creating the auth.users table. RLS (below) is the real safety layer —
-- auth.uid() = user_id ensures users can only touch their own rows.
create table public.entries (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null,
  mood        public.mood_kind not null,
  tags        text[] not null default '{}',
  note        text not null,
  ai_response text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index entries_user_created_idx
  on public.entries (user_id, created_at desc);

-- Keep updated_at fresh on UPDATE
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger entries_set_updated_at
before update on public.entries
for each row execute function public.set_updated_at();

alter table public.entries enable row level security;

create policy "entries_select_own"
  on public.entries for select
  using (auth.uid() = user_id);

create policy "entries_insert_own"
  on public.entries for insert
  with check (auth.uid() = user_id);

create policy "entries_update_own"
  on public.entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "entries_delete_own"
  on public.entries for delete
  using (auth.uid() = user_id);
