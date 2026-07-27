-- 0021_profile_privilege_guard.sql
--
-- Stops a member from granting themselves standing in the Movement.
--
-- The profiles_update_own policy (0007) is `id = auth.uid() or is_admin()`.
-- Postgres RLS is row-level, not column-level, so that policy lets a member
-- update *every column* of their own row — including role and
-- verification_status. Anyone with an account could therefore make themselves
-- an admin, verify themselves, and appoint themselves to a Cabinet seat,
-- straight from the browser with the public anon key. Confirmed by executing
-- the update as an ordinary pending member before writing this.
--
-- Splitting the policy cannot fix it: RLS has no column granularity. Column
-- GRANTs would, but they do not compose with the single "update own profile"
-- policy the app relies on for ordinary edits. A BEFORE UPDATE trigger is the
-- mechanism that does: it silently restores the privileged columns for
-- non-admins while leaving the rest of the row editable, so legitimate profile
-- edits keep working and a tampered write is a no-op rather than an error.
--
-- INSERT is untouched: signup creates the row through the auth trigger, and a
-- self-inserted profile still lands on the defaults (member / pending).

create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Administrators are the ones who confer standing; leave their writes alone.
  if is_admin() then
    return new;
  end if;

  -- Everyone else keeps whatever these already were, whatever they submitted.
  new.role                := old.role;
  new.verification_status := old.verification_status;
  new.membership_id       := old.membership_id;
  new.cabinet_position_id := old.cabinet_position_id;
  new.seat_type           := old.seat_type;
  new.residency_verified  := old.residency_verified;
  new.term_start          := old.term_start;
  new.term_end            := old.term_end;
  new.is_public           := old.is_public;

  return new;
end;
$$;

drop trigger if exists profiles_guard_privileges on public.profiles;

create trigger profiles_guard_privileges
  before update on public.profiles
  for each row
  execute function public.guard_profile_privileges();

-- A SECURITY DEFINER function in the public schema is otherwise exposed as a
-- PostgREST RPC. Postgres refuses to call a trigger function directly, so this
-- was not reachable, but the grant should not be there in the first place.
revoke execute on function public.guard_profile_privileges() from anon, authenticated;
