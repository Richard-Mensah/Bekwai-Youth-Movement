-- ============================================================
-- 0023 Storage hardening
--
-- Two buckets were granted to `authenticated` as a whole rather than to the
-- people who are supposed to use them.
--
-- 1. `content` (0013) let ANY signed-in member insert, update and delete
--    objects. That bucket holds every post cover, leader portrait, gallery
--    image, partner logo and event cover on the public site. Anyone who could
--    complete the sign-up form could therefore empty the front page from a
--    browser console with nothing but the anon key. Writes now require
--    can_manage_content(), the same helper the CMS tables already use.
--
-- 2. `cin-evidence` (0009) was created with the comment "owners + admins read"
--    and a policy that said `to authenticated using (bucket_id = ...)` — every
--    member could read every incident photo. The policy now matches the comment.
--
-- `avatars` and `project-images` get the same treatment as `content`. No code
-- path writes to either today (every uploadImage() call targets `content`), so
-- this closes them off without changing behaviour.
--
-- Reads are deliberately left alone: `content`, `avatars` and `project-images`
-- are public buckets whose objects are served by URL anyway.
-- ============================================================

-- ---- content -----------------------------------------------
drop policy if exists "content_write"  on storage.objects;
drop policy if exists "content_update" on storage.objects;
drop policy if exists "content_delete" on storage.objects;

create policy "content_write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'content' and can_manage_content());

create policy "content_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'content' and can_manage_content())
  with check (bucket_id = 'content' and can_manage_content());

create policy "content_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'content' and can_manage_content());

-- ---- avatars + project-images ------------------------------
drop policy if exists "public_buckets_write" on storage.objects;

create policy "public_buckets_write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('avatars', 'project-images') and can_manage_content()
  );

-- ---- cin-evidence ------------------------------------------
-- Reporting officers see their own evidence, admins see all. The bucket is
-- private, so this policy is the only thing standing between a member and
-- every incident photo BYM holds.
--
-- Ownership is checked two ways because they can disagree: `owner` is stamped
-- by Storage at upload time, while the leading path segment is what
-- app/dashboard/cin/actions.ts actually writes (`${user.id}/...`). Matching
-- either keeps existing objects readable by the officer who filed them.
drop policy if exists "cin_evidence_read" on storage.objects;

create policy "cin_evidence_read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'cin-evidence'
    and (
      is_admin()
      or owner = auth.uid()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );

-- Uploads stay open to any signed-in member: reporting an incident is the one
-- thing every member is entitled to do. The insert policy is unchanged.
