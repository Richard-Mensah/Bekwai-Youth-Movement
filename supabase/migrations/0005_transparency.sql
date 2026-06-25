-- ============================================================
-- 0005 Transparency Portal (public-facing published records)
-- ============================================================

create table public_reports (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  summary     text,
  file_path   text,
  is_published boolean not null default false,
  published_at date,
  created_at  timestamptz not null default now()
);

create table published_budgets (
  id          uuid primary key default gen_random_uuid(),
  fiscal_year integer not null,
  title       text not null,
  income_ghs  numeric(12,2) default 0,
  expenditure_ghs numeric(12,2) default 0,
  file_path   text,
  is_published boolean not null default false,
  created_at  timestamptz not null default now()
);

create table community_scorecards (
  id            uuid primary key default gen_random_uuid(),
  community_id  integer not null references communities(id),
  period        text not null,
  score         numeric(5,2),
  metrics       jsonb,
  is_published  boolean not null default false,
  created_at    timestamptz not null default now()
);

create table annual_reports (
  id          uuid primary key default gen_random_uuid(),
  year        integer not null,
  title       text not null,
  file_path   text,
  is_published boolean not null default false,
  created_at  timestamptz not null default now()
);
