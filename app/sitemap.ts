import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { OFFICES } from "@/constants/offices"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

/**
 * The sitemap, built from the routes that actually exist.
 *
 * There was none before, which for a site whose whole purpose is to be found by
 * the youth of 32 communities is the single cheapest SEO fix available: without
 * it, the dynamic community and role pages are discoverable only by crawling
 * links, and anything not linked from the homepage may never be indexed at all.
 *
 * Dynamic entries are read from the database rather than hard-coded, so a new
 * community or a published article appears in the sitemap without anyone
 * remembering to add it. A database failure degrades to the static routes rather
 * than failing the build — a sitemap missing its articles beats a deploy that
 * will not ship.
 *
 * Deliberately absent: everything under /dashboard and /auth. They are behind a
 * session, so a crawler reaching them gets a redirect, and listing them invites
 * exactly that wasted crawl budget. `robots.ts` disallows them as well.
 */

/** Static public routes, with the priority ordering an editor would choose. */
const STATIC_ROUTES: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}> = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leadership", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leadership/roles", priority: 0.8, changeFrequency: "monthly" },
  { path: "/leadership/apply", priority: 0.9, changeFrequency: "monthly" },
  { path: "/communities", priority: 0.8, changeFrequency: "monthly" },
  { path: "/parliament", priority: 0.7, changeFrequency: "weekly" },
  { path: "/cin", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.7, changeFrequency: "weekly" },
  { path: "/sdgs", priority: 0.6, changeFrequency: "yearly" },
  { path: "/representation", priority: 0.6, changeFrequency: "monthly" },
  { path: "/transparency", priority: 0.6, changeFrequency: "monthly" },
  { path: "/events", priority: 0.7, changeFrequency: "weekly" },
  { path: "/news", priority: 0.7, changeFrequency: "weekly" },
  { path: "/gallery", priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const entries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // Office pages are generated from OFFICES, not from the database —
  // `cabinet_positions` has no `slug` column, and `generateStaticParams` in
  // app/(public)/leadership/roles/[slug] already builds these 19 routes from the
  // constant. Querying the table for a slug it does not have would throw, and
  // the catch below would have swallowed it and silently dropped every dynamic
  // entry, communities and articles included.
  for (const office of OFFICES) {
    entries.push({
      url: `${SITE_URL}/leadership/roles/${office.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    })
  }

  if (!isSupabaseConfigured()) return entries

  try {
    const supabase = await createClient()
    const [communities, posts] = await Promise.all([
      supabase.from("communities").select("slug").order("name"),
      supabase
        .from("posts")
        .select("slug, updated_at, published_at")
        .eq("status", "published"),
    ])

    for (const c of communities.data ?? []) {
      if (c.slug) {
        entries.push({
          url: `${SITE_URL}/communities/${c.slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.6,
        })
      }
    }

    for (const p of posts.data ?? []) {
      if (p.slug) {
        entries.push({
          url: `${SITE_URL}/news/${p.slug}`,
          // A real article date, so a crawler can tell a corrected post from an
          // untouched one instead of seeing everything change on every build.
          lastModified: new Date(p.updated_at ?? p.published_at ?? now),
          changeFrequency: "yearly",
          priority: 0.5,
        })
      }
    }
  } catch {
    // Static routes are better than no sitemap; never fail the build for this.
  }

  return entries
}
