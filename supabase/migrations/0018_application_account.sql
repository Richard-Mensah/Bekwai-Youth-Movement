-- ============================================================
-- 0018 Link leadership applications to the applicant's account
-- Applying now requires an account (which already carries a unique
-- membership_id, e.g. BYM-2026-0001). We stamp the applicant's user_id
-- and membership_id onto each application, and let applicants read
-- their own submissions.
-- ============================================================

alter table leadership_applications
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists membership_id text;

create index if not exists leadership_applications_user_idx
  on leadership_applications (user_id);

-- Applicants may read their own application (e.g. a future status page).
drop policy if exists leadership_applications_own_read on leadership_applications;
create policy leadership_applications_own_read on leadership_applications
  for select using (auth.uid() = user_id);
