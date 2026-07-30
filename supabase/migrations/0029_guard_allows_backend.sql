-- 0029_guard_allows_backend.sql
--
-- Lets a trusted backend connection grant a role again. Fixes a lockout.
--
-- ============================================================
-- THE BUG
-- ============================================================
-- 0021's guard trigger restores the privileged columns whenever `is_admin()` is
-- false. `is_admin()` reads `profiles` for `auth.uid()` — and `auth.uid()` is
-- NULL on any connection that is not a signed-in user: the service-role key, the
-- SQL Editor, `psql`, a migration. So for every one of those, `is_admin()` is
-- false and the trigger silently reverts the write.
--
-- The consequence is that **nothing could create an admin**:
--
--   * The service role cannot. Measured 30 Jul 2026: updating `role` to
--     'super_admin' returned no error and left the row on 'member'.
--   * The SQL Editor cannot — same reason, and that is exactly the statement
--     supabase/README.md tells a new operator to run under "Make yourself an
--     admin".
--   * A signed-in admin could, but no screen offers it.
--
-- The project has a super_admin today only because that promotion happened
-- *before* 0021 was applied. Lose that account and the Secretariat is
-- unrecoverable — and the failure gives no error at all, so the operator would
-- reasonably conclude the SQL had worked.
--
-- ============================================================
-- WHY LETTING NULL auth.uid() THROUGH IS SAFE
-- ============================================================
-- It reads like a hole and is not, because the trigger is only ever reached on a
-- row that RLS already permitted, and no unauthenticated caller can get that far:
--
--   `profiles_update_own` is `(id = (select auth.uid())) OR is_admin()`.
--   With `auth.uid()` NULL, `id = NULL` is never true and `is_admin()` is false,
--   so the `anon` role matches zero rows and the trigger never fires.
--
-- So a NULL `auth.uid()` inside this trigger means one thing only: the caller
-- bypassed RLS entirely — service_role or a superuser. Those already have
-- unrestricted access to every table by definition. Refusing them a column write
-- protects nothing; it only breaks the legitimate backend path while leaving the
-- database wide open to the same caller through any other route.
--
-- The control this trigger exists for is unchanged: a *signed-in non-admin*
-- still cannot grant themselves anything, because their `auth.uid()` is set and
-- `is_admin()` is false. That is the attack it was written for — verified by
-- executing the update as an ordinary member, per 0021's own comment — and it is
-- still blocked.

create or replace function public.guard_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Administrators confer standing; leave their writes alone.
  if is_admin() then
    return new;
  end if;

  -- No JWT at all: service_role, the SQL Editor, psql, a migration. Such a
  -- caller has already bypassed RLS to reach this row, so there is nothing left
  -- for this trigger to defend. See the header for why this is not a hole.
  if auth.uid() is null then
    return new;
  end if;

  -- A signed-in non-admin keeps whatever these already were, whatever they sent.
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

revoke execute on function public.guard_profile_privileges() from anon, authenticated;

-- ============================================================
-- TO REVERT: re-apply 0021_profile_privilege_guard.sql verbatim. Be aware that
-- doing so restores the lockout described above.
-- ============================================================
