import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { COMMUNITIES } from "@/constants/communities"
import type { SeatType } from "@/types"
import type { NominationStage } from "@/constants/governance"

export interface NominationRow {
  id: string
  fullName: string
  communityName: string
  seatType: SeatType
  stage: NominationStage
}
export interface CommunitySeats {
  communityId: number
  communityName: string
  hasMp: boolean
  hasCouncil: boolean
  hasCin: boolean
}
export interface TenureRow {
  id: string
  fullName: string
  positionTitle: string
  termStart: string | null
  termEnd: string | null
  expired: boolean
  expiringSoon: boolean
}
export interface EndorsementRow {
  id: string
  subjectType: string
  subjectLabel: string
  decision: string
}
export interface EngagementRow {
  id: string
  communityName: string
  kind: string
  summary: string | null
  occurredOn: string
}

function rand(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

// ---- Feature 1: Nominations & vetting ----------------------
const DEMO_NOMS: NominationRow[] = [
  { id: "n1", fullName: "Ama Owusu", communityName: "Sefwi Bekwai", seatType: "cin_officer", stage: "vetting" },
  { id: "n2", fullName: "Kwesi Mensah", communityName: "Sub-Community 03", seatType: "mp", stage: "nominated" },
  { id: "n3", fullName: "Adwoa Boateng", communityName: "Sub-Community 07", seatType: "council_rep", stage: "interview" },
  { id: "n4", fullName: "Yaw Antwi", communityName: "Sub-Community 11", seatType: "cin_officer", stage: "residency_check" },
  { id: "n5", fullName: "Akua Sarpong", communityName: "Sefwi Bekwai", seatType: "mp", stage: "appointed" },
  { id: "n6", fullName: "Kofi Asare", communityName: "Sub-Community 18", seatType: "council_rep", stage: "nominated" },
]

export async function getNominations(): Promise<NominationRow[]> {
  if (!isSupabaseConfigured()) return DEMO_NOMS
  const supabase = await createClient()
  const { data } = await supabase
    .from("nominations")
    .select("id, full_name, seat_type, stage, communities(name)")
    .order("created_at", { ascending: false })
  return (data ?? []).map((n: Record<string, unknown>) => ({
    id: n.id as string,
    fullName: n.full_name as string,
    communityName: (n.communities as { name?: string } | null)?.name ?? "—",
    seatType: n.seat_type as SeatType,
    stage: n.stage as NominationStage,
  }))
}

// ---- Feature 2: Representation gaps ------------------------
export async function getRepresentationGaps(): Promise<CommunitySeats[]> {
  if (!isSupabaseConfigured()) {
    return COMMUNITIES.map((c) => ({
      communityId: c.id,
      communityName: c.name,
      hasMp: rand(c.id) > 0.35,
      hasCouncil: rand(c.id * 2) > 0.3,
      hasCin: rand(c.id * 3) > 0.4,
    }))
  }
  const supabase = await createClient()
  const { data } = await supabase
    .from("representation_gaps")
    .select("community_id, community_name, has_mp, has_council_rep, has_cin_officer")
  return (data ?? []).map((r) => ({
    communityId: r.community_id,
    communityName: r.community_name,
    hasMp: !!r.has_mp,
    hasCouncil: !!r.has_council_rep,
    hasCin: !!r.has_cin_officer,
  }))
}

// ---- Feature 3: Gender compliance --------------------------
export async function getGenderCompliance() {
  const demo = [
    { arm: "Cabinet", female: 42 },
    { arm: "Council", female: 38 },
    { arm: "Parliament", female: 45 },
    { arm: "CIN", female: 33 },
  ]
  if (!isSupabaseConfigured()) return demo
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("role, gender")
    .eq("verification_status", "verified")
  if (!data || data.length === 0) return demo
  const arm = (role: string) =>
    role === "secretary" ? "Cabinet" : role === "mp" ? "Parliament" : role === "cin_officer" ? "CIN" : "Council"
  const buckets: Record<string, { f: number; t: number }> = {}
  for (const p of data) {
    const a = arm(p.role)
    buckets[a] ??= { f: 0, t: 0 }
    buckets[a].t++
    if (p.gender === "female") buckets[a].f++
  }
  return ["Cabinet", "Council", "Parliament", "CIN"].map((a) => ({
    arm: a,
    female: buckets[a]?.t ? Math.round((buckets[a].f / buckets[a].t) * 100) : 0,
  }))
}

// ---- Feature 5: Tenure registry ----------------------------
const DEMO_TENURE: TenureRow[] = [
  { id: "t1", fullName: "Owusu Philip", positionTitle: "Director-General (DG)", termStart: "2026-01-12", termEnd: "2028-01-12", expired: false, expiringSoon: false },
  { id: "t2", fullName: "Owusu Nyame Janet", positionTitle: "1st Deputy Director-General", termStart: "2026-01-12", termEnd: "2026-07-31", expired: false, expiringSoon: true },
  { id: "t3", fullName: "Kofi Richard", positionTitle: "Secretary for Communications", termStart: "2024-01-12", termEnd: "2026-01-12", expired: true, expiringSoon: false },
]

export async function getTenure(): Promise<TenureRow[]> {
  if (!isSupabaseConfigured()) return DEMO_TENURE
  const supabase = await createClient()
  const { data } = await supabase
    .from("tenure_status")
    .select("id, full_name, position_title, term_start, term_end, term_expired, term_expiring_soon")
  return (data ?? []).map((t) => ({
    id: t.id, fullName: t.full_name, positionTitle: t.position_title ?? "—",
    termStart: t.term_start, termEnd: t.term_end,
    expired: !!t.term_expired, expiringSoon: !!t.term_expiring_soon,
  }))
}

export async function getTenureById(id: string): Promise<TenureRow | null> {
  const all = await getTenure()
  return all.find((t) => t.id === id) ?? null
}

// ---- Feature 4: TAC endorsements & engagements -------------
const DEMO_ENDORSE: EndorsementRow[] = [
  { id: "en1", subjectType: "nomination", subjectLabel: "Akua Sarpong — Youth MP (Sefwi Bekwai)", decision: "pending" },
  { id: "en2", subjectType: "project", subjectLabel: "Community Borehole Rehabilitation", decision: "pending" },
]
const DEMO_ENGAGE: EngagementRow[] = [
  { id: "g1", communityName: "Sefwi Bekwai", kind: "courtesy_call", summary: "Formal courtesy call on the Paramount Chief.", occurredOn: "2026-06-10" },
  { id: "g2", communityName: "Sub-Community 03", kind: "sensitisation", summary: "Community sensitisation with sub-chief's blessing.", occurredOn: "2026-06-15" },
]

export async function getEndorsements(): Promise<EndorsementRow[]> {
  if (!isSupabaseConfigured()) return DEMO_ENDORSE
  const supabase = await createClient()
  const { data } = await supabase
    .from("endorsements")
    .select("id, subject_type, decision")
    .order("decided_at", { ascending: true, nullsFirst: true })
  return (data ?? []).map((e) => ({
    id: e.id, subjectType: e.subject_type,
    subjectLabel: e.subject_type, decision: e.decision,
  }))
}

export async function getTacEngagements(): Promise<EngagementRow[]> {
  if (!isSupabaseConfigured()) return DEMO_ENGAGE
  const supabase = await createClient()
  const { data } = await supabase
    .from("tac_engagements")
    .select("id, kind, summary, occurred_on, communities(name)")
    .order("occurred_on", { ascending: false })
  return (data ?? []).map((g: Record<string, unknown>) => ({
    id: g.id as string,
    communityName: (g.communities as { name?: string } | null)?.name ?? "—",
    kind: g.kind as string,
    summary: g.summary as string | null,
    occurredOn: g.occurred_on as string,
  }))
}

export function gapStats(gaps: CommunitySeats[]) {
  const filled = (s: CommunitySeats) => Number(s.hasMp) + Number(s.hasCouncil) + Number(s.hasCin)
  const fully = gaps.filter((g) => filled(g) === 3).length
  const vacant = gaps.reduce((sum, g) => sum + (3 - filled(g)), 0)
  return { fully, vacant, total: gaps.length }
}
