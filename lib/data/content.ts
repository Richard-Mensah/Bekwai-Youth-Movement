import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { publicUrl } from "@/lib/media"
import { slugify } from "@/lib/cms"
import { NEWS } from "@/constants/news"
import { LEADERSHIP_TIERS } from "@/constants/leadership"
import { GALLERY_PHOTOS } from "@/constants/gallery"
import { COMMUNITIES } from "@/constants/communities"
import { ORG } from "@/constants/nav"

// ---------- Types ----------
export type Post = {
  id: string
  slug: string
  title: string
  excerpt: string | null
  body: string | null
  coverUrl: string | null
  externalUrl: string | null
  tags: string[]
  status: "draft" | "published"
  publishedAt: string | null
  createdAt: string
}

export type LeaderItem = {
  id: string
  tier: string
  title: string
  name: string | null
  photoUrl: string | null
  blurb: string | null
  ukEquivalent: string | null
  sdg: number[]
  sortOrder: number
  isPublished: boolean
}

export type LeaderTierGroup = {
  id: string
  eyebrow: string
  title: string
  description: string
  members: LeaderItem[]
}

export type GalleryItem = { id: string; url: string; caption: string; sortOrder: number }

export type EventItem = {
  id: string
  slug: string
  title: string
  description: string | null
  location: string | null
  startsAt: string | null
  endsAt: string | null
  coverUrl: string | null
  isPublished: boolean
}

export type PartnerItem = {
  id: string
  name: string
  logoUrl: string | null
  url: string | null
  tier: string
  sortOrder: number
}

export type SiteSettings = {
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  foundingDate: string
  email: string
  medium: string
  stats: { communities: number; cabinet: number; reps: number; sdgs: number; women: number }
}

export const DEFAULT_SETTINGS: SiteSettings = {
  heroEyebrow: ORG.region,
  heroTitle: "Harnessing the potential of every young person in Sefwi Bekwai",
  heroSubtitle:
    "A non-political youth movement building structured governance, community intelligence, and volunteerism across 32 communities — aligned with the UN Sustainable Development Goals.",
  foundingDate: ORG.foundingDate,
  email: ORG.email,
  medium: ORG.medium,
  stats: { communities: 32, cabinet: 19, reps: 3, sdgs: 12, women: 40 },
}

// ---------- Fallback mappers ----------
function newsToPosts(): Post[] {
  return NEWS.map((n) => ({
    id: slugify(n.title),
    slug: slugify(n.title),
    title: n.title,
    excerpt: n.summary,
    body: n.summary,
    coverUrl: null,
    externalUrl: n.href,
    tags: (n.sdg ?? []).map((s) => `SDG ${s}`),
    status: "published" as const,
    publishedAt: n.date,
    createdAt: n.date,
  }))
}

function fallbackTiers(): LeaderTierGroup[] {
  return LEADERSHIP_TIERS.map((t) => ({
    id: t.id,
    eyebrow: t.eyebrow,
    title: t.title,
    description: t.description,
    members: t.members.map((m, i) => ({
      id: `${t.id}-${i}`,
      tier: t.id,
      title: m.title,
      name: m.name ?? null,
      photoUrl: publicUrl(m.photo) ?? null,
      blurb: m.blurb ?? null,
      ukEquivalent: m.ukEquivalent ?? null,
      sdg: m.sdg ?? [],
      sortOrder: i,
      isPublished: true,
    })),
  }))
}

/** Tier metadata (eyebrow/title/description), used to group DB leaders. */
const TIER_META = LEADERSHIP_TIERS.map((t) => ({
  id: t.id,
  eyebrow: t.eyebrow,
  title: t.title,
  description: t.description,
}))

// ---------- Reads (DB with fallback) ----------
export async function getPublishedPosts(limit?: number): Promise<Post[]> {
  if (!isSupabaseConfigured()) return limit ? newsToPosts().slice(0, limit) : newsToPosts()
  const supabase = await createClient()
  let q = supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
  if (limit) q = q.limit(limit)
  const { data } = await q
  if (!data || data.length === 0)
    return limit ? newsToPosts().slice(0, limit) : newsToPosts()
  return data.map(mapPost)
}

