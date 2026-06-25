import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { SDG_GOALS } from "@/constants/sdgs"
import { getProjects } from "@/lib/data/projects"

export interface BudgetRow {
  id: string
  fiscalYear: number
  title: string
  incomeGhs: number
  expenditureGhs: number
  isPublished: boolean
}
export interface ScorecardRow {
  id: string
  communityName: string
  period: string
  score: number | null
  isPublished: boolean
}
export interface ReportRow {
  id: string
  title: string
  summary: string | null
  isPublished: boolean
}
export interface AnnualRow {
  id: string
  year: number
  title: string
  isPublished: boolean
}

// ---- Demo data ---------------------------------------------
const DEMO_BUDGETS: BudgetRow[] = [
  { id: "b1", fiscalYear: 2026, title: "Q1 2026 Budget", incomeGhs: 42000, expenditureGhs: 31000, isPublished: true },
  { id: "b2", fiscalYear: 2026, title: "Q2 2026 Budget", incomeGhs: 38000, expenditureGhs: 22000, isPublished: true },
  { id: "b3", fiscalYear: 2026, title: "Q3 2026 Budget (draft)", incomeGhs: 0, expenditureGhs: 0, isPublished: false },
]
const DEMO_SCORECARDS: ScorecardRow[] = [
  { id: "s1", communityName: "Sefwi Bekwai", period: "H1 2026", score: 78, isPublished: true },
  { id: "s2", communityName: "Sub-Community 03", period: "H1 2026", score: 64, isPublished: true },
  { id: "s3", communityName: "Sub-Community 11", period: "H1 2026", score: 52, isPublished: true },
  { id: "s4", communityName: "Sub-Community 07", period: "H1 2026", score: 71, isPublished: true },
]
const DEMO_REPORTS: ReportRow[] = [
  { id: "r1", title: "State of the Community Report — H1 2026", summary: "Mid-year review of community indicators across 32 communities.", isPublished: true },
  { id: "r2", title: "Sanitation Drive Outcomes", summary: "Results from the market sanitation programme.", isPublished: true },
]
const DEMO_ANNUAL: AnnualRow[] = [
  { id: "a1", year: 2026, title: "BYM Annual & SDG Progress Report 2026", isPublished: false },
]

type Opts = { includeUnpublished?: boolean }

export async function getBudgets({ includeUnpublished }: Opts = {}): Promise<BudgetRow[]> {
  if (!isSupabaseConfigured())
    return includeUnpublished ? DEMO_BUDGETS : DEMO_BUDGETS.filter((b) => b.isPublished)
  const supabase = await createClient()
  let q = supabase.from("published_budgets").select("id, fiscal_year, title, income_ghs, expenditure_ghs, is_published").order("fiscal_year", { ascending: false })
  if (!includeUnpublished) q = q.eq("is_published", true)
  const { data } = await q
  return (data ?? []).map((b) => ({
    id: b.id, fiscalYear: b.fiscal_year, title: b.title,
    incomeGhs: Number(b.income_ghs ?? 0), expenditureGhs: Number(b.expenditure_ghs ?? 0),
    isPublished: b.is_published,
  }))
}

export async function getScorecards({ includeUnpublished }: Opts = {}): Promise<ScorecardRow[]> {
  if (!isSupabaseConfigured())
    return includeUnpublished ? DEMO_SCORECARDS : DEMO_SCORECARDS.filter((s) => s.isPublished)
  const supabase = await createClient()
  let q = supabase.from("community_scorecards").select("id, period, score, is_published, communities(name)").order("created_at", { ascending: false })
  if (!includeUnpublished) q = q.eq("is_published", true)
  const { data } = await q
  return (data ?? []).map((s: Record<string, unknown>) => ({
    id: s.id as string,
    communityName: (s.communities as { name?: string } | null)?.name ?? "—",
    period: s.period as string,
    score: s.score as number | null,
    isPublished: Boolean(s.is_published),
  }))
}

export async function getPublicReports({ includeUnpublished }: Opts = {}): Promise<ReportRow[]> {
  if (!isSupabaseConfigured())
    return includeUnpublished ? DEMO_REPORTS : DEMO_REPORTS.filter((r) => r.isPublished)
  const supabase = await createClient()
  let q = supabase.from("public_reports").select("id, title, summary, is_published").order("created_at", { ascending: false })
  if (!includeUnpublished) q = q.eq("is_published", true)
  const { data } = await q
  return (data ?? []).map((r) => ({
    id: r.id, title: r.title, summary: r.summary, isPublished: r.is_published,
  }))
}

export async function getAnnualReports({ includeUnpublished }: Opts = {}): Promise<AnnualRow[]> {
  if (!isSupabaseConfigured())
    return includeUnpublished ? DEMO_ANNUAL : DEMO_ANNUAL.filter((a) => a.isPublished)
  const supabase = await createClient()
  let q = supabase.from("annual_reports").select("id, year, title, is_published").order("year", { ascending: false })
  if (!includeUnpublished) q = q.eq("is_published", true)
  const { data } = await q
  return (data ?? []).map((a) => ({
    id: a.id, year: a.year, title: a.title, isPublished: a.is_published,
  }))
}

/** SDG progress = number of projects aligned to each goal. */
export async function getSdgProgress() {
  const projects = await getProjects()
  return SDG_GOALS.map((g) => ({
    goal: g.goal,
    title: g.title,
    color: g.color,
    projects: projects.filter((p) => p.sdg.includes(g.goal)).length,
  }))
}
