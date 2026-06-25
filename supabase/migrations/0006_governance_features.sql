-- ============================================================
-- 0006 Governance Features (the 5 new features) + helper views
-- ============================================================

-- 1) Nomination & Vetting Pipeline (Gov Doc §4.3, Phase 4) ----
create type nomination_stage as enum (
  'nominated', 'residency_check', 'vetting', 'interview',
  'appointed', 'rejected'
);

create table nominations (
  id            uuid primary key default gen_random_uuid(),
  full_name     text not null,
  community_id  integer not null references communities(id),
  seat_type     seat_type not null,
  nominated_by  text,
  endorsement_ref text,
  stage         nomination_stage not null default 'nominated',
  notes         text,
  created_at    timestamptz not null default now()
);

create table vetting_reviews (
  id            uuid primary key default gen_random_uuid(),
  nomination_id uuid not null references nominations(id) on delete cascade,
  reviewer_id   uuid references profiles(id),
  residency_ok  boolean,
  character_ref text,
  interview_score integer check (interview_score between 0 and 100),
  recommendation text,
  created_at    timestamptz not null default now()
);

-- 4) Traditional Authority Engagement (Gov Doc §3) ------------
create table tac_members (
  id        serial primary key,
  name      text,
  title     text not null,
  role_desc text,
  community_id integer references communities(id)
);

create table tac_engagements (
  id            uuid primary key default gen_random_uuid(),
  community_id  integer references communities(id),
  kind          text not null, -- courtesy_call | sensitisation | durbar | dispute
  summary       text,
  occurred_on   date not null default current_date,
  created_at    timestamptz not null default now()
);

create table endorsements (
  id            uuid primary key default gen_random_uuid(),
  subject_type  text not null, -- nomination | project | policy
  subject_id    uuid,
  endorser_id   uuid references profiles(id),
  decision      text not null default 'pending',
  note          text,
  decided_at    timestamptz
);

-- 2) "No Community Left Without a Voice" — representation gaps -
-- A community is covered for a seat if a verified profile holds it.
create or replace view representation_gaps as
select
  c.id   as community_id,
  c.name as community_name,
  bool_or(p.seat_type = 'mp')          as has_mp,
  bool_or(p.seat_type = 'council_rep') as has_council_rep,
  bool_or(p.seat_type = 'cin_officer') as has_cin_officer
from communities c
left join profiles p
  on p.community_id = c.id and p.verification_status = 'verified'
group by c.id, c.name
order by c.id;

-- 5) Term-Limit & Tenure Registry (Gov Doc §9.6) -------------
create or replace view tenure_status as
select
  p.id,
  p.full_name,
  p.role,
  cp.title as position_title,
  p.term_start,
  p.term_end,
  (p.term_end is not null and p.term_end < current_date) as term_expired,
  (p.term_end is not null
    and p.term_end >= current_date
    and p.term_end < current_date + interval '60 days') as term_expiring_soon
from profiles p
left join cabinet_positions cp on cp.id = p.cabinet_position_id
where p.term_start is not null;

-- 3) Gender-equality compliance (Gov Doc §9.3) ----------------
create or replace view gender_compliance as
select
  p.role,
  count(*) filter (where p.gender = 'female') as female,
  count(*) as total,
  round(
    100.0 * count(*) filter (where p.gender = 'female')
    / nullif(count(*), 0), 1
  ) as female_pct
from profiles p
where p.verification_status = 'verified'
group by p.role;
