-- ============================================================
-- 0016 Leadership applications
-- Public "Apply for a leadership role" submissions (Director-General
-- down to community seats). Anyone may apply; only admins read the pipeline.
-- ============================================================

create table if not exists leadership_applications (
  id               uuid primary key default gen_random_uuid(),
  full_name        text not null,
  email            text not null,
  phone            text,
  community        text,
  age              int,
  gender           text,
  -- Which arm the role belongs to: cabinet | parliament | cin | community
  role_arm         text,
  -- The office being applied for (e.g. "Director-General (DG)").
  role_applied     text not null,
  -- Optional second-choice office.
  alt_role         text,
  occupation       text,
  qualifications   text,
  experience       text,
  motivation       text not null,
  availability     text,
  referee_name     text,
  referee_contact  text,
  -- Applicant affirmed BYM's non-partisan values & accuracy of the form.
  consent          boolean not null default false,
  -- Pipeline: new | shortlisted | interview | accepted | rejected | archived
  status           text not null default 'new',
  created_at       timestamptz not null default now()
);

create index if not exists leadership_applications_created_idx
  on leadership_applications (created_at desc);

alter table leadership_applications enable row level security;

-- Anyone (including anonymous visitors) may submit an application...
create policy leadership_applications_insert on leadership_applications
  for insert with check (true);

-- ...but only admins can read the pipeline...
create policy leadership_applications_admin_read on leadership_applications
  for select using (is_admin());

-- ...and update an application's status.
create policy leadership_applications_admin_update on leadership_applications
  for update using (is_admin()) with check (is_admin());

grant insert on leadership_applications to anon, authenticated;
grant select, update on leadership_applications to authenticated;
