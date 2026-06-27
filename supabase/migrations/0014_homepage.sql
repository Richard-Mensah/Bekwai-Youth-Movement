-- ============================================================
-- 0014 Homepage upgrades
-- (a) Privacy-safe public projection of verified members for the
--     homepage "members wall" (never exposes email/phone/dob).
-- (b) Member opt-out flag for that wall.
-- (c) testimonials table (CMS-managed "member voices" band).
-- ============================================================

-- ---- Member public opt-out --------------------------------
alter table profiles add column if not exists is_public boolean not null default true;

-- ---- Public members view -----------------------------------
-- A plain view runs with the owner's privileges, so it bypasses the
-- profiles RLS and exposes ONLY the safe columns selected below for
-- verified, opted-in members. Email / phone / dob are never selected.
create or replace view public_members as
  select
    p.id,
    split_part(coalesce(p.full_name, 'Member'), ' ', 1) as first_name,
    p.profile_image_path,
    p.community_id,
    c.name as community_name,
    p.created_at
  from profiles p
  left join communities c on c.id = p.community_id
  where p.verification_status = 'verified'
    and coalesce(p.is_public, true) = true;

grant select on public_members to anon, authenticated;

-- ---- Testimonials ("member voices") ------------------------
create table if not exists testimonials (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  role         text,
  quote        text not null,
  photo_path   text,
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

alter table testimonials enable row level security;

create policy testimonials_public_read on testimonials
  for select using (is_published or can_manage_content());
create policy testimonials_write on testimonials
  for all using (can_manage_content()) with check (can_manage_content());

grant select on testimonials to anon, authenticated;
grant insert, update, delete on testimonials to authenticated;

-- ---- Seed a few starter quotes (only if table is empty) ----
insert into testimonials (name, role, quote, sort_order)
select * from (values
  ('Ama Serwaa', 'Member · Health & Welfare',
   'BYM gave me a structured way to serve my community — and a real voice in the decisions that affect young people.', 1),
  ('Kwame Boateng', 'Council Representative',
   'For the first time, my sub-community has someone carrying our priorities straight to the Assembly.', 2),
  ('Esi Mensah', 'Volunteer',
   'I joined to plant trees and stayed because I found a movement that actually listens to the youth.', 3)
) as t(name, role, quote, sort_order)
where not exists (select 1 from testimonials);
