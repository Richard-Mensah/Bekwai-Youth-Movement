-- ============================================================
-- 0024 Backend correctness
--
-- Four faults where the database and the application disagreed about who is
-- allowed to do what. In every case the app let someone reach a screen that
-- RLS then refused to serve — silently, because PostgREST reports "no rows
-- affected" and "you are not allowed" identically.
--
--  1. The MP and Cabinet consoles could not write anything at all.
--  2. Marking a contact message read did nothing but said it worked.
--  3. Candidate vetting files were readable by every member.
--  4. A bad value in the sign-up form aborted the whole sign-up.
--
-- The role→area mapping enforced here is taken from ROLE_NAV_GROUPS in
-- constants/dashboard.ts, so the database now grants exactly what the sidebar
-- offers.
-- ============================================================

-- ---- Role helpers ------------------------------------------
-- Named after the console each one guards. SECURITY DEFINER for the same
-- reason as is_admin() in 0007: reading profiles from inside a profiles policy
-- would recurse.

/** Parliament: MPs, plus admins. Mirrors ROLE_NAV_GROUPS "mp". */
create or replace function can_sit_in_parliament()
returns boolean language sql stable security definer set search_path = public as $$
  select auth_role() in ('mp', 'admin', 'super_admin');
$$;

/** Cabinet projects and spending. Mirrors ROLE_NAV_GROUPS "cabinet". */
create or replace function can_manage_projects()
returns boolean language sql stable security definer set search_path = public as $$
  select auth_role() in ('secretary', 'admin', 'super_admin');
$$;

/** Candidate vetting. Mirrors ROLE_NAV_GROUPS "elder". */
create or replace function can_review_vetting()
returns boolean language sql stable security definer set search_path = public as $$
  select auth_role() in ('elder', 'admin', 'super_admin');
$$;

-- Deliberately NOT revoked from `authenticated`, tempting as the linter's
-- "anon can execute this SECURITY DEFINER function" warning makes it.
-- Policy expressions are evaluated as the querying role and EXECUTE is checked
-- against that role, so revoking EXECUTE on a helper that appears inside a
-- policy — is_admin(), can_manage_content(), and the three above — breaks every
-- policy that calls it for exactly the users who need it. The real remedy for
-- that warning is moving the helpers into a schema PostgREST does not expose,
-- which is a wider refactor than this migration should carry. What leaks
-- meanwhile is one boolean about the caller's own role, which the caller
-- already knows.
--
-- guard_profile_privileges() and handle_new_user() are different: trigger
-- functions are invoked by the executor as the table owner, so revoking EXECUTE
-- costs nothing. 0010 already did this for handle_new_user; 0021's trigger was
-- missed.
revoke execute on function public.guard_profile_privileges() from anon, authenticated, public;

-- ---- 1. Parliament writes ----------------------------------
-- The blanket loop in 0007 gave these tables `for all using (is_admin())`, so
-- every action in app/dashboard/mp/actions.ts failed for the MPs it was built
-- for. An MP casting a vote got a raw Postgres denial in the UI — and
-- VotePanel.tsx subscribes to realtime on a table no MP could write.
--
-- The admin policies from 0007 stay; permissive policies are OR'd, so these
-- add MP access rather than replacing anything.

create policy bills_sponsor_insert on bills
  for insert with check (can_sit_in_parliament() and sponsor_id = auth.uid());

-- Sponsors move their own bills through the stages; anyone else's is an admin
-- action. advanceBillStage() updates by id alone, so this is the constraint
-- that decides it.
create policy bills_sponsor_update on bills
  for update using (can_sit_in_parliament() and sponsor_id = auth.uid())
  with check (can_sit_in_parliament() and sponsor_id = auth.uid());

create policy motions_mover_insert on motions
  for insert with check (can_sit_in_parliament() and mover_id = auth.uid());

-- One vote per member per bill, cast and changed only by that member. Both
-- commands are needed: castVote() upserts.
create policy votes_own_insert on votes
  for insert with check (can_sit_in_parliament() and member_id = auth.uid());
create policy votes_own_update on votes
  for update using (can_sit_in_parliament() and member_id = auth.uid())
  with check (can_sit_in_parliament() and member_id = auth.uid());

-- youth_recommendations records no submitter, so role is the only test available.
create policy recommendations_mp_insert on youth_recommendations
  for insert with check (can_sit_in_parliament());

