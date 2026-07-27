-- 0022_real_community_names.sql
--
-- Makes the database agree with constants/communities.ts, which holds BYM's
-- real community list.
--
-- Two problems being fixed at once.
--
-- 1. The table still held the original placeholder names (Awaso, Chirano,
--    Kunkumso …) from before the list was confirmed. Commit feea520 updated the
--    constant and never touched the database.
--
-- 2. getCommunities() selects a `slug` column that has never existed on this
--    table, so PostgREST rejected the query, `data` came back null, and the
--    read fell through to its constants fallback. That fallback is the only
--    reason the public site looked correct — every surface reading the table
--    directly, such as the members directory, showed the placeholder names.
--
-- Rows are updated in place rather than replaced, so the community_id on
-- existing profiles keeps pointing at the same row. Members signed up against
-- the constants-driven dropdown, so their stored ids already mean the real
-- names; renaming the rows is what makes their records read correctly.

alter table public.communities add column if not exists slug text;

insert into public.communities (id, name, is_town, slug) values
  (1, 'Sefwi Bekwai', true, 'sefwi-bekwai'),
  (2, 'Humjibre', false, 'humjibre'),
  (3, 'Kojina', false, 'kojina'),
  (4, 'Apenkrom', false, 'apenkrom'),
  (5, 'Nyitina', false, 'nyitina'),
  (6, 'Adobewura No.1', false, 'adobewura-no-1'),
  (7, 'Adobewura No.2', false, 'adobewura-no-2'),
  (8, 'Akaasu', false, 'akaasu'),
  (9, 'Kofikrom', false, 'kofikrom'),
  (10, 'Ashiam', false, 'ashiam'),
  (11, 'Naama/Clinic Top', false, 'naama-clinic-top'),
  (12, 'Bekwai Township', false, 'bekwai-township'),
  (13, 'Zongo', false, 'zongo'),
  (14, 'Surano', false, 'surano'),
  (15, 'Donkorkrom', false, 'donkorkrom'),
  (16, 'Dansokrom', false, 'dansokrom'),
  (17, 'Bankromisa', false, 'bankromisa'),
  (18, 'Market Square', false, 'market-square'),
  (19, 'Post Office/Ayiam', false, 'post-office-ayiam'),
  (20, 'Sukusukuu', false, 'sukusukuu'),
  (21, 'Lowcost/Axle Weight', false, 'lowcost-axle-weight'),
  (22, 'Chira', false, 'chira'),
  (23, 'Bakromisa', false, 'bakromisa'),
  (24, 'Sonkoli', false, 'sonkoli'),
  (25, 'Atwima', false, 'atwima'),
  (26, 'Muoho', false, 'muoho'),
  (27, 'Bakokrom', false, 'bakokrom'),
  (28, 'Atronsu', false, 'atronsu'),
  (29, 'Ampez', false, 'ampez'),
  (30, 'Achimota', false, 'achimota'),
  (31, 'Peaceland', false, 'peaceland'),
  (32, 'Pimtibikrom', false, 'pimtibikrom'),
  (33, 'Difo Nkansah Area', false, 'difo-nkansah-area')
on conflict (id) do update
  set name = excluded.name,
      is_town = excluded.is_town,
      slug = excluded.slug;

-- Placeholder rows beyond the real list. Blocked by a foreign key if anything
-- still references one, which is the outcome we want over a silent orphan.
delete from public.communities where id > 33;

create unique index if not exists communities_slug_key on public.communities (slug);

alter table public.communities alter column slug set not null;