export async function getAllPosts(): Promise<Post[]> {
  if (!isSupabaseConfigured()) return newsToPosts()
  const supabase = await createClient()
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })
  return (data ?? []).map(mapPost)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fromFallback = () => newsToPosts().find((p) => p.slug === slug) ?? null
  if (!isSupabaseConfigured()) return fromFallback()
  const supabase = await createClient()
  const { data } = await supabase.from("posts").select("*").eq("slug", slug).single()
  return data ? mapPost(data) : fromFallback()
}

export async function getPostById(id: string): Promise<Post | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase.from("posts").select("*").eq("id", id).single()
  return data ? mapPost(data) : null
}

export async function getLeaderTiers(): Promise<LeaderTierGroup[]> {
  if (!isSupabaseConfigured()) return fallbackTiers()
  const supabase = await createClient()
  const { data } = await supabase
    .from("leaders")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
  if (!data || data.length === 0) return fallbackTiers()
  const members = data.map(mapLeader)
  return TIER_META.map((t) => ({
    ...t,
    members: members.filter((m) => m.tier === t.id),
  })).filter((t) => t.members.length > 0)
}

export async function getAllLeaders(): Promise<LeaderItem[]> {
  if (!isSupabaseConfigured()) return fallbackTiers().flatMap((t) => t.members)
  const supabase = await createClient()
  const { data } = await supabase
    .from("leaders")
    .select("*")
    .order("tier", { ascending: true })
    .order("sort_order", { ascending: true })
  return (data ?? []).map(mapLeader)
}

export async function getLeaderById(id: string): Promise<LeaderItem | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase.from("leaders").select("*").eq("id", id).single()
  return data ? mapLeader(data) : null
}

export async function getGallery(): Promise<GalleryItem[]> {
  const fallback: GalleryItem[] = GALLERY_PHOTOS.map((p, i) => ({
    id: String(i),
    url: p.path,
    caption: p.caption,
    sortOrder: i,
  }))
  if (!isSupabaseConfigured()) return fallback
  const supabase = await createClient()
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
  if (!data || data.length === 0) return fallback
  return data.map((r) => ({
    id: r.id,
    url: publicUrl(r.path) ?? "",
    caption: r.caption ?? "",
    sortOrder: r.sort_order,
  }))
}

export async function getAllGallery(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("gallery_images")
    .select("*")
    .order("sort_order", { ascending: true })
  return (data ?? []).map((r) => ({
    id: r.id,
    url: publicUrl(r.path) ?? "",
    caption: r.caption ?? "",
    sortOrder: r.sort_order,
  }))
}

export async function getPublishedEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured()) return fallbackEvents()
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("is_published", true)
    .order("starts_at", { ascending: true })
  if (!data || data.length === 0) return fallbackEvents()
  return data.map(mapEvent)
}

export async function getAllEvents(): Promise<EventItem[]> {
  if (!isSupabaseConfigured()) return fallbackEvents()
  const supabase = await createClient()
  const { data } = await supabase
    .from("events")
    .select("*")
    .order("starts_at", { ascending: true })
  return (data ?? []).map(mapEvent)
}

export async function getEventById(id: string): Promise<EventItem | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase.from("events").select("*").eq("id", id).single()
  return data ? mapEvent(data) : null
}

export async function getPartners(): Promise<PartnerItem[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("partners")
    .select("*")
    .eq("is_published", true)
    .order("sort_order", { ascending: true })
  return (data ?? []).map(mapPartner)
}

export async function getAllPartners(): Promise<PartnerItem[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true })
  return (data ?? []).map(mapPartner)
}

export async function getPartnerById(id: string): Promise<PartnerItem | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase.from("partners").select("*").eq("id", id).single()
  return data ? mapPartner(data) : null
}

export async function getSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS
  const supabase = await createClient()
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "site")
    .single()
  const stored = (data?.value ?? {}) as Partial<SiteSettings>
  return {
    ...DEFAULT_SETTINGS,
    ...stored,
    stats: { ...DEFAULT_SETTINGS.stats, ...(stored.stats ?? {}) },
  }
}

