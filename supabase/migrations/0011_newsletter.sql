-- ============================================================
-- 0011 Newsletter subscribers (public signups from the footer)
-- ============================================================

create table if not exists newsletter_subscribers (
  id          uuid primary key default gen_random_uuid(),
  email       text not null unique,
  source      text not null default 'footer',
  created_at  timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

-- Anyone (including anonymous visitors) may subscribe...
create policy newsletter_insert on newsletter_subscribers
  for insert with check (true);

-- ...but only admins can read the subscriber list.
create policy newsletter_admin_read on newsletter_subscribers
  for select using (is_admin());

-- PostgREST role grants (RLS still applies on top of these).
grant insert on newsletter_subscribers to anon, authenticated;
grant select on newsletter_subscribers to authenticated;
