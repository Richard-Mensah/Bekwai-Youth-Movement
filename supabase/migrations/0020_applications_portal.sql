-- ============================================================
-- 0020 Applications portal
--
-- Turns the one-shot leadership application form into a tracked,
-- resumable process:
--   * drafts that autosave and can be picked up later
--   * a status vocabulary mirroring the appointment stages in
--     Article 30.2 of the BYM Constitution
--   * an event log powering the applicant's stage tracker and the
--     Secretariat's audit trail
--   * multiple supporting documents per application, not just one CV
--
-- Idempotent — safe to re-run.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Extend leadership_applications
-- ------------------------------------------------------------
alter table leadership_applications
  -- Catalogue slug from constants/offices.ts. Nullable for legacy rows.
  add column if not exists role_slug      text,
  add column if not exists alt_role_slug  text,
  -- Wizard progress, so a draft resumes where the applicant left off.
  add column if not exists current_step   int not null default 1,
  add column if not exists submitted_at   timestamptz,
  add column if not exists updated_at     timestamptz not null default now(),
  -- Filled in by the Vetting Panel.
  add column if not exists reviewer_notes text,
  add column if not exists score          int,
  add column if not exists decided_at     timestamptz,
  add column if not exists decided_by     uuid references auth.users(id) on delete set null;

-- ------------------------------------------------------------
-- 2. Status vocabulary (Article 30.2)
--
--   draft       -- still being written, visible only to its author
--   submitted   -- sent to the Secretariat
--   received    -- nomination formally received
--   vetting     -- before the Vetting Panel
--   recommended -- recommended to the appointing authority
--   appointed   -- Letter of Appointment issued
--   sworn_in    -- Oath of Service administered (Schedule I)
--   rejected | withdrawn | archived
--
-- Migrate the old vocabulary in place.
-- ------------------------------------------------------------
update leadership_applications set status = 'submitted'  where status = 'new';
update leadership_applications set status = 'received'   where status = 'shortlisted';
update leadership_applications set status = 'vetting'    where status = 'interview';
update leadership_applications set status = 'appointed'  where status = 'accepted';

alter table leadership_applications
  alter column status set default 'draft';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'leadership_applications_status_chk'
  ) then
    alter table leadership_applications
      add constraint leadership_applications_status_chk
      check (status in (
        'draft','submitted','received','vetting','recommended',
        'appointed','sworn_in','rejected','withdrawn','archived'
      ));
  end if;
  if not exists (
    select 1 from pg_constraint where conname = 'leadership_applications_score_chk'
  ) then
    alter table leadership_applications
      add constraint leadership_applications_score_chk
      check (score is null or (score between 1 and 5));
  end if;
end $$;

-- Everything that already exists was, by definition, submitted.
update leadership_applications
  set submitted_at = created_at
  where submitted_at is null and status <> 'draft';

create index if not exists leadership_applications_status_idx
  on leadership_applications (status);
create index if not exists leadership_applications_role_slug_idx
  on leadership_applications (role_slug);

-- Keep updated_at honest. search_path is pinned to match the other functions
-- in this project (0007_rls, 0013_cms) and to satisfy the database linter.
create or replace function set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists leadership_applications_updated_at on leadership_applications;
create trigger leadership_applications_updated_at
  before update on leadership_applications
  for each row execute function set_updated_at();

-- ------------------------------------------------------------
-- 3. Event log — one row per stage change
-- ------------------------------------------------------------
create table if not exists application_events (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references leadership_applications(id) on delete cascade,
  from_status    text,
  to_status      text not null,
  note           text,
  actor_id       uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now()
);

create index if not exists application_events_application_idx
  on application_events (application_id, created_at);

-- Seed a "submitted" event for rows that predate this table, so their
-- trackers are not empty.
insert into application_events (application_id, from_status, to_status, note, created_at)
select a.id, null, 'submitted', 'Application received', a.created_at
from leadership_applications a
where a.status <> 'draft'
  and not exists (select 1 from application_events e where e.application_id = a.id);

-- ------------------------------------------------------------
-- 4. Supporting documents
--
-- Generalises the single cv_path column. cv_path is retained and kept in
-- sync for kind = 'cv' so existing admin code keeps working unchanged.
-- ------------------------------------------------------------
create table if not exists application_documents (
  id             uuid primary key default gen_random_uuid(),
  application_id uuid not null references leadership_applications(id) on delete cascade,
  -- cv | id_document | endorsement | consent | other
  kind           text not null default 'other',
  path           text not null,
  filename       text not null,
  size_bytes     int,
  created_at     timestamptz not null default now()
);

create index if not exists application_documents_application_idx
  on application_documents (application_id);

-- Backfill from the legacy single-CV column.
insert into application_documents (application_id, kind, path, filename)
select a.id, 'cv', a.cv_path, split_part(a.cv_path, '/', 2)
from leadership_applications a
where a.cv_path is not null
  and not exists (
    select 1 from application_documents d
    where d.application_id = a.id and d.path = a.cv_path
  );

-- ------------------------------------------------------------
-- 5. Row level security
-- ------------------------------------------------------------
alter table application_events enable row level security;
alter table application_documents enable row level security;

-- Applying has required a signed-in account since 0018, but the 0016 insert
-- policy still allowed anonymous writes. Close that gap.
drop policy if exists leadership_applications_insert on leadership_applications;
create policy leadership_applications_insert on leadership_applications
  for insert with check (auth.uid() = user_id);

-- An applicant may edit their own application only while it is a draft.
drop policy if exists leadership_applications_own_update on leadership_applications;
create policy leadership_applications_own_update on leadership_applications
  for update
  using (auth.uid() = user_id and status = 'draft')
  with check (auth.uid() = user_id and status in ('draft', 'submitted', 'withdrawn'));

-- ...and delete it, again only while it is a draft.
drop policy if exists leadership_applications_own_delete on leadership_applications;
create policy leadership_applications_own_delete on leadership_applications
  for delete using (auth.uid() = user_id and status = 'draft');

-- Events: the owner reads their own timeline; admins do everything.
drop policy if exists application_events_own_read on application_events;
create policy application_events_own_read on application_events
  for select using (
    exists (
      select 1 from leadership_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

drop policy if exists application_events_admin_read on application_events;
create policy application_events_admin_read on application_events
  for select using (is_admin());

drop policy if exists application_events_admin_write on application_events;
create policy application_events_admin_write on application_events
  for insert with check (
    is_admin()
    or exists (
      select 1 from leadership_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

-- Documents: the owner reads and attaches to their own draft; admins read all.
drop policy if exists application_documents_own_read on application_documents;
create policy application_documents_own_read on application_documents
  for select using (
    exists (
      select 1 from leadership_applications a
      where a.id = application_id and a.user_id = auth.uid()
    )
  );

drop policy if exists application_documents_own_write on application_documents;
create policy application_documents_own_write on application_documents
  for insert with check (
    exists (
      select 1 from leadership_applications a
      where a.id = application_id and a.user_id = auth.uid() and a.status = 'draft'
    )
  );

drop policy if exists application_documents_own_delete on application_documents;
create policy application_documents_own_delete on application_documents
  for delete using (
    exists (
      select 1 from leadership_applications a
      where a.id = application_id and a.user_id = auth.uid() and a.status = 'draft'
    )
  );

drop policy if exists application_documents_admin_read on application_documents;
create policy application_documents_admin_read on application_documents
  for select using (is_admin());

drop policy if exists application_documents_admin_write on application_documents;
create policy application_documents_admin_write on application_documents
  for all using (is_admin()) with check (is_admin());
