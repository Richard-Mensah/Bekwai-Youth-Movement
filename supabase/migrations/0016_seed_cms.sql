-- ============================================================
-- 0016 Seed CMS content
-- One-time, idempotent seed so the CMS is the source of truth for the
-- public site. Mirrors the hardcoded constants (constants/news.ts,
-- constants/leadership.ts, constants/cabinet.ts) into the DB so the
-- empty-table fallback in lib/data/content.ts is no longer relied upon.
-- Safe to run more than once (guards on slug / (tier, title) / event slug).
-- ============================================================

-- ---- Posts  <- constants/news.ts ---------------------------
-- Slug is computed exactly like lib/cms.ts slugify().
insert into posts (slug, title, excerpt, body, external_url, tags, status, published_at)
select
  left(trim(both '-' from regexp_replace(lower(x.title), '[^a-z0-9]+', '-', 'g')), 80) as slug,
  x.title,
  x.summary,
  x.summary,
  x.href,
  coalesce((select array_agg('SDG ' || s) from jsonb_array_elements_text(x.sdg) s), '{}'),
  'published',
  (x.date)::timestamptz
from jsonb_to_recordset($json$[
  {"title":"BYM at the 2nd African Youth Summit on Biodiversity (AYSB2023)","summary":"BYM joined youth delegates across Africa under the theme “From Awareness to Action,” championing sustainable farming, community biodiversity education, and youth-led agricultural change for Sefwi Bekwai.","href":"https://bekwaiyouthmovement.medium.com/empowering-youth-for-agricultural-change-bekwai-youth-movements-participation-in-african-youth-b9da8c69a805","date":"2023-09-22","sdg":[2,13,15]},
  {"title":"Championing climate action at MAI Foundation & Sustainability Week","summary":"Representing the movement at a regional sustainability convening on human capital and climate, BYM pledged to translate insights into practical adaptation and reforestation initiatives back home.","href":"https://bekwaiyouthmovement.medium.com/bekwai-youth-movement-champions-climate-change-at-mai-foundation-sustainability-week-a-28d317236752","date":"2023-09-24","sdg":[13,8,17]},
  {"title":"Insights from the Global Symposium on Soils & Water","summary":"BYM gathered practical knowledge on soil and water stewardship to drive community development initiatives across our 32 communities.","href":"https://bekwaiyouthmovement.medium.com/","date":"2023-11-04","sdg":[6,15]},
  {"title":"BYM at the SDG Summit Debrief","summary":"Engaging directly with the UN Sustainable Development Goals agenda and bringing the conversation back to grassroots action in Western North Ghana.","href":"https://bekwaiyouthmovement.medium.com/","date":"2023-09-28","sdg":[17]},
  {"title":"Empowering Ukrainian youth through education with GoGlobal","summary":"A BYM delegate took part in international volunteer work focused on youth education empowerment, extending our commitment to young people beyond borders.","href":"https://bekwaiyouthmovement.medium.com/","date":"2023-11-04","sdg":[4]},
  {"title":"Building back from COVID-19 to achieve the SDGs","summary":"Contributing youth perspectives on post-pandemic recovery and resilient, sustainable communities.","href":"https://bekwaiyouthmovement.medium.com/","date":"2023-09-22","sdg":[3,11]},
  {"title":"Fostering peace and sustainable development","summary":"Demonstrating BYM's commitment to conflict resolution, strong institutions, and development that lasts.","href":"https://bekwaiyouthmovement.medium.com/","date":"2023-09-21","sdg":[16]}
]$json$::jsonb) as x(title text, summary text, href text, date text, sdg jsonb)
where not exists (
  select 1 from posts p
  where p.slug = left(trim(both '-' from regexp_replace(lower(x.title), '[^a-z0-9]+', '-', 'g')), 80)
);

-- ---- Events  <- Founding Day -------------------------------
insert into events (slug, title, description, location, starts_at, is_published)
select
  'founding-day',
  'Official Launch: Founding Day of the Youth General Assembly',
  'The founding public ceremony of the BYM Youth General Assembly. The Cabinet, Parliament, Council Representatives, and CIN Officers are formally inaugurated.',
  'Sefwi Bekwai, Western North Region, Ghana',
  '2027-01-12T08:30:00Z'::timestamptz,
  true
where not exists (select 1 from events e where e.slug = 'founding-day');