export type CommunityItem = { id: number; name: string; isTown: boolean }

export async function getCommunities(): Promise<CommunityItem[]> {
  const fallback = COMMUNITIES.map((c) => ({
    id: c.id,
    name: c.name,
    isTown: c.isTown,
  }))
  if (!isSupabaseConfigured()) return fallback
  const supabase = await createClient()
  const { data } = await supabase
    .from("communities")
    .select("id, name, is_town")
    .order("id", { ascending: true })
  if (!data || data.length === 0) return fallback
  return data.map((r) => ({ id: r.id, name: r.name, isTown: r.is_town }))
}

export type ContentCounts = {
  posts: number
  leaders: number
  gallery: number
  events: number
  partners: number
}

export async function getContentCounts(): Promise<ContentCounts> {
  const empty = { posts: 0, leaders: 0, gallery: 0, events: 0, partners: 0 }
  if (!isSupabaseConfigured()) return empty
  const supabase = await createClient()
  const tables = ["posts", "leaders", "gallery_images", "events", "partners"] as const
  const results = await Promise.all(
    tables.map((t) => supabase.from(t).select("*", { count: "exact", head: true }))
  )
  return {
    posts: results[0].count ?? 0,
    leaders: results[1].count ?? 0,
    gallery: results[2].count ?? 0,
    events: results[3].count ?? 0,
    partners: results[4].count ?? 0,
  }
}

// ---------- Row mappers ----------
function mapPost(r: Record<string, unknown>): Post {
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    excerpt: (r.excerpt as string) ?? null,
    body: (r.body as string) ?? null,
    coverUrl: publicUrl(r.cover_path as string) ?? null,
    externalUrl: (r.external_url as string) ?? null,
    tags: (r.tags as string[]) ?? [],
    status: (r.status as "draft" | "published") ?? "draft",
    publishedAt: (r.published_at as string) ?? null,
    createdAt: r.created_at as string,
  }
}

function mapLeader(r: Record<string, unknown>): LeaderItem {
  return {
    id: r.id as string,
    tier: r.tier as string,
    title: r.title as string,
    name: (r.name as string) ?? null,
    photoUrl: publicUrl(r.photo_path as string) ?? null,
    blurb: (r.blurb as string) ?? null,
    ukEquivalent: (r.uk_equivalent as string) ?? null,
    sdg: (r.sdg as number[]) ?? [],
    sortOrder: (r.sort_order as number) ?? 0,
    isPublished: (r.is_published as boolean) ?? true,
  }
}

function mapEvent(r: Record<string, unknown>): EventItem {
  return {
    id: r.id as string,
    slug: r.slug as string,
    title: r.title as string,
    description: (r.description as string) ?? null,
    location: (r.location as string) ?? null,
    startsAt: (r.starts_at as string) ?? null,
    endsAt: (r.ends_at as string) ?? null,
    coverUrl: publicUrl(r.cover_path as string) ?? null,
    isPublished: (r.is_published as boolean) ?? true,
  }
}

function mapPartner(r: Record<string, unknown>): PartnerItem {
  return {
    id: r.id as string,
    name: r.name as string,
    logoUrl: publicUrl(r.logo_path as string) ?? null,
    url: (r.url as string) ?? null,
    tier: (r.tier as string) ?? "partner",
    sortOrder: (r.sort_order as number) ?? 0,
  }
}

function fallbackEvents(): EventItem[] {
  return [
    {
      id: "founding-day",
      slug: "founding-day",
      title: "Official Launch — Founding Day of the Youth General Assembly",
      description:
        "The founding public ceremony of the BYM Youth General Assembly — the Cabinet, Parliament, Council Representatives, and CIN Officers are formally inaugurated.",
      location: "Sefwi Bekwai, Western North Region, Ghana",
      startsAt: "2027-01-12T08:30:00Z",
      endsAt: null,
      coverUrl: null,
      isPublished: true,
    },
  ]
}
