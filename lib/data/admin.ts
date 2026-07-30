import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { createAdminClient, adminClientReady } from "@/lib/supabase/admin"

export type MemberStats = {
  configured: boolean
  total: number
  pending: number
  verified: number
}

/**
 * Live member counts for the admin overview. Returns zeros in demo mode
 * (Supabase not configured) so the dashboard still renders.
 */
export async function getMemberStats(): Promise<MemberStats> {
  if (!isSupabaseConfigured()) {
    return { configured: false, total: 0, pending: 0, verified: 0 }
  }

  const supabase = await createClient()

  const counts = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "verified"),
  ])

  const [total, pending, verified] = counts.map((r) => r.count ?? 0)
  return { configured: true, total, pending, verified }
}

export type Member = {
  id: string
  fullName: string
  email: string | null
  phone: string | null
  membershipId: string | null
  status: string
  isPublic: boolean
  communityName: string | null
  createdAt: string
}

/**
 * All registered members (profiles), newest first. Admin RLS lets admins
 * read every profile. Returns [] in demo mode. Selects `is_public`, which
 * exists after migration 0014.
 */
export async function getMembers(): Promise<Member[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select(
      "id, full_name, email, phone, membership_id, verification_status, is_public, created_at, communities(name)"
    )
    .order("created_at", { ascending: false })
    .limit(1000)
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    fullName: (r.full_name as string) ?? "",
    email: (r.email as string) ?? null,
    phone: (r.phone as string) ?? null,
    membershipId: (r.membership_id as string) ?? null,
    status: (r.verification_status as string) ?? "pending",
    isPublic: Boolean(r.is_public ?? true),
    communityName: (r.communities as { name?: string } | null)?.name ?? null,
    createdAt: r.created_at as string,
  }))
}

/**
 * What the login system knows about a member, which `profiles` cannot say.
 *
 * `confirmed` is whether the email address has been proven; `everSignedIn` is
 * whether they have ever actually got in. The second is the one that matters and
 * the one nothing in this console used to show — of the first ten members, six
 * were confirmed and had still never signed in, and the only way to discover
 * that was to query `auth.users` by hand. A registration that never becomes a
 * sign-in is the failure mode of a drive, so it belongs on screen.
 */
export type MemberAuthState = {
  confirmed: boolean
  everSignedIn: boolean
}

/**
 * Login state for every member, keyed by user id.
 *
 * Needs the service-role client: `auth.users` is not exposed to RLS at all, so
 * the member's own session cannot read it however the policies are written. When
 * the key is absent this returns an empty map and callers simply show less —
 * a missing key must not take the members directory down with it.
 */
export async function getMemberAuthStates(): Promise<Map<string, MemberAuthState>> {
  const states = new Map<string, MemberAuthState>()
  if (!isSupabaseConfigured() || !adminClientReady()) return states

  try {
    const admin = createAdminClient()
    // Paginated deliberately: listUsers caps the page size, so a drive that adds
    // a few hundred members would silently show only the first page of results.
    for (let page = 1; page <= 20; page++) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
      if (error) break
      for (const u of data.users) {
        states.set(u.id, {
          confirmed: Boolean(u.email_confirmed_at ?? u.confirmed_at),
          everSignedIn: Boolean(u.last_sign_in_at),
        })
      }
      if (data.users.length < 200) break
    }
  } catch {
    // Reporting login state is a nicety; the directory itself is not.
  }

  return states
}

export type ContactMessage = {
  id: string
  name: string
  email: string
  topic: string | null
  message: string
  status: string
  createdAt: string
}

export type Subscriber = {
  id: string
  email: string
  source: string
  createdAt: string
}