-- ---- Leaders  <- constants/leadership.ts + cabinet.ts ------
insert into leaders (tier, title, name, blurb, uk_equivalent, sdg, sort_order, is_published)
select
  x.tier,
  x.title,
  x.name,
  x.blurb,
  x.uk_equivalent,
  coalesce((select array_agg(v::int) from jsonb_array_elements_text(x.sdg) v), '{}'),
  x.sort_order,
  true
from jsonb_to_recordset($json$[
  {"tier":"cabinet","title":"Director-General (DG)","name":"Owusu Philip","uk_equivalent":"Prime Minister","blurb":"Supreme head of the Assembly; chairs Cabinet and General Assembly sittings; represents BYM externally.","sdg":[16,17],"sort_order":0},
  {"tier":"cabinet","title":"1st Deputy Director-General","name":"Owusu Nyame Janet","uk_equivalent":"Deputy PM","blurb":"Deputises the DG; chairs Cabinet in the DG's absence; oversees cross-portfolio coordination.","sdg":[16],"sort_order":1},
  {"tier":"cabinet","title":"2nd Deputy Director-General","uk_equivalent":"Deputy PM","blurb":"Oversees the Community Intelligence Network and data operations; ensures monthly reports are delivered.","sdg":[17],"sort_order":2},
  {"tier":"cabinet","title":"Secretary-General","uk_equivalent":"Cabinet Secretary / Chief of Staff","blurb":"Chief administrative officer; custodian of official documents; records minutes; registers members.","sdg":[16],"sort_order":3},
  {"tier":"cabinet","title":"Deputy Secretary-General","uk_equivalent":"Deputy Civic/Town Secretary","blurb":"Manages digital communications; maintains the website and social media; coordinates digital records.","sdg":[17],"sort_order":4},
  {"tier":"cabinet","title":"Chief Financial Officer","uk_equivalent":"Chancellor of the Exchequer","blurb":"Manages all Assembly funds; presents quarterly financial reports; maintains the financial register.","sdg":[17],"sort_order":5},
  {"tier":"cabinet","title":"Deputy Financial Secretary","uk_equivalent":"Treasury Board","blurb":"Manages petty cash and project-level expenditure; reconciles community project budgets.","sdg":[17],"sort_order":6},
  {"tier":"cabinet","title":"Secretary for Education & Youth","uk_equivalent":"Secretary of State for Education","blurb":"Leads the Education & Youth Development Unit and the Youth Development Academy.","sdg":[4,8],"sort_order":7},
  {"tier":"cabinet","title":"Secretary for Health & Welfare","uk_equivalent":"Secretary for Health","blurb":"Leads the Health & Social Welfare Unit; coordinates health campaigns and child protection.","sdg":[3,5],"sort_order":8},
  {"tier":"cabinet","title":"Secretary for Economic Affairs","uk_equivalent":"Secretary for Work & Enterprise","blurb":"Leads the Economic Empowerment & Employment Unit across all 32 communities.","sdg":[1,8,10],"sort_order":9},
  {"tier":"cabinet","title":"Secretary for Environment","uk_equivalent":"Secretary for Environment","blurb":"Leads the Environment, Sanitation & Climate Unit and Volunteer Action Teams.","sdg":[6,11,13,15],"sort_order":10},
  {"tier":"cabinet","title":"Secretary for Communications","name":"Kofi Richard","uk_equivalent":"Secretary for Digital, Culture & Media","blurb":"Leads the Communications Unit; manages public communications, media, and the BYM website.","sdg":[17],"sort_order":11},
  {"tier":"cabinet","title":"Home Secretary","uk_equivalent":"Secretary for the Interior","blurb":"Manages internal security, conflict resolution, member conduct, and the Code of Conduct.","sdg":[16],"sort_order":12},
  {"tier":"cabinet","title":"Secretary for Regional Affairs & Partnerships","uk_equivalent":"Regional Secretary","blurb":"Manages external partnerships, NGOs, diaspora, and international organisations.","sdg":[17],"sort_order":13},
  {"tier":"cabinet","title":"Secretary for Women & Gender Equality","uk_equivalent":"Director for Women & Equalities","blurb":"Ensures ≥40% female representation across all arms; leads women-focused programmes.","sdg":[5,10],"sort_order":14},
  {"tier":"cabinet","title":"Secretary for Youth Parliament Affairs","uk_equivalent":"Leader of the House","blurb":"Manages the relationship between the Cabinet and the Youth Parliament.","sdg":[16],"sort_order":15},
  {"tier":"cabinet","title":"Civic Organiser","uk_equivalent":"Chief Whip","blurb":"Coordinates all BYM events, sittings, and community outreach; manages logistics.","sdg":[11,17],"sort_order":16},
  {"tier":"cabinet","title":"Deputy Organiser","uk_equivalent":"Deputy Chief Whip","blurb":"Assists the Organiser; manages sub-community event coordination.","sdg":[17],"sort_order":17},
  {"tier":"cabinet","title":"Inter-Community Liaison Officer","uk_equivalent":"Civil Lead","blurb":"Manages relations with minority communities; ensures every sub-group is represented.","sdg":[10,16],"sort_order":18},
  {"tier":"parliament","title":"Speaker of the Youth Parliament","blurb":"Presides over all sittings; maintains order; certifies Youth Recommendations to the Cabinet.","sdg":[16],"sort_order":0},
  {"tier":"parliament","title":"Deputy Speaker","blurb":"Deputises the Speaker; oversees procedural compliance.","sdg":[16],"sort_order":1},
  {"tier":"parliament","title":"Majority Leader","uk_equivalent":"Civic Frontbench Lead","blurb":"Leads the majority caucus; schedules debates.","sdg":[16],"sort_order":2},
  {"tier":"parliament","title":"Minority / Opposition Leader","uk_equivalent":"Shadow Leader of the House","blurb":"Ensures balanced debate and alternative perspectives.","sdg":[16],"sort_order":3},
  {"tier":"parliament","title":"Parliament Clerk","blurb":"Records minutes; manages documentation; files Youth Recommendations.","sdg":[16,17],"sort_order":4},
  {"tier":"cin","title":"Director of Community Intelligence","blurb":"Oversees all 32 CIN Officers; designs data tools; compiles the Monthly Community Reports.","sdg":[16,17],"sort_order":0},
  {"tier":"cin","title":"Deputy Director of Intelligence","blurb":"Field-trains CIN Officers; verifies monthly data submissions.","sdg":[16],"sort_order":1},
  {"tier":"cin","title":"Data Quality Officer","blurb":"Audits submissions for accuracy; maintains data-integrity standards.","sdg":[16],"sort_order":2},
  {"tier":"tac","title":"Patron of the Assembly","uk_equivalent":"Paramount Chief of Sefwi Bekwai","blurb":"Blesses the Assembly and anchors its standing in tradition.","sort_order":0},
  {"tier":"tac","title":"Women's Patron","uk_equivalent":"Queenmother of Sefwi Bekwai","blurb":"Champions the place of women and girls across the movement.","sort_order":1},
  {"tier":"tac","title":"Government Liaison Patron","uk_equivalent":"Municipal Chief Executive (MCE)","blurb":"Bridges the Assembly with municipal government.","sort_order":2},
  {"tier":"tac","title":"Institutional Patron","uk_equivalent":"Bibiani-Anhwiaso-Bekwai Municipal Assembly","blurb":"Connects BYM to formal local-government institutions.","sort_order":3}
]$json$::jsonb) as x(tier text, title text, name text, blurb text, uk_equivalent text, sdg jsonb, sort_order int)
where not exists (
  select 1 from leaders l where l.tier = x.tier and l.title = x.title
);

-- Keep any pre-existing custom cabinet entries (e.g. user-added) after the
-- official 19, so the seeded cabinet leads in its natural order.
update leaders
set sort_order = sort_order + 100
where tier = 'cabinet'
  and title not in (
    'Director-General (DG)','1st Deputy Director-General','2nd Deputy Director-General',
    'Secretary-General','Deputy Secretary-General','Chief Financial Officer',
    'Deputy Financial Secretary','Secretary for Education & Youth','Secretary for Health & Welfare',
    'Secretary for Economic Affairs','Secretary for Environment','Secretary for Communications',
    'Home Secretary','Secretary for Regional Affairs & Partnerships','Secretary for Women & Gender Equality',
    'Secretary for Youth Parliament Affairs','Civic Organiser','Deputy Organiser',
    'Inter-Community Liaison Officer'
  )
  and sort_order < 100;
