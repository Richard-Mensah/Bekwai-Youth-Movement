-- ============================================================
-- 0002 Community Intelligence Network (CIN)
-- ============================================================

create type cin_status as enum ('open', 'resolved', 'escalated');
create type severity as enum ('low', 'medium', 'high', 'critical');

create table cin_reports (
  id            uuid primary key default gen_random_uuid(),
  officer_id    uuid not null references profiles(id),
  community_id  integer not null references communities(id),
  category      text not null,
  severity      severity not null default 'medium',
  description   text not null,
  gps_lat       double precision,
  gps_lng       double precision,
  status        cin_status not null default 'open',
  verification_status verification_status not null default 'pending',
  action_taken  text,
  reported_at   date not null default current_date,
  created_at    timestamptz not null default now()
);
create index cin_reports_community_idx on cin_reports(community_id);
create index cin_reports_officer_idx on cin_reports(officer_id);

create table cin_report_images (
  id         uuid primary key default gen_random_uuid(),
  report_id  uuid not null references cin_reports(id) on delete cascade,
  path       text not null,
  created_at timestamptz not null default now()
);

create table cin_report_sdgs (
  report_id uuid not null references cin_reports(id) on delete cascade,
  goal      integer not null references sdg_goals(goal),
  primary key (report_id, goal)
);
