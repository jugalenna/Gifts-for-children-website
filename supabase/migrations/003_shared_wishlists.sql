-- Shareable birthday wishlists.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- A parent can share a child's gift list through a private link holding a
-- random share token. Guests (no account needed) can see the list and mark
-- an item "I'll buy this". Guests never touch the tables directly: they go
-- through the functions below, which only work with a valid token. Parents
-- see that an item is taken, never who took it (no names are stored).

-- The private link's token. Null means the list isn't shared.
alter table public.children add column share_token uuid unique;

-- Items the parent types in themselves, alongside the site's gift ideas.
create table public.custom_items (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 100),
  url text check (url is null or (char_length(url) <= 500 and url ~* '^https?://')),
  note text check (note is null or char_length(note) <= 200),
  created_at timestamptz not null default now()
);

create index custom_items_child_id_idx on public.custom_items (child_id);

alter table public.custom_items enable row level security;

create policy "Own children's custom items only" on public.custom_items
  for all to authenticated
  using (exists (
    select 1 from public.children c
    where c.id = custom_items.child_id and c.user_id = (select auth.uid())
  ))
  with check (exists (
    select 1 from public.children c
    where c.id = custom_items.child_id and c.user_id = (select auth.uid())
  ));

revoke all on public.custom_items from anon;
grant select, insert, update, delete on public.custom_items to authenticated;

-- "I'll buy this". item_key is "gift:<gift idea id>" or "custom:<custom item id>".
-- The release code lets the same guest undo their choice later.
create table public.reservations (
  child_id uuid not null references public.children (id) on delete cascade,
  item_key text not null check (char_length(item_key) between 1 and 120),
  release_code uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  primary key (child_id, item_key)
);

-- No policies and no grants: reservations are only reached through the
-- functions below.
alter table public.reservations enable row level security;
revoke all on public.reservations from anon, authenticated;

-- Is this item on that child's list?
create function public.list_has_item(p_child_id uuid, p_item_key text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select case
    when p_item_key like 'gift:%' then exists (
      select 1 from public.child_gifts
      where child_id = p_child_id and gift_id = substr(p_item_key, 6)
    )
    when p_item_key ~ '^custom:[0-9a-f-]{36}$' then exists (
      select 1 from public.custom_items
      where child_id = p_child_id and id = substr(p_item_key, 8)::uuid
    )
    else false
  end;
$$;

-- Everything a guest sees on a shared list, or null for an unknown token.
create function public.get_shared_list(p_token uuid)
returns jsonb
language sql
stable
security definer
set search_path = ''
as $$
  select jsonb_build_object(
    'nickname', c.nickname,
    'age', c.age,
    'age_recorded_on', c.age_recorded_on,
    'gift_ids', coalesce((
      select jsonb_agg(g.gift_id order by g.created_at desc)
      from public.child_gifts g where g.child_id = c.id
    ), '[]'::jsonb),
    'custom_items', coalesce((
      select jsonb_agg(jsonb_build_object('id', i.id, 'title', i.title, 'url', i.url, 'note', i.note) order by i.created_at desc)
      from public.custom_items i where i.child_id = c.id
    ), '[]'::jsonb),
    'reserved', coalesce((
      select jsonb_agg(r.item_key) from public.reservations r where r.child_id = c.id
    ), '[]'::jsonb)
  )
  from public.children c
  where p_token is not null and c.share_token = p_token;
$$;

-- A guest says "I'll buy this". Returns the release code, or null if the
-- link is wrong, the item isn't on the list, or someone already took it.
create function public.reserve_item(p_token uuid, p_item_key text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_child_id uuid;
  v_code uuid;
begin
  select id into v_child_id from public.children where p_token is not null and share_token = p_token;
  if v_child_id is null or not public.list_has_item(v_child_id, p_item_key) then
    return null;
  end if;
  insert into public.reservations (child_id, item_key)
  values (v_child_id, p_item_key)
  on conflict do nothing
  returning release_code into v_code;
  return v_code;
end;
$$;

-- The guest who took an item changes their mind.
create function public.release_item(p_token uuid, p_item_key text, p_release_code uuid)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  delete from public.reservations r
  using public.children c
  where c.id = r.child_id
    and p_token is not null and c.share_token = p_token
    and r.item_key = p_item_key
    and r.release_code = p_release_code;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

-- For the parent: which items on their own child's list are taken (not by whom).
create function public.list_reserved(p_child_id uuid)
returns setof text
language sql
stable
security definer
set search_path = ''
as $$
  select r.item_key
  from public.reservations r
  join public.children c on c.id = r.child_id
  where r.child_id = p_child_id and c.user_id = auth.uid();
$$;

-- For the parent: make a taken item available again.
create function public.clear_reservation(p_child_id uuid, p_item_key text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.reservations r
  using public.children c
  where c.id = r.child_id
    and r.child_id = p_child_id
    and r.item_key = p_item_key
    and c.user_id = auth.uid();
$$;

-- For the parent: turn sharing on (or make a new link) or off. Returns the
-- new token, or null when sharing is off. Tokens are always made here, never
-- chosen by the browser.
create function public.set_sharing(p_child_id uuid, p_on boolean)
returns uuid
language sql
security definer
set search_path = ''
as $$
  update public.children
  set share_token = case when p_on then gen_random_uuid() else null end
  where id = p_child_id and user_id = auth.uid()
  returning share_token;
$$;

-- Who may call what. Guests (anon) only get the three shared-list functions.
revoke execute on function public.list_has_item(uuid, text) from public, anon, authenticated;
revoke execute on function public.get_shared_list(uuid) from public;
revoke execute on function public.reserve_item(uuid, text) from public;
revoke execute on function public.release_item(uuid, text, uuid) from public;
revoke execute on function public.list_reserved(uuid) from public, anon;
revoke execute on function public.clear_reservation(uuid, text) from public, anon;
revoke execute on function public.set_sharing(uuid, boolean) from public, anon;
grant execute on function public.get_shared_list(uuid) to anon, authenticated;
grant execute on function public.reserve_item(uuid, text) to anon, authenticated;
grant execute on function public.release_item(uuid, text, uuid) to anon, authenticated;
grant execute on function public.list_reserved(uuid) to authenticated;
grant execute on function public.clear_reservation(uuid, text) to authenticated;
grant execute on function public.set_sharing(uuid, boolean) to authenticated;
