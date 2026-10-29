-- Lets a logged-in adult delete their own account.
-- Run once in the Supabase dashboard: SQL Editor > New query > paste > Run.
--
-- Deleting the account also deletes everything linked to it (favourites,
-- children and their gift lists) because those tables use "on delete cascade".
-- The function can only ever delete the account of the person calling it.

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
begin
  if current_user_id is null then
    raise exception 'Not logged in';
  end if;
  delete from auth.users where id = current_user_id;
end;
$$;

-- Only logged-in users may call it; nobody else.
revoke execute on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
