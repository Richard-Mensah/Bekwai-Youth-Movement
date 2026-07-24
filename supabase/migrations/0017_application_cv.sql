-- ============================================================
-- 0017 Leadership application CV upload + vetting preference
-- Adds an optional CV file (private bucket) and a hybrid-vetting
-- preference (in-person in Sefwi Bekwai, or virtual).
-- ============================================================

alter table leadership_applications
  add column if not exists cv_path text,
  add column if not exists vetting_pref text; -- in_person | virtual | either

-- Private bucket for applicant CVs (personal data — not world-readable).
insert into storage.buckets (id, name, public)
values ('applications', 'applications', false)
on conflict (id) do nothing;

-- Anyone applying (anonymous or signed-in) may upload their CV...
create policy "applications_cv_insert" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'applications');

-- ...but only admins can read/download them.
create policy "applications_cv_admin_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'applications' and is_admin());
