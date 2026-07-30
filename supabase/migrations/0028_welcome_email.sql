-- 0028_welcome_email.sql
--
-- Records when a member was sent their welcome email, so they are sent it once.
--
-- The alternative to a column is "send it from the signup form and hope" — which
-- sends a second copy on every React re-invocation, every retried submit, and
-- every time someone reloads the confirmation screen. A nullable timestamp makes
-- the send idempotent and, incidentally, answers "did this member ever hear from
-- us?" — which the Secretariat will want to know the moment someone says they
-- never got anything.
--
-- Nullable with no default: null means "not sent", which is the correct state for
-- the 13 members who registered before this existed. Backfilling a timestamp
-- would claim we emailed people we did not.

alter table profiles
  add column if not exists welcome_email_sent_at timestamptz;

comment on column profiles.welcome_email_sent_at is
  'When the post-signup welcome email was sent. Null = never sent. Set by the '
  'sendWelcomeEmail server action, which refuses to send twice.';

-- No index. It is read by primary key (the member''s own row) and never filtered
-- across the table, so an index would be write cost for nothing.

-- Deliberately NOT added to the 0021 privilege guard's protected column list.
-- A member could clear their own timestamp and re-trigger their own welcome
-- email, to their own inbox, which is not an attack worth a trigger branch.

-- ============================================================
-- TO REVERT:
--   alter table profiles drop column if exists welcome_email_sent_at;
-- Dropping it makes the action fall back to sending on every call, so remove
-- the call site first.
-- ============================================================
