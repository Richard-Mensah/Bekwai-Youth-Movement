import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { BillStatus } from "@/types"
import type { VoteChoice } from "@/constants/parliament"

export interface BillRow {
  id: string
  reference: string | null
  title: string
  summary: string | null
  status: BillStatus
  createdAt: string
}
export interface MotionRow {
  id: string
  title: string
  body: string | null
  status: string
  createdAt: string
}
export interface SessionRow {
  id: string
  name: string
  opensOn: string | null
  closesOn: string | null
}
export interface RecommendationRow {
  id: string
  title: string
  body: string | null
  status: string
}
export type VoteTally = Record<VoteChoice, number>

// ---- Demo data (used until Supabase is connected) ----------
const DEMO_BILLS: BillRow[] = [
  { id: "demo-bill-1", reference: "BYP/B/001", title: "Community Sanitation Standards Bill", summary: "Establishes minimum monthly clean-up obligations and waste points across all 32 communities.", status: "committee", createdAt: "2026-03-04" },
  { id: "demo-bill-2", reference: "BYP/B/002", title: "Youth Apprenticeship Support Bill", summary: "Creates a register of apprenticeship placements and a stipend framework for out-of-school youth.", status: "second_reading", createdAt: "2026-04-12" },
  { id: "demo-bill-3", reference: "BYP/B/003", title: "School Attendance Improvement Bill", summary: "Mandates community attendance monitoring and incentives to reduce dropout rates.", status: "first_reading", createdAt: "2026-05-09" },
  { id: "demo-bill-4", reference: "BYP/B/004", title: "Girls' Education Protection Bill", summary: "Protects the girl-child's right to education and sets a 40% participation target.", status: "passed", createdAt: "2026-02-18" },
  { id: "demo-bill-5", reference: "BYP/B/005", title: "Community Water Access Bill", summary: "Prioritises borehole rehabilitation in underserved sub-communities.", status: "draft", createdAt: "2026-06-01" },
  { id: "demo-bill-6", reference: "BYP/B/006", title: "Youth Climate Brigade Bill", summary: "Constitutes volunteer climate brigades for tree-planting and anti-bush-burning.", status: "third_reading", createdAt: "2026-05-22" },
]
const DEMO_MOTIONS: MotionRow[] = [
  { id: "m1", title: "Motion on market-day sanitation", body: "That Parliament urges weekly market clean-ups.", status: "debating", createdAt: "2026-05-30" },
  { id: "m2", title: "Motion on streetlight safety", body: "That Parliament calls for solar lights at key junctions.", status: "submitted", createdAt: "2026-06-08" },
]
const DEMO_SESSIONS: SessionRow[] = [
  { id: "s1", name: "First Session 2026", opensOn: "2026-02-01", closesOn: "2026-04-30" },
  { id: "s2", name: "Second Session 2026", opensOn: "2026-09-01", closesOn: "2026-11-30" },
]
const DEMO_RECS: RecommendationRow[] = [
  { id: "r1", title: "Establish a community library", body: "Forwarded to the Secretary for Education.", status: "forwarded" },
  { id: "r2", title: "Monthly youth health screening", body: "Forwarded to the Secretary for Health & Welfare.", status: "adopted" },
]

export async function getBills(): Promise<BillRow[]> {
  if (!isSupabaseConfigured()) return DEMO_BILLS
  const supabase = await createClient()
  const { data } = await supabase
    .from("bills")
    .select("id, reference, title, summary, status, created_at")
    .order("created_at", { ascending: false })
  return (data ?? []).map((b) => ({
    id: b.id, reference: b.reference, title: b.title, summary: b.summary,
    status: b.status as BillStatus, createdAt: b.created_at,
  }))
}

export async function getBillById(id: string): Promise<BillRow | null> {
  if (!isSupabaseConfigured()) return DEMO_BILLS.find((b) => b.id === id) ?? null
  const supabase = await createClient()
  const { data } = await supabase
    .from("bills")
    .select("id, reference, title, summary, status, created_at")
    .eq("id", id)
    .single()
  if (!data) return null
  return {
    id: data.id, reference: data.reference, title: data.title,
    summary: data.summary, status: data.status as BillStatus, createdAt: data.created_at,
  }
}

export async function getMotions(): Promise<MotionRow[]> {
  if (!isSupabaseConfigured()) return DEMO_MOTIONS
  const supabase = await createClient()
  const { data } = await supabase
    .from("motions").select("id, title, body, status, created_at")
    .order("created_at", { ascending: false })
  return (data ?? []).map((m) => ({
    id: m.id, title: m.title, body: m.body, status: m.status, createdAt: m.created_at,
  }))
}

export async function getSessions(): Promise<SessionRow[]> {
  if (!isSupabaseConfigured()) return DEMO_SESSIONS
  const supabase = await createClient()
  const { data } = await supabase
    .from("parliament_sessions").select("id, name, opens_on, closes_on")
    .order("opens_on", { ascending: false })
  return (data ?? []).map((s) => ({
    id: s.id, name: s.name, opensOn: s.opens_on, closesOn: s.closes_on,
  }))
}

export async function getRecommendations(): Promise<RecommendationRow[]> {
  if (!isSupabaseConfigured()) return DEMO_RECS
  const supabase = await createClient()
  const { data } = await supabase
    .from("youth_recommendations").select("id, title, body, status")
    .order("created_at", { ascending: false })
  return (data ?? []).map((r) => ({
    id: r.id, title: r.title, body: r.body, status: r.status,
  }))
}

export async function getVoteTally(billId: string): Promise<VoteTally> {
  const empty: VoteTally = { aye: 0, no: 0, abstain: 0 }
  if (!isSupabaseConfigured()) {
    // Deterministic demo tally per bill id.
    const seed = billId.length
    return { aye: 12 + seed, no: 4 + (seed % 3), abstain: 2 }
  }
  const supabase = await createClient()
  const { data } = await supabase.from("votes").select("choice").eq("bill_id", billId)
  for (const v of data ?? []) empty[v.choice as VoteChoice]++
  return empty
}

export function parliamentStats(bills: BillRow[], motions: MotionRow[]) {
  return {
    activeBills: bills.filter((b) => b.status !== "passed" && b.status !== "rejected").length,
    passed: bills.filter((b) => b.status === "passed").length,
    openMotions: motions.length,
  }
}