/**
 * Contact-form enquiries, newest first. Returns [] in demo mode or if the
 * table hasn't been created yet (migration 0012 not applied).
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("contact_messages")
    .select("id, name, email, topic, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(200)
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    topic: r.topic,
    message: r.message,
    status: r.status ?? "new",
    createdAt: r.created_at,
  }))
}

export type LeadershipApplication = {
  id: string
  fullName: string
  email: string
  phone: string | null
  community: string | null
  age: number | null
  gender: string | null
  roleArm: string | null
  roleApplied: string
  altRole: string | null
  occupation: string | null
  qualifications: string | null
  experience: string | null
  motivation: string
  availability: string | null
  refereeName: string | null
  refereeContact: string | null
  vettingPref: string | null
  cvUrl: string | null
  membershipId: string | null
  status: string
  createdAt: string
  /** Catalogue slug, for linking to the role page. Null for legacy rows. */
  roleSlug: string | null
  submittedAt: string | null
  reviewerNotes: string | null
  score: number | null
}

/**
 * Leadership-role applications, newest first. Returns [] in demo mode or if
 * the table hasn't been created yet (migration 0016 not applied). CV paths are
 * resolved to short-lived signed download URLs (private bucket, admin-only).
 */
export async function getLeadershipApplications(): Promise<
  LeadershipApplication[]
> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("leadership_applications")
    .select(
      "id, full_name, email, phone, community, age, gender, role_arm, role_applied, role_slug, alt_role, occupation, qualifications, experience, motivation, availability, referee_name, referee_contact, vetting_pref, cv_path, membership_id, status, reviewer_notes, score, submitted_at, created_at"
    )
    // Drafts belong to the applicant and are not part of the pipeline.
    .neq("status", "draft")
    .order("created_at", { ascending: false })
    .limit(500)

  const rows = data ?? []

  // Sign CV download links for rows that have one (1-hour expiry).
  const paths = rows.map((r) => r.cv_path).filter(Boolean) as string[]
  const signed = new Map<string, string>()
  if (paths.length > 0) {
    const { data: urls } = await supabase.storage
      .from("applications")
      .createSignedUrls(paths, 60 * 60)
    for (const u of urls ?? []) {
      if (u.path && u.signedUrl) signed.set(u.path, u.signedUrl)
    }
  }

  return rows.map((r) => ({
    id: r.id,
    fullName: r.full_name ?? "",
    email: r.email ?? "",
    phone: r.phone,
    community: r.community,
    age: r.age,
    gender: r.gender,
    roleArm: r.role_arm,
    roleApplied: r.role_applied ?? "",
    altRole: r.alt_role,
    occupation: r.occupation,
    qualifications: r.qualifications,
    experience: r.experience,
    motivation: r.motivation ?? "",
    availability: r.availability,
    refereeName: r.referee_name,
    refereeContact: r.referee_contact,
    vettingPref: r.vetting_pref,
    cvUrl: r.cv_path ? signed.get(r.cv_path) ?? null : null,
    membershipId: r.membership_id,
    status: r.status ?? "submitted",
    createdAt: r.created_at,
    roleSlug: r.role_slug ?? null,
    submittedAt: r.submitted_at ?? r.created_at,
    reviewerNotes: r.reviewer_notes ?? null,
    score: r.score ?? null,
  }))
}

/**
 * Newsletter subscribers, newest first. Returns [] in demo mode or if the
 * table hasn't been created yet (migration 0011 not applied).
 */
export type Broadcast = {
  id: string
  subject: string
  status: string
  recipientCount: number
  sentAt: string | null
  createdAt: string
}

export async function getBroadcasts(): Promise<Broadcast[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("newsletter_broadcasts")
    .select("id, subject, status, recipient_count, sent_at, created_at")
    .order("created_at", { ascending: false })
    .limit(50)
  return (data ?? []).map((r) => ({
    id: r.id,
    subject: r.subject,
    status: r.status,
    recipientCount: r.recipient_count ?? 0,
    sentAt: r.sent_at,
    createdAt: r.created_at,
  }))
}

export async function getSubscribers(): Promise<Subscriber[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false })
    .limit(500)
  return (data ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    source: r.source,
    createdAt: r.created_at,
  }))
}
