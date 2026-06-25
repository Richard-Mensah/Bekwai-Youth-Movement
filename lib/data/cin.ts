import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { COMMUNITIES } from "@/constants/communities"
import { CIN_CATEGORIES, SEVERITIES } from "@/constants/cin"
import type { Severity, CinStatus } from "@/types"

export interface CinReportRow {
  id: string
  category: string
  severity: Severity
  description: string
  status: CinStatus
  communityId: number
  communityName: string
  reportedAt: string
}

export interface CinStats {
  filed: number
  open: number
  resolved: number
  escalated: number
}

export interface CommunityScore {
  communityId: number
  communityName: string
  score: number
  open: number
}

const SEV_WEIGHT = Object.fromEntries(SEVERITIES.map((s) => [s.value, s.weight]))

// ---- Deterministic demo data (used until Supabase is connected) ----
function rand(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

function demoReports(): CinReportRow[] {
  const statuses: CinStatus[] = ["open", "resolved", "escalated"]
  const sevs: Severity[] = ["low", "medium", "high", "critical"]
  const rows: CinReportRow[] = []
  COMMUNITIES.forEach((c) => {
    const n = Math.floor(rand(c.id) * 4) // 0–3 reports per community
    for (let i = 0; i < n; i++) {
      const r = rand(c.id * 10 + i)
      const month = 1 + Math.floor(rand(c.id + i) * 6)
      rows.push({
        id: `demo-${c.id}-${i}`,
        category: CIN_CATEGORIES[Math.floor(r * CIN_CATEGORIES.length)],
        severity: sevs[Math.floor(rand(c.id * 3 + i) * sevs.length)],
        description: "Sample community report (demo data).",
        status: statuses[Math.floor(rand(c.id * 7 + i) * statuses.length)],
        communityId: c.id,
        communityName: c.name,
        reportedAt: `2026-${String(month).padStart(2, "0")}-15`,
      })
    }
  })
  return rows
}

async function liveReports(officerId?: string): Promise<CinReportRow[]> {
  const supabase = await createClient()
  let query = supabase
    .from("cin_reports")
    .select("id, category, severity, description, status, community_id, reported_at, communities(name)")
    .order("reported_at", { ascending: false })
  if (officerId) query = query.eq("officer_id", officerId)
  const { data } = await query
  return (data ?? []).map((r: Record<string, unknown>) => ({
    id: r.id as string,
    category: r.category as string,
    severity: r.severity as Severity,
    description: r.description as string,
    status: r.status as CinStatus,
    communityId: r.community_id as number,
    communityName:
      (r.communities as { name?: string } | null)?.name ?? "—",
    reportedAt: (r.reported_at as string) ?? "",
  }))
}

export async function getReports(officerId?: string): Promise<CinReportRow[]> {
  if (!isSupabaseConfigured()) {
    const all = demoReports()
    return all
  }
  return liveReports(officerId)
}

export function computeStats(rows: CinReportRow[]): CinStats {
  return {
    filed: rows.length,
    open: rows.filter((r) => r.status === "open").length,
    resolved: rows.filter((r) => r.status === "resolved").length,
    escalated: rows.filter((r) => r.status === "escalated").length,
  }
}

export function communityScores(rows: CinReportRow[]): CommunityScore[] {
  return COMMUNITIES.map((c) => {
    const open = rows.filter(
      (r) => r.communityId === c.id && r.status !== "resolved"
    )
    const penalty = open.reduce((sum, r) => sum + (SEV_WEIGHT[r.severity] ?? 1), 0)
    const score = Math.max(20, Math.min(100, 100 - penalty * 6))
    return { communityId: c.id, communityName: c.name, score, open: open.length }
  })
}

export function categoryCounts(rows: CinReportRow[]) {
  return CIN_CATEGORIES.map((cat) => ({
    category: cat,
    count: rows.filter((r) => r.category === cat).length,
  }))
}

export function severityCounts(rows: CinReportRow[]) {
  return SEVERITIES.map((s) => ({
    severity: s.value,
    label: s.label,
    count: rows.filter((r) => r.severity === s.value).length,
  }))
}

export function monthlyTrend(rows: CinReportRow[]) {
  const months = ["2026-01", "2026-02", "2026-03", "2026-04", "2026-05", "2026-06"]
  return months.map((m) => ({
    month: m.slice(5),
    reports: rows.filter((r) => r.reportedAt.startsWith(m)).length,
  }))
}
