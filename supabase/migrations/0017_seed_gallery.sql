-- ============================================================
-- 0017 Seed gallery
-- Loads the 15 curated history photos (constants/gallery.ts) into the CMS
-- gallery_images table so /gallery shows real photos. Idempotent: skips any
-- path already present, so user-added images and re-runs are safe.
-- Files are served from /public/images/history and publicUrl() passes
-- /-prefixed paths through unchanged.
-- ============================================================

insert into gallery_images (path, caption, sort_order)
select x.path, '', x.sort_order
from jsonb_to_recordset($json$[
  {"path":"/images/history/472533608_1643728982885427_6727051425384547508_n.jpg","sort_order":0},
  {"path":"/images/history/472766257_1643725496219109_5142496528883252813_n.jpg","sort_order":1},
  {"path":"/images/history/472658272_1643725659552426_3841496885343756339_n.jpg","sort_order":2},
  {"path":"/images/history/472537382_1644476426144016_8168085223803727278_n.jpg","sort_order":3},
  {"path":"/images/history/472570418_1644476379477354_4699580759498771881_n.jpg","sort_order":4},
  {"path":"/images/history/472398995_1644476392810686_855021471226072194_n.jpg","sort_order":5},
  {"path":"/images/history/472434052_1644476419477350_7263677863074049163_n.jpg","sort_order":6},
  {"path":"/images/history/472553374_1644476432810682_750361780948123598_n.jpg","sort_order":7},
  {"path":"/images/history/472596113_1644476416144017_2816265135506099950_n.jpg","sort_order":8},
  {"path":"/images/history/472684894_1643943256197333_8817376945635694744_n.jpg","sort_order":9},
  {"path":"/images/history/472779477_1643750209549971_4852660761104952962_n.jpg","sort_order":10},
  {"path":"/images/history/when we first started with an interview.jpg","sort_order":11},
  {"path":"/images/history/484805464_1201043848408947_1782099523686643406_n.jpg","sort_order":12},
  {"path":"/images/history/484767834_1201043795075619_1990743517891773622_n.jpg","sort_order":13},
  {"path":"/images/history/482247163_1201043701742295_4815130360104201400_n.jpg","sort_order":14}
]$json$::jsonb) as x(path text, sort_order int)
where not exists (
  select 1 from gallery_images g where g.path = x.path
);
