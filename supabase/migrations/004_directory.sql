-- Directory of children's gift and party businesses.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- A business owner with an account submits a listing. It stays hidden until
-- the site owner approves it. Editing an approved listing sends it back for
-- approval. Only approved listings are public.
--
-- After running this file, make your own account the site owner (once):
--   insert into public.site_admins (user_id)
--   select id from auth.users where email = 'YOUR LOGIN EMAIL';

-- Accounts that may approve listings. Added by hand in the SQL Editor only.
create table public.site_admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

alter table public.site_admins enable row level security;
revoke all on public.site_admins from anon, authenticated;

create function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid());
$$;

create table public.listings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 80),
  kind text not null check (kind in ('shops', 'parties', 'cakes', 'classes', 'other')),
  description text not null check (char_length(description) between 1 and 300),
  country text not null check (country ~ '^[A-Z]{2}$'),
  city text not null check (char_length(city) between 1 and 60),
  website text check (website is null or (char_length(website) <= 500 and website ~* '^https?://')),
  email text check (email is null or (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$')),
  phone text check (phone is null or phone ~ '^\+?[0-9 ()-]{6,30}$'),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  -- The site owner's note to the business, e.g. why a listing wasn't approved.
  review_note text check (review_note is null or char_length(review_note) <= 300),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_need_contact check (website is not null or email is not null or phone is not null)
);

create index listings_user_id_idx on public.listings (user_id);
create index listings_approved_idx on public.listings (country, city) where status = 'approved';

-- At most 5 listings per account.
create function public.limit_listings()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.listings where user_id = new.user_id) >= 5 then
    raise exception 'Too many listings for this account';
  end if;
  return new;
end;
$$;

create trigger listings_limit before insert on public.listings
  for each row execute function public.limit_listings();

-- Any change to the business's details sends the listing back for approval.
-- Businesses can't change the status column themselves (see the grants
-- below); only review_listing() can.
create function public.listing_changed()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if (new.name, new.kind, new.description, new.country, new.city, new.website, new.email, new.phone)
     is distinct from
     (old.name, old.kind, old.description, old.country, old.city, old.website, old.email, old.phone) then
    new.status := 'pending';
    new.review_note := null;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger listings_changed before update on public.listings
  for each row execute function public.listing_changed();

alter table public.listings enable row level security;

create policy "Approved listings are public" on public.listings
  for select to anon, authenticated
  using (status = 'approved');

create policy "Businesses see their own listings" on public.listings
  for select to authenticated
  using (user_id = (select auth.uid()));

create policy "The site owner sees all listings" on public.listings
  for select to authenticated
  using ((select public.is_site_admin()));

create policy "Businesses add their own listings" on public.listings
  for insert to authenticated
  with check (user_id = (select auth.uid()));

create policy "Businesses edit their own listings" on public.listings
  for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy "Businesses remove their own listings" on public.listings
  for delete to authenticated
  using (user_id = (select auth.uid()));

-- Visitors only get the public columns. Businesses can only fill in and change
-- their details, never the status, owner or review note.
revoke all on public.listings from anon, authenticated;
grant select (id, name, kind, description, country, city, website, email, phone) on public.listings to anon;
grant select on public.listings to authenticated;
grant insert (name, kind, description, country, city, website, email, phone) on public.listings to authenticated;
grant update (name, kind, description, country, city, website, email, phone) on public.listings to authenticated;
grant delete on public.listings to authenticated;

-- For the site owner: approve a listing, or turn it down (or take it down)
-- with an optional note to the business.
create function public.review_listing(p_id uuid, p_approve boolean, p_note text)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if not public.is_site_admin() then
    raise exception 'Only the site owner can review listings';
  end if;
  update public.listings
  set status = case when p_approve then 'approved' else 'rejected' end,
      review_note = case when p_approve then null else nullif(left(trim(p_note), 300), '') end
  where id = p_id;
  get diagnostics v_count = row_count;
  return v_count > 0;
end;
$$;

revoke execute on function public.limit_listings() from public, anon, authenticated;
revoke execute on function public.listing_changed() from public, anon, authenticated;
revoke execute on function public.is_site_admin() from public, anon;
revoke execute on function public.review_listing(uuid, boolean, text) from public, anon;
grant execute on function public.is_site_admin() to authenticated;
grant execute on function public.review_listing(uuid, boolean, text) to authenticated;
