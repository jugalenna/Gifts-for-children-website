-- Accounts: favourites and a gift list per child.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- Every table uses row level security (RLS): a logged-in adult can only see
-- and change their own rows, and visitors who aren't logged in see nothing.

-- Saved favourite gifts.
create table public.favourites (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  gift_id text not null check (char_length(gift_id) between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (user_id, gift_id)
);

-- A child the adult shops for. Kept minimal on purpose (see CLAUDE.md):
-- an optional nickname and an age, never a surname, birthday or photo.
-- The current age is worked out from age + age_recorded_on.
create table public.children (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  nickname text check (nickname is null or char_length(nickname) between 1 and 30),
  age smallint not null check (age between 0 and 10),
  age_recorded_on date not null default current_date,
  created_at timestamptz not null default now()
);

create index children_user_id_idx on public.children (user_id);

-- Gifts on a child's list.
create table public.child_gifts (
  child_id uuid not null references public.children (id) on delete cascade,
  gift_id text not null check (char_length(gift_id) between 1 and 100),
  created_at timestamptz not null default now(),
  primary key (child_id, gift_id)
);

alter table public.favourites enable row level security;
alter table public.children enable row level security;
alter table public.child_gifts enable row level security;

create policy "Own favourites only" on public.favourites
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Own children only" on public.children
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Own children's gift lists only" on public.child_gifts
  for all to authenticated
  using (exists (
    select 1 from public.children c
    where c.id = child_gifts.child_id and c.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.children c
    where c.id = child_gifts.child_id and c.user_id = (select auth.uid())
  ));

-- Newer Supabase projects only let the website reach tables that are granted
-- explicitly. Logged-in users get access (still limited by the policies
-- above); visitors who aren't logged in get none.
revoke all on public.favourites, public.children, public.child_gifts from anon;
grant select, insert, update, delete on public.favourites, public.children, public.child_gifts to authenticated;
