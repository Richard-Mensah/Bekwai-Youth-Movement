-- ============================================================
-- 0013 Content Management System (CMS)
-- Tables for editable frontend content + a public `content` storage
-- bucket. RLS: public reads published rows; content managers write.
-- ============================================================

-- Permission helper: admins + super-admins + Communications Secretary.
create or replace function can_manage_content()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role in ('admin','super_admin','secretary') from profiles where id = auth.uid()),
    false
  );
$$;

-- ---- Tables -------------------------------------------------
create table if not exists posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text,
  body         text,
  cover_path   text,
  external_url text,
  tags         text[] not null default '{}',
  status       text not null default 'draft',  -- draft | published
  published_at timestamptz,
  author_id    uuid references profiles(id),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists leaders (
  id            uuid primary key default gen_random_uuid(),
  tier          text not null,                 -- cabinet | parliament | cin | tac
  title         text not null,
  name          text,
  photo_path    text,
  blurb         text,
  uk_equivalent text,
  sdg           int[] not null default '{}',
  sort_order    int not null default 0,
  is_published  boolean not null default true,
  created_at    timestamptz not null default now()
);

create table if not exists gallery_images (
  id          uuid primary key default gen_random_uuid(),
  path        text not null,
  caption     text,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  description  text,
  location     text,
  starts_at    timestamptz,
  ends_at      timestamptz,
  cover_path   text,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists partners (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  logo_path    text,
  url          text,
  tier         text not null default 'partner',
  sort_order   int not null default 0,
  is_published boolean not null default true,
  created_at   timestamptz not null default now()
);

create table if not exists site_settings (
  key        text primary key,
  value      jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists newsletter_broadcasts (
  id              uuid primary key default gen_random_uuid(),
  subject         text not null,
  body            text not null,
  status          text not null default 'draft',  -- draft | sent
  recipient_count int not null default 0,
  sent_at         timestamptz,
  created_by      uuid references profiles(id),
  created_at      timestamptz not null default now()
);

create table if not exists content_audit (
  id         uuid primary key default gen_random_uuid(),
  actor_id   uuid references profiles(id),
  entity     text not null,
  entity_id  text,
  action     text not null,
  summary    text,
  created_at timestamptz not null default now()
);

-- Contact inbox workflow status.
alter table contact_messages add column if not exists status text not null default 'new';

-- ---- Row Level Security ------------------------------------
alter table posts enable row level security;
alter table leaders enable row level security;
alter table gallery_images enable row level security;
alter table events enable row level security;
alter table partners enable row level security;
alter table site_settings enable row level security;
alter table newsletter_broadcasts enable row level security;
alter table content_audit enable row level security;

create policy posts_public_read on posts
  for select using (status = 'published' or can_manage_content());
create policy posts_write on posts
  for all using (can_manage_content()) with check (can_manage_content());

create policy leaders_public_read on leaders
  for select using (is_published or can_manage_content());
create policy leaders_write on leaders
  for all using (can_manage_content()) with check (can_manage_content());

create policy gallery_public_read on gallery_images for select using (true);
create policy gallery_write on gallery_images
  for all using (can_manage_content()) with check (can_manage_content());

create policy events_public_read on events
  for select using (is_published or can_manage_content());
create policy events_write on events
  for all using (can_manage_content()) with check (can_manage_content());

create policy partners_public_read on partners
  for select using (is_published or can_manage_content());
create policy partners_write on partners
  for all using (can_manage_content()) with check (can_manage_content());

create policy settings_public_read on site_settings for select using (true);
create policy settings_write on site_settings
  for all using (can_manage_content()) with check (can_manage_content());

create policy broadcasts_manage on newsletter_broadcasts
  for all using (can_manage_content()) with check (can_manage_content());

create policy audit_read on content_audit
  for select using (can_manage_content());
create policy audit_insert on content_audit
  for insert with check (can_manage_content());

-- Let content managers (not just admins) edit community names.
create policy communities_manage_update on communities
  for update using (can_manage_content()) with check (can_manage_content());

-- ---- PostgREST role grants (RLS still applies) -------------
grant select on posts, leaders, gallery_images, events, partners, site_settings
  to anon, authenticated;
grant insert, update, delete on
  posts, leaders, gallery_images, events, partners, site_settings,
  newsletter_broadcasts, content_audit
  to authenticated;
grant select on newsletter_broadcasts, content_audit to authenticated;

-- ---- Storage: public `content` bucket ----------------------
insert into storage.buckets (id, name, public)
values ('content', 'content', true)
on conflict (id) do nothing;

create policy "content_read" on storage.objects
  for select to anon, authenticated using (bucket_id = 'content');
create policy "content_write" on storage.objects
  for insert to authenticated with check (bucket_id = 'content');
create policy "content_update" on storage.objects
  for update to authenticated using (bucket_id = 'content');
create policy "content_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'content');
