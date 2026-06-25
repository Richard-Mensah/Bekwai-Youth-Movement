-- ============================================================
-- 0007 Row Level Security (RLS) policies
-- ============================================================

-- ---- Helper functions (SECURITY DEFINER avoids recursion) --
create or replace function auth_role()
returns role language sql stable security definer set search_path = public as $$
  select coalesce((select role from profiles where id = auth.uid()), 'public'::role);
$$;

create or replace function is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('admin','super_admin') from profiles where id = auth.uid()),
    false
  );
$$;

create or replace function my_community()
returns integer language sql stable security definer set search_path = public as $$
  select community_id from profiles where id = auth.uid();
$$;

-- ---- Reference data: world-readable, admin-writable --------
do $$
declare t text;
begin
  foreach t in array array['communities','units','cabinet_positions','sdg_goals'] loop
    execute format('alter table %I enable row level security;', t);
    execute format('create policy %I_read on %I for select using (true);', t, t);
    execute format('create policy %I_write on %I for all using (is_admin()) with check (is_admin());', t, t);
  end loop;
end$$;

-- ---- Profiles ----------------------------------------------
alter table profiles enable row level security;
create policy profiles_select_own on profiles
  for select using (id = auth.uid() or is_admin());
create policy profiles_update_own on profiles
  for update using (id = auth.uid() or is_admin())
  with check (id = auth.uid() or is_admin());
-- insert is performed by the SECURITY DEFINER signup trigger.

-- ---- CIN reports: officers manage their community ----------
alter table cin_reports enable row level security;
create policy cin_select on cin_reports
  for select using (is_admin() or officer_id = auth.uid() or community_id = my_community());
create policy cin_insert on cin_reports
  for insert with check (officer_id = auth.uid() and community_id = my_community());
create policy cin_update on cin_reports
  for update using (is_admin() or officer_id = auth.uid());

-- ---- Authenticated-read operational tables -----------------
do $$
declare t text;
begin
  foreach t in array array[
    'parliament_sessions','committees','bills','motions','votes','attendance',
    'hansard','youth_recommendations','project_updates','project_images',
    'project_sdgs','budgets','expenditures','approvals','nominations',
    'vetting_reviews','tac_members','tac_engagements','endorsements',
    'cin_report_images','cin_report_sdgs'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy %I_read on %I for select using (auth.uid() is not null);', t, t);
    execute format(
      'create policy %I_write on %I for all using (is_admin()) with check (is_admin());', t, t);
  end loop;
end$$;

-- ---- Projects: published are public; staff/admin see all ----
alter table projects enable row level security;
create policy projects_public_read on projects
  for select using (is_published or auth.uid() is not null);
create policy projects_admin_write on projects
  for all using (is_admin()) with check (is_admin());

-- ---- Transparency: published rows are world-readable -------
do $$
declare t text;
begin
  foreach t in array array[
    'public_reports','published_budgets','community_scorecards','annual_reports'
  ] loop
    execute format('alter table %I enable row level security;', t);
    execute format(
      'create policy %I_pub_read on %I for select using (is_published or auth.uid() is not null);', t, t);
    execute format(
      'create policy %I_admin_write on %I for all using (is_admin()) with check (is_admin());', t, t);
  end loop;
end$$;
