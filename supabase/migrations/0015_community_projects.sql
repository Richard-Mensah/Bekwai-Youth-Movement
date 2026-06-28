-- ============================================================
-- 0015 Community showcase + project images
-- (a) project cover images
-- (b) per-community editable detail (about, chief, elders) + slug
-- (c) public_representatives view (verified reps, name + photo + seat)
-- ============================================================

-- ---- Project cover image -----------------------------------
alter table projects add column if not exists cover_path text;

-- ---- Per-community detail (CMS-editable) -------------------
alter table communities
  add column if not exists slug         text,
  add column if not exists about        text,
  add column if not exists chief        text,
  add column if not exists chief_title  text,
  add column if not exists elders       text;

-- Backfill a URL-safe slug from each name (re-runnable; only fills blanks).
update communities
  set slug = trim(both '-' from lower(regexp_replace(name, '[^a-zA-Z0-9]+', '-', 'g')))
  where slug is null or slug = '';

create index if not exists communities_slug_idx on communities(slug);

-- ---- Public representatives view ---------------------------
-- Verified, opted-in members who hold a seat. Reps are public officials, so
-- full name + photo + seat are shown publicly. Email/phone/dob never selected.
create or replace view public_representatives as
  select
    p.id,
    p.full_name,
    p.profile_image_path,
    p.community_id,
    p.seat_type
  from profiles p
  where p.verification_status = 'verified'
    and coalesce(p.is_public, true) = true
    and p.seat_type is not null;

grant select on public_representatives to anon, authenticated;
