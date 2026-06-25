-- ============================================================
-- BYM Governance Platform — 0001 Core (identity & reference data)
-- ============================================================

-- ---- Enums -------------------------------------------------
create type role as enum (
  'public', 'member', 'volunteer', 'cin_officer', 'mp',
  'secretary', 'elder', 'admin', 'super_admin'
);
create type verification_status as enum ('pending', 'verified', 'rejected');
create type gender as enum ('male', 'female', 'other');
create type seat_type as enum ('mp', 'council_rep', 'cin_officer');

-- ---- Reference: communities (32) ---------------------------
create table communities (
  id            serial primary key,
  name          text not null,
  is_town       boolean not null default false,
  population    integer,
  gps_lat       double precision,
  gps_lng       double precision,
  development_index numeric(5,2),
  created_at    timestamptz not null default now()
);

-- ---- Reference: units (7) ----------------------------------
create table units (
  id        serial primary key,
  no        integer not null unique,
  name      text not null,
  mandate   text,
  officer   text,
  sdg       integer[] not null default '{}'
);

-- ---- Reference: cabinet positions (19) ---------------------
create table cabinet_positions (
  id            serial primary key,
  no            integer not null unique,
  title         text not null,
  uk_equivalent text,
  reports_to_id integer references cabinet_positions(id),
  sdg           integer[] not null default '{}'
);

-- ---- Reference: SDG goals (12) -----------------------------
create table sdg_goals (
  goal   integer primary key,
  title  text not null,
  color  text not null
);

-- ---- Profiles (1:1 with auth.users) ------------------------
create sequence membership_seq start 1001;

create table profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  membership_id       text not null unique
                        default ('BYM-' || extract(year from now())::text || '-' ||
                                 lpad(nextval('membership_seq')::text, 4, '0')),
  full_name           text not null default '',
  gender              gender,
  dob                 date,
  phone               text,
  email               text,
  community_id        integer references communities(id),
  role                role not null default 'member',
  cabinet_position_id integer references cabinet_positions(id),
  seat_type           seat_type,
  verification_status verification_status not null default 'pending',
  residency_verified  boolean not null default false,
  profile_image_path  text,
  term_start          date,
  term_end            date,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index profiles_community_idx on profiles(community_id);
create index profiles_role_idx on profiles(role);

-- ---- New-member trigger: copy auth metadata into profiles --
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, gender, dob, phone, community_id)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    (new.raw_user_meta_data->>'gender')::gender,
    (new.raw_user_meta_data->>'dob')::date,
    new.raw_user_meta_data->>'phone',
    (new.raw_user_meta_data->>'community_id')::integer
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
