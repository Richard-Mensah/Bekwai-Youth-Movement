-- ============================================================
-- 0004 Executive Governance — Projects, Budgets, Expenditure
-- ============================================================

create type project_status as enum (
  'proposed', 'approved', 'in_progress', 'completed', 'suspended'
);

create table projects (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  description   text,
  community_id  integer references communities(id),
  unit_id       integer references units(id),
  lead_id       uuid references profiles(id),
  status        project_status not null default 'proposed',
  budget_ghs    numeric(12,2) default 0,
  starts_on     date,
  ends_on       date,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index projects_community_idx on projects(community_id);

create table project_updates (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  note        text not null,
  progress    integer check (progress between 0 and 100),
  created_at  timestamptz not null default now()
);

create table project_images (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  path        text not null
);

create table project_sdgs (
  project_id uuid not null references projects(id) on delete cascade,
  goal       integer not null references sdg_goals(goal),
  primary key (project_id, goal)
);

create table budgets (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references projects(id) on delete cascade,
  fiscal_year integer not null,
  amount_ghs  numeric(12,2) not null default 0,
  created_at  timestamptz not null default now()
);

create table expenditures (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references projects(id) on delete cascade,
  amount_ghs  numeric(12,2) not null,
  payee       text,
  purpose     text,
  approved_by uuid references profiles(id),
  receipt_ref text,
  spent_on    date not null default current_date,
  created_at  timestamptz not null default now()
);

create table approvals (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid references projects(id) on delete cascade,
  approver_id uuid references profiles(id),
  decision    text not null default 'pending',
  note        text,
  decided_at  timestamptz
);
