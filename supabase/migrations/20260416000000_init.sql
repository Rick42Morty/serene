-- Serene: initial schema.
-- entries table stores a single mood + tags + note + AI response per row.
-- Row-Level Security is enabled so users can only read/write their own rows.

-- LOCAL-ONLY: bootstrap auth helpers for Docker-based `supabase start`.
-- On hosted Supabase the auth schema already exists and is fully managed,
-- so these statements are skipped via the DO block guard.
do $$
begin
  -- Only run when the auth schema does not yet contain uid()
  -- (i.e. during local initdb, before GoTrue has migrated).
  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'auth' and p.proname = 'uid'
  ) then
    create schema if not exists auth;

    create or replace function auth.uid()
    returns uuid
    language sql stable set search_path = '' as $fn$
      select nullif(
        coalesce(
          current_setting('request.jwt.claim.sub', true),
          (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
        ),
        ''
      )::uuid;
    $fn$;
  end if;
end
$$;

-- Transfer ownership so GoTrue can replace these on first boot (local only).
-- On hosted Supabase the role & ownership are already correct; errors are
-- harmless but we guard anyway.
do $$
begin
  alter function auth.uid()   owner to supabase_auth_admin;
  alter function auth.role()  owner to supabase_auth_admin;
  alter function auth.email() owner to supabase_auth_admin;
exception when others then
  -- On hosted Supabase we lack permission — that's fine, skip.
  null;
end
$$;

create type public.mood_kind as enum (
  'happy',
  'calm',
  'neutral',
  'anxious',
  'overwhelmed',
  'sad',
  'angry'
);

-- user_id matches auth.users.id. No FK constraint here because GoTrue hasn't
-- created auth.users yet at initdb time. RLS (below) is the real safety layer —
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
