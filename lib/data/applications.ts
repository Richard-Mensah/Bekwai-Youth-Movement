import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { DOC_BUCKET } from "@/constants/applications"

/**
 * Read helpers for the applications portal. Every function is safe to call in
 * demo mode (Supabase not configured) and returns empty data rather than
 * throwing, matching the behaviour of `lib/data/admin.ts`.
 *
 * Access control is enforced by RLS (migration 0020), not here: an applicant
 * only ever sees their own rows, admins see everything.
 */

export type ApplicationRow = {
  id: string
  userId: string | null
  fullName: string
  email: string
  phone: string | null
  community: string | null
  age: number | null
  gender: string | null
  roleArm: string | null
  roleApplied: string
  roleSlug: string | null
  altRole: string | null
  altRoleSlug: string | null
  occupation: string | null
  qualifications: string | null
  experience: string | null
  motivation: string
  availability: string | null
  refereeName: string | null
  refereeContact: string | null
  vettingPref: string | null
  membershipId: string | null
  status: string
  currentStep: number
  consent: boolean
  reviewerNotes: string | null
  score: number | null
  submittedAt: string | null
  updatedAt: string | null
  createdAt: string
}

export type ApplicationEvent = {
  id: string
  fromStatus: string | null
  toStatus: string
  note: string | null
  createdAt: string
}

export type ApplicationDocument = {
  id: string
  kind: string
  path: string
  filename: string
  sizeBytes: number | null
  createdAt: string
  /** Signed for one hour; null if the link could not be minted. */
  url: string | null
}

const COLUMNS =
  "id, user_id, full_name, email, phone, community, age, gender, role_arm, " +
  "role_applied, role_slug, alt_role, alt_role_slug, occupation, qualifications, " +
  "experience, motivation, availability, referee_name, referee_contact, " +
  "vetting_pref, membership_id, status, current_step, consent, reviewer_notes, " +
  "score, submitted_at, updated_at, created_at"

function toApplication(r: any): ApplicationRow {
  return {
    id: r.id,
    userId: r.user_id ?? null,
    fullName: r.full_name ?? "",
    email: r.email ?? "",
    phone: r.phone ?? null,
    community: r.community ?? null,
    age: r.age ?? null,
    gender: r.gender ?? null,
    roleArm: r.role_arm ?? null,
    roleApplied: r.role_applied ?? "",
    roleSlug: r.role_slug ?? null,
    altRole: r.alt_role ?? null,
    altRoleSlug: r.alt_role_slug ?? null,
    occupation: r.occupation ?? null,
    qualifications: r.qualifications ?? null,
    experience: r.experience ?? null,
    motivation: r.motivation ?? "",
    availability: r.availability ?? null,
    refereeName: r.referee_name ?? null,
    refereeContact: r.referee_contact ?? null,
    vettingPref: r.vetting_pref ?? null,
    membershipId: r.membership_id ?? null,
    status: r.status ?? "draft",
    currentStep: r.current_step ?? 1,
    consent: Boolean(r.consent),
    reviewerNotes: r.reviewer_notes ?? null,
    score: r.score ?? null,
    submittedAt: r.submitted_at ?? null,
    updatedAt: r.updated_at ?? null,
    createdAt: r.created_at,
  }
}

/** Every application belonging to the signed-in user, newest first. */
export async function getMyApplications(): Promise<ApplicationRow[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("leadership_applications")
    .select(COLUMNS)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (data ?? []).map(toApplication)
}

/** A single application. RLS decides whether the caller may see it. */
export async function getApplication(
  id: string
): Promise<ApplicationRow | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase
    .from("leadership_applications")
    .select(COLUMNS)
    .eq("id", id)
    .maybeSingle()
  return data ? toApplication(data) : null
}

/** The applicant's open draft, if they have one. */
export async function getMyDraft(): Promise<ApplicationRow | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("leadership_applications")
    .select(COLUMNS)
    .eq("user_id", user.id)
    .eq("status", "draft")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  return data ? toApplication(data) : null
}

/** Stage-change timeline for one application, oldest first. */
export async function getApplicationEvents(
  applicationId: string
): Promise<ApplicationEvent[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("application_events")
    .select("id, from_status, to_status, note, created_at")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true })

  return (data ?? []).map((r) => ({
    id: r.id,
    fromStatus: r.from_status ?? null,
    toStatus: r.to_status,
    note: r.note ?? null,
    createdAt: r.created_at,
  }))
}

/** Documents attached to one application, each with a 1-hour signed URL. */
export async function getApplicationDocuments(
  applicationId: string
): Promise<ApplicationDocument[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("application_documents")
    .select("id, kind, path, filename, size_bytes, created_at")
    .eq("application_id", applicationId)
    .order("created_at", { ascending: true })

  const rows = data ?? []
  if (rows.length === 0) return []

  const signed = new Map<string, string>()
  const { data: urls } = await supabase.storage
    .from(DOC_BUCKET)
    .createSignedUrls(
      rows.map((r) => r.path),
      60 * 60
    )
  for (const u of urls ?? []) {
    if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl)
  }

  return rows.map((r) => ({
    id: r.id,
    kind: r.kind,
    path: r.path,
    filename: r.filename,
    sizeBytes: r.size_bytes ?? null,
    createdAt: r.created_at,
    url: signed.get(r.path) ?? null,
  }))
}

/**
 * How many applications have been submitted per office, for the admin
 * coverage panel and the "N people have applied" hint on role cards.
 * Drafts are excluded — an unfinished draft is not interest yet.
 */
export async function getApplicationCountsByRole(): Promise<
  Record<string, number>
> {
  if (!isSupabaseConfigured()) return {}
  const supabase = await createClient()
  const { data } = await supabase
    .from("leadership_applications")
    .select("role_applied")
    .neq("status", "draft")
    .limit(2000)

  const counts: Record<string, number> = {}
  for (const r of data ?? []) {
    const key = r.role_applied as string | null
    if (key) counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}
