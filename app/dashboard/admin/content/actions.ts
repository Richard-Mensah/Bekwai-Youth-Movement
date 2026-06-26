"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { audit, slugify, NOT_READY, type ContentResult } from "@/lib/cms"
import { DEFAULT_SETTINGS } from "@/lib/data/content"
import { NEWS } from "@/constants/news"
import { LEADERSHIP_TIERS } from "@/constants/leadership"
import { GALLERY_PHOTOS } from "@/constants/gallery"

/**
 * One-time, idempotent import of the site's current hardcoded content into the
 * CMS tables. Only seeds a table that is currently empty, so it is safe to run
 * more than once.
 */
export async function importStarterContent(): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()

  async function isEmpty(table: string) {
    const { count } = await supabase
      .from(table)
      .select("*", { count: "exact", head: true })
    return (count ?? 0) === 0
  }

  let seeded = 0

  // Posts ← NEWS
  if (await isEmpty("posts")) {
    const rows = NEWS.map((n) => ({
      slug: slugify(n.title),
      title: n.title,
      excerpt: n.summary,
      body: n.summary,
      external_url: n.href,
      tags: (n.sdg ?? []).map((s) => `SDG ${s}`),
      status: "published",
      published_at: n.date,
    }))
    const { error } = await supabase.from("posts").insert(rows)
    if (error) return { ok: false, error: `Posts: ${error.message}` }
    seeded += rows.length
  }

  // Leaders ← LEADERSHIP_TIERS
  if (await isEmpty("leaders")) {
    const rows = LEADERSHIP_TIERS.flatMap((t) =>
      t.members.map((m, i) => ({
        tier: t.id,
        title: m.title,
        name: m.name ?? null,
        blurb: m.blurb ?? null,
        uk_equivalent: m.ukEquivalent ?? null,
        sdg: m.sdg ?? [],
        sort_order: i,
        is_published: true,
      }))
    )
    const { error } = await supabase.from("leaders").insert(rows)
    if (error) return { ok: false, error: `Leaders: ${error.message}` }
    seeded += rows.length
  }

  // Gallery ← GALLERY_PHOTOS
  if (await isEmpty("gallery_images")) {
    const rows = GALLERY_PHOTOS.map((p) => ({
      path: p.path,
      caption: p.caption,
      sort_order: p.sortOrder,
    }))
    const { error } = await supabase.from("gallery_images").insert(rows)
    if (error) return { ok: false, error: `Gallery: ${error.message}` }
    seeded += rows.length
  }

  // Events ← Founding Day
  if (await isEmpty("events")) {
    const { error } = await supabase.from("events").insert({
      slug: "founding-day",
      title: "Official Launch — Founding Day of the Youth General Assembly",
      description:
        "The founding public ceremony of the BYM Youth General Assembly — the Cabinet, Parliament, Council Representatives, and CIN Officers are formally inaugurated.",
      location: "Sefwi Bekwai, Western North Region, Ghana",
      starts_at: "2027-01-12T08:30:00Z",
      is_published: true,
    })
    if (error) return { ok: false, error: `Events: ${error.message}` }
    seeded += 1
  }

  // Site settings ← defaults
  const { error: sErr } = await supabase
    .from("site_settings")
    .upsert({ key: "site", value: DEFAULT_SETTINGS }, { onConflict: "key" })
  if (sErr) return { ok: false, error: `Settings: ${sErr.message}` }

  await audit("content", null, "import", `Seeded ${seeded} record(s)`)
  revalidatePath("/dashboard/admin/content")
  revalidatePath("/")
  return { ok: true, error: seeded === 0 ? "Content already present — nothing to import." : undefined }
}
