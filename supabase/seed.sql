-- ============================================================
-- BYM seed data — reference tables
-- Run after all migrations. Idempotent via ON CONFLICT.
-- ============================================================

-- ---- Communities (32): Sefwi Bekwai + 31 sub-communities ----
-- NOTE: sub-community names are PLACEHOLDERS — replace with real names.
insert into communities (id, name, is_town) values (1, 'Sefwi Bekwai', true)
  on conflict (id) do nothing;
insert into communities (id, name, is_town)
select g + 1, 'Sub-Community ' || lpad(g::text, 2, '0'), false
from generate_series(1, 31) g
  on conflict (id) do nothing;
select setval(pg_get_serial_sequence('communities','id'), (select max(id) from communities));

-- ---- SDG goals (12) ----------------------------------------
insert into sdg_goals (goal, title, color) values
  (1,  'No Poverty', '#E5243B'),
  (3,  'Good Health & Well-being', '#4C9F38'),
  (4,  'Quality Education', '#C5192D'),
  (5,  'Gender Equality', '#FF3A21'),
  (6,  'Clean Water & Sanitation', '#26BDE2'),
  (8,  'Decent Work & Economic Growth', '#A21942'),
  (10, 'Reduced Inequalities', '#DD1367'),
  (11, 'Sustainable Communities', '#FD9D24'),
  (13, 'Climate Action', '#3F7E44'),
  (15, 'Life on Land', '#56C02B'),
  (16, 'Peace, Justice & Strong Institutions', '#00689D'),
  (17, 'Partnerships for the Goals', '#19486A')
  on conflict (goal) do nothing;

-- ---- Units (7) ---------------------------------------------
insert into units (no, name, officer, sdg) values
  (1, 'Governance & Civic Affairs Unit', 'Secretary-General', '{16,17}'),
  (2, 'Education & Youth Development Unit', 'Secretary for Education', '{4,8}'),
  (3, 'Health & Social Welfare Unit', 'Secretary for Health & Welfare', '{3,5}'),
  (4, 'Economic Empowerment & Employment Unit', 'Secretary for Economic Affairs', '{1,8,10}'),
  (5, 'Environment, Sanitation & Climate Unit', 'Secretary for Environment', '{6,11,13,15}'),
  (6, 'Community Intelligence & Data Unit', 'Director of Intelligence', '{16,17}'),
  (7, 'Communications, Media & Partnerships Unit', 'Secretary for Communications', '{17}')
  on conflict (no) do nothing;

-- ---- Cabinet positions (19) --------------------------------
insert into cabinet_positions (no, title, uk_equivalent, sdg) values
  (1,  'Director-General (DG)', 'Prime Minister', '{16,17}'),
  (2,  '1st Deputy Director-General', 'Deputy PM', '{16}'),
  (3,  '2nd Deputy Director-General', 'Deputy PM', '{17}'),
  (4,  'Secretary-General', 'Cabinet Secretary / Chief of Staff', '{16}'),
  (5,  'Deputy Secretary-General', 'Deputy Civic/Town Secretary', '{17}'),
  (6,  'Chief Financial Officer', 'Chancellor of the Exchequer', '{17}'),
  (7,  'Deputy Financial Secretary', 'Treasury Board', '{17}'),
  (8,  'Secretary for Education & Youth', 'Secretary of State for Education', '{4,8}'),
  (9,  'Secretary for Health & Welfare', 'Secretary for Health', '{3,5}'),
  (10, 'Secretary for Economic Affairs', 'Secretary for Work & Enterprise', '{1,8,10}'),
  (11, 'Secretary for Environment', 'Secretary for Environment', '{6,11,13,15}'),
  (12, 'Secretary for Communications', 'Secretary for Digital, Culture & Media', '{17}'),
  (13, 'Home Secretary', 'Secretary for the Interior', '{16}'),
  (14, 'Secretary for Regional Affairs & Partnerships', 'Regional Secretary', '{17}'),
  (15, 'Secretary for Women & Gender Equality', 'Director for Women & Equalities', '{5,10}'),
  (16, 'Secretary for Youth Parliament Affairs', 'Leader of the House', '{16}'),
  (17, 'Civic Organiser', 'Chief Whip', '{11,17}'),
  (18, 'Deputy Organiser', 'Deputy Chief Whip', '{17}'),
  (19, 'Inter-Community Liaison Officer', 'Civil Lead', '{10,16}')
  on conflict (no) do nothing;

-- Wire reporting lines (reports_to_id) by title.
update cabinet_positions c set reports_to_id = p.id
from cabinet_positions p
where (c.no in (2,3,4,6) and p.no = 1)               -- direct to DG
   or (c.no = 5 and p.no = 4)                         -- Dep Sec-Gen -> Sec-Gen
   or (c.no = 7 and p.no = 6)                         -- Dep Fin -> CFO
   or (c.no between 8 and 17 and p.no = 2)            -- Secretaries -> 1st DDG
   or (c.no = 18 and p.no = 17)                       -- Dep Organiser -> Organiser
   or (c.no = 19 and p.no = 13);                      -- ICL -> Home Secretary

-- ---- Standing committees (Parliament) ----------------------
insert into committees (name) values
  ('Education, Youth & Skills Development'),
  ('Health, Sanitation & Environment'),
  ('Agriculture, Trade & Economic Development'),
  ('Community Infrastructure & Housing'),
  ('Gender, Social Welfare & Inclusion'),
  ('Security, Peace & Conflict Resolution'),
  ('Rules, Privileges & Disciplinary Matters'),
  ('Finance & Resource Mobilisation')
  on conflict do nothing;

-- ---- Traditional Advisory Council (placeholder titles) -----
insert into tac_members (title, role_desc) values
  ('Paramount Chief of Sefwi Bekwai', 'Patron of the Assembly'),
  ('Queenmother of Sefwi Bekwai', 'Women''s Patron'),
  ('Municipal Chief Executive', 'Government Liaison Patron')
  on conflict do nothing;
