-- ============================================================
-- 0012 Contact messages (public enquiries from the contact form)
-- ============================================================

create table if not exists contact_messages (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  topic       text,
  message     text not null,
  created_at  timestamptz not null default now()
);

alter table contact_messages enable row level security;

-- Anyone (including anonymous visitors) may send a message...
create policy contact_insert on contact_messages
  for insert with check (true);

-- ...but only admins can read the inbox.
create policy contact_admin_read on contact_messages
  for select using (is_admin());

grant insert on contact_messages to anon, authenticated;
grant select on contact_messages to authenticated;
