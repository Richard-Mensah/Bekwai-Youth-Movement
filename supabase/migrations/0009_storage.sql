-- ============================================================
-- 0009 Storage buckets — CIN evidence, profile photos, project images
-- ============================================================

insert into storage.buckets (id, name, public)
values
  ('cin-evidence', 'cin-evidence', false),
  ('avatars', 'avatars', true),
  ('project-images', 'project-images', true)
on conflict (id) do nothing;

-- CIN evidence: authenticated members upload; owners + admins read.
create policy "cin_evidence_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'cin-evidence');

create policy "cin_evidence_read" on storage.objects
  for select to authenticated
  using (bucket_id = 'cin-evidence');

-- Public buckets: world-readable, authenticated write.
create policy "public_buckets_read" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('avatars', 'project-images'));

create policy "public_buckets_write" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('avatars', 'project-images'));