-- ---- 2. Cabinet writes -------------------------------------
create policy projects_cabinet_insert on projects
  for insert with check (can_manage_projects() and lead_id = auth.uid());

-- Not narrowed to lead_id: the Cabinet console is a shared workspace and
-- setProjectStatus()/updateProjectImage() are used across it.
create policy projects_cabinet_update on projects
  for update using (can_manage_projects()) with check (can_manage_projects());

create policy expenditures_cabinet_insert on expenditures
  for insert with check (can_manage_projects() and approved_by = auth.uid());

-- ---- 3. Vetting files are not public to members ------------
-- vetting_reviews holds interview scores, residency findings and character
-- references on named nominees, and the 0007 loop made it readable by anyone
-- with an account.
drop policy if exists vetting_reviews_read on vetting_reviews;
create policy vetting_reviews_read on vetting_reviews
  for select using (can_review_vetting() or reviewer_id = auth.uid());

-- ---- 4. Contact inbox could not be updated -----------------
-- contact_messages had an INSERT policy, a SELECT policy and no UPDATE policy
-- or grant at all, so markMessage() in the admin inbox matched zero rows and
-- still reported success. Read was gated on is_admin() while the app gates the
-- inbox on canManageContent(), which also locked the Communications Secretary
-- out of an inbox they can see the page for; both now agree.
drop policy if exists contact_admin_read on contact_messages;
create policy contact_admin_read on contact_messages
  for select using (can_manage_content());

create policy contact_manage_update on contact_messages
  for update using (can_manage_content()) with check (can_manage_content());

grant update on contact_messages to authenticated;

-- ---- 5. Applicant CVs were never really deleted ------------
-- removeDocument(), the upload rollback and discardDraft() all call
-- storage.remove() on this bucket, but no delete policy existed, so every call
-- failed quietly and the CV survived the applicant deleting it — personal data
-- retained against an explicit request.
create policy "applications_cv_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'applications'
    and (
      is_admin()
      or owner = auth.uid()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

-- Uploading a CV requires an account (0020 closed the equivalent anonymous row
-- insert but left the storage policy open, leaving an unauthenticated way to
-- fill a private bucket).
drop policy if exists "applications_cv_insert" on storage.objects;
create policy "applications_cv_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'applications');

-- Secretaries staff the applications console (canManageContent) but the read
-- policy was is_admin(), so every CV signed URL came back null for them.
drop policy if exists "applications_cv_admin_read" on storage.objects;
create policy "applications_cv_admin_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'applications'
    and (
      can_manage_content()
      or owner = auth.uid()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

-- ---- 6. Sign-up survives bad metadata ----------------------
-- Every value below arrives from the browser as free text in
-- raw_user_meta_data. The previous version cast them inline, and a cast that
-- raises inside this trigger aborts the INSERT on auth.users itself — which
-- Supabase hands back to the applicant as "Database error saving new user",
-- with nothing they can act on and no record that they tried.
--
-- All four columns are nullable, so dropping an unusable value costs a field
-- an administrator can fix; failing costs the member.
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  v_gender       gender;
  v_dob          date;
  v_community_id integer;
begin
  begin
    v_gender := nullif(new.raw_user_meta_data->>'gender', '')::gender;
  exception when others then
    v_gender := null;
  end;

  begin
    v_dob := nullif(new.raw_user_meta_data->>'dob', '')::date;
  exception when others then
    v_dob := null;
  end;

  begin
    v_community_id := nullif(new.raw_user_meta_data->>'community_id', '')::integer;
  exception when others then
    v_community_id := null;
  end;

  -- An id that is not a real community would fail the foreign key.
  if v_community_id is not null
     and not exists (select 1 from communities where id = v_community_id) then
    v_community_id := null;
  end if;

  begin
    insert into public.profiles (id, full_name, email, gender, dob, phone, community_id)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'full_name', ''),
      new.email,
      v_gender,
      v_dob,
      new.raw_user_meta_data->>'phone',
      v_community_id
    );
  exception when others then
    -- A member with no profile row can be repaired; a member who could not
    -- sign up is simply gone. Surfaces in the Postgres logs.
    raise warning '[handle_new_user] profile insert failed for %: %', new.id, sqlerrm;
  end;

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from anon, authenticated, public;
