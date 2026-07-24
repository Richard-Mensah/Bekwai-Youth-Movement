-- ============================================================
-- 0019 Seed gallery (additional 2021 photos)
-- Adds the newly supplied BYM photos to the CMS gallery_images table so
-- they appear on /gallery and feed the homepage hero + highlights. Idempotent:
-- skips any path already present, so re-runs and user-added rows are safe.
-- Files are served from /public/images/history.
-- ============================================================

insert into gallery_images (path, caption, sort_order)
select x.path, '', x.sort_order
from jsonb_to_recordset($json$[
  {"path":"/images/history/IMG-20211210-WA0013.jpg","sort_order":15},
  {"path":"/images/history/IMG-20211114-WA0037.jpg","sort_order":16},
  {"path":"/images/history/IMG-20211210-WA0043.jpg","sort_order":17},
  {"path":"/images/history/IMG-20211210-WA0035.jpg","sort_order":18},
  {"path":"/images/history/IMG-20211210-WA0006.jpg","sort_order":19},
  {"path":"/images/history/IMG-20211210-WA0048.jpg","sort_order":20},
  {"path":"/images/history/IMG-20211210-WA0049.jpg","sort_order":21},
  {"path":"/images/history/IMG-20211210-WA0036.jpg","sort_order":22},
  {"path":"/images/history/IMG-20211220-WA0002.jpg","sort_order":23},
  {"path":"/images/history/IMG-20211113-WA0020.jpg","sort_order":24},
  {"path":"/images/history/IMG-20211113-WA0024.jpg","sort_order":25},
  {"path":"/images/history/IMG-20211114-WA0038.jpg","sort_order":26},
  {"path":"/images/history/IMG-20211126-WA0001.jpg","sort_order":27},
  {"path":"/images/history/IMG-20211204-WA0001.jpg","sort_order":28},
  {"path":"/images/history/275513517_145137107982869_5887215383066194674_n.jpg","sort_order":29},
  {"path":"/images/history/279361960_158851559944757_3313056682566741472_n.jpg","sort_order":30},
  {"path":"/images/history/Screenshot_20211113-103455_GBWhatsApp.jpg","sort_order":31},
  {"path":"/images/history/Screenshot_20211208-153419_Video_Player.jpg","sort_order":32}
]$json$::jsonb) as x(path text, sort_order int)
where not exists (
  select 1 from gallery_images g where g.path = x.path
);
