-- 0026_foreign_key_indexes.sql
--
-- Index every foreign key that did not have one. 36 of them.
--
-- Postgres indexes a primary key automatically and a foreign key not at all, so
-- the child side of every relationship in this schema was a sequential scan.
-- Two consequences, and the second is the one that bites:
--
--  1. Joins and lookups by parent scan the whole child table. `votes` by bill,
--     `expenditures` by project, `hansard` by session — all of them.
--  2. Every `on delete cascade` / `set null` scans the child table to find rows
--     to fix up. Deleting one member currently scans attendance, votes, bills,
--     motions, approvals, endorsements and the rest, one after another. That is
--     why removing a test account felt slow, and it gets linearly worse as the
--     drive adds members.
--
-- Not a speculative optimisation: the list was generated from pg_constraint
-- against the live database, taking only foreign keys with no index whose
-- leading columns match the constraint. Confirmed by Supabase's own performance
-- advisor, which reported exactly these 36 as `unindexed_foreign_keys`.
--
-- Written and applied while the tables are near-empty, which is the cheapest
-- moment this will ever happen — each one is effectively instant now, and would
-- need CONCURRENTLY and a maintenance window once these tables hold real
-- governance data.
--
-- Safe by construction: `if not exists` everywhere, no data touched, and an
-- index only ever changes how a query is answered, never the answer. To roll
-- back, `drop index` any of them individually; nothing depends on them.

create index if not exists application_events_actor_id_idx on public.application_events (actor_id);
create index if not exists approvals_approver_id_idx on public.approvals (approver_id);
create index if not exists approvals_project_id_idx on public.approvals (project_id);
create index if not exists attendance_member_id_idx on public.attendance (member_id);
create index if not exists bills_committee_id_idx on public.bills (committee_id);
create index if not exists bills_session_id_idx on public.bills (session_id);
create index if not exists bills_sponsor_id_idx on public.bills (sponsor_id);
create index if not exists budgets_project_id_idx on public.budgets (project_id);
create index if not exists cabinet_positions_reports_to_id_idx on public.cabinet_positions (reports_to_id);
create index if not exists cin_report_images_report_id_idx on public.cin_report_images (report_id);
create index if not exists cin_report_sdgs_goal_idx on public.cin_report_sdgs (goal);
create index if not exists community_scorecards_community_id_idx on public.community_scorecards (community_id);
create index if not exists content_audit_actor_id_idx on public.content_audit (actor_id);
create index if not exists endorsements_endorser_id_idx on public.endorsements (endorser_id);
create index if not exists expenditures_approved_by_idx on public.expenditures (approved_by);
create index if not exists expenditures_project_id_idx on public.expenditures (project_id);
create index if not exists hansard_session_id_idx on public.hansard (session_id);
create index if not exists leadership_applications_decided_by_idx on public.leadership_applications (decided_by);
create index if not exists motions_mover_id_idx on public.motions (mover_id);
create index if not exists motions_session_id_idx on public.motions (session_id);
create index if not exists newsletter_broadcasts_created_by_idx on public.newsletter_broadcasts (created_by);
create index if not exists nominations_community_id_idx on public.nominations (community_id);
create index if not exists posts_author_id_idx on public.posts (author_id);
create index if not exists profiles_cabinet_position_id_idx on public.profiles (cabinet_position_id);
create index if not exists project_images_project_id_idx on public.project_images (project_id);
create index if not exists project_sdgs_goal_idx on public.project_sdgs (goal);
create index if not exists project_updates_project_id_idx on public.project_updates (project_id);
create index if not exists projects_lead_id_idx on public.projects (lead_id);
create index if not exists projects_unit_id_idx on public.projects (unit_id);
create index if not exists tac_engagements_community_id_idx on public.tac_engagements (community_id);
create index if not exists tac_members_community_id_idx on public.tac_members (community_id);
create index if not exists vetting_reviews_nomination_id_idx on public.vetting_reviews (nomination_id);
create index if not exists vetting_reviews_reviewer_id_idx on public.vetting_reviews (reviewer_id);
create index if not exists votes_bill_id_idx on public.votes (bill_id);
create index if not exists votes_motion_id_idx on public.votes (motion_id);
create index if not exists youth_recommendations_community_id_idx on public.youth_recommendations (community_id);

-- Deliberately NOT dropped, though the advisor lists them as unused:
--   cin_reports_community_idx, projects_*, leadership_applications_* (x2)
-- "Unused" here means "not used yet" — the platform has barely been operated.
-- Dropping an index that a future admin filter needs is a regression you find
-- in production; keeping four small unused indexes costs almost nothing.
