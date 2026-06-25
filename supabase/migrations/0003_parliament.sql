-- ============================================================
-- 0003 Bekwai Youth Parliament (BYP)
-- ============================================================

create type bill_status as enum (
  'draft', 'first_reading', 'second_reading',
  'committee', 'third_reading', 'passed', 'rejected'
);
create type vote_choice as enum ('aye', 'no', 'abstain');

create table parliament_sessions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  opens_on    date,
  closes_on   date,
  created_at  timestamptz not null default now()
);

create table committees (
  id        serial primary key,
  name      text not null,
  mandate   text
);

create table bills (
  id           uuid primary key default gen_random_uuid(),
  reference    text unique,
  title        text not null,
  summary      text,
  status       bill_status not null default 'draft',
  sponsor_id   uuid references profiles(id),
  committee_id integer references committees(id),
  session_id   uuid references parliament_sessions(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table motions (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  mover_id    uuid references profiles(id),
  session_id  uuid references parliament_sessions(id),
  status      text not null default 'submitted',
  created_at  timestamptz not null default now()
);

create table votes (
  id          uuid primary key default gen_random_uuid(),
  bill_id     uuid references bills(id) on delete cascade,
  motion_id   uuid references motions(id) on delete cascade,
  member_id   uuid not null references profiles(id),
  choice      vote_choice not null,
  created_at  timestamptz not null default now(),
  unique (member_id, bill_id),
  unique (member_id, motion_id)
);

create table attendance (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid not null references parliament_sessions(id),
  member_id   uuid not null references profiles(id),
  present     boolean not null default true,
  sitting_date date not null default current_date,
  unique (session_id, member_id, sitting_date)
);

create table hansard (
  id          uuid primary key default gen_random_uuid(),
  session_id  uuid references parliament_sessions(id),
  sitting_date date not null default current_date,
  content     text,
  is_published boolean not null default false,
  created_at  timestamptz not null default now()
);

create table youth_recommendations (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  body        text,
  community_id integer references communities(id),
  status      text not null default 'submitted',
  created_at  timestamptz not null default now()
);
