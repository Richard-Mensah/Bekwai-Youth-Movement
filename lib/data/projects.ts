import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { publicUrl } from "@/lib/media"
import { PROJECT_STATUS_META } from "@/constants/projects"
import type { ProjectStatus } from "@/types"

export interface ProjectRow {
  id: string
  name: string
  description: string | null
  communityName: string
  unitName: string | null
  status: ProjectStatus
  budgetGhs: number
  spentGhs: number
  sdg: number[]
  coverUrl: string | null
  isPublished: boolean
}
export interface ExpenditureRow {
  id: string
  amountGhs: number
  payee: string | null
  purpose: string | null
  spentOn: string
}

// ---- Demo data ---------------------------------------------
const DEMO: Omit<ProjectRow, "coverUrl">[] = [
  { id: "demo-p-1", name: "Bekwai Market Sanitation Drive", description: "Weekly clean-ups and two new waste points at the central market.", communityName: "Sefwi Bekwai", unitName: "Environment, Sanitation & Climate Unit", status: "in_progress", budgetGhs: 18000, spentGhs: 9500, sdg: [6, 11], isPublished: true },
  { id: "demo-p-2", name: "Youth Apprenticeship Placements", description: "Placing 40 out-of-school youth into trade apprenticeships.", communityName: "Sub-Community 03", unitName: "Economic Empowerment & Employment Unit", status: "approved", budgetGhs: 25000, spentGhs: 0, sdg: [1, 8], isPublished: true },
  { id: "demo-p-3", name: "Community Borehole Rehabilitation", description: "Restoring three boreholes in underserved sub-communities.", communityName: "Sub-Community 11", unitName: "Environment, Sanitation & Climate Unit", status: "proposed", budgetGhs: 32000, spentGhs: 0, sdg: [6], isPublished: false },
  { id: "demo-p-4", name: "Girls' Education Scholarship", description: "Term scholarships for 20 girls at risk of dropping out.", communityName: "Sub-Community 07", unitName: "Education & Youth Development Unit", status: "completed", budgetGhs: 15000, spentGhs: 14200, sdg: [4, 5], isPublished: true },
  { id: "demo-p-5", name: "Mental Health Awareness Campaign", description: "School outreach on mental health across 8 communities.", communityName: "Sefwi Bekwai", unitName: "Health & Social Welfare Unit", status: "in_progress", budgetGhs: 12000, spentGhs: 5200, sdg: [3], isPublished: true },
  { id: "demo-p-6", name: "Tree-Planting Brigade", description: "Planting 2,000 seedlings with volunteer climate brigades.", communityName: "Sub-Community 18", unitName: "Environment, Sanitation & Climate Unit", status: "suspended", budgetGhs: 8000, spentGhs: 1500, sdg: [13, 15], isPublished: false },
]

export async function getProjects(): Promise<ProjectRow[]> {
  if (!isSupabaseConfigured()) return DEMO.map((p) => ({ ...p, coverUrl: null }))
  const supabase = await createClient()
  const [{ data: projects }, { data: exp }] = await Promise.all([
    supabase
      .from("projects")
      .select("id, name, description, status, budget_ghs, cover_path, is_published, communities(name), units(name)")
      .order("created_at", { ascending: false }),
    supabase.from("expenditures").select("project_id, amount_ghs"),
  ])
  const spent = new Map<string, number>()
  for (const e of exp ?? [])
    spent.set(e.project_id, (spent.get(e.project_id) ?? 0) + Number(e.amount_ghs))
  return (projects ?? []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    name: p.name as string,
    description: p.description as string | null,
    communityName: (p.communities as { name?: string } | null)?.name ?? "—",
    unitName: (p.units as { name?: string } | null)?.name ?? null,
    status: p.status as ProjectStatus,
    budgetGhs: Number(p.budget_ghs ?? 0),
    spentGhs: spent.get(p.id as string) ?? 0,
    sdg: [],
    coverUrl: publicUrl(p.cover_path as string) ?? null,
    isPublished: Boolean(p.is_published),
  }))
}

export async function getProjectById(id: string): Promise<ProjectRow | null> {
  const all = await getProjects()
  return all.find((p) => p.id === id) ?? null
}

export async function getExpenditures(projectId: string): Promise<ExpenditureRow[]> {
  if (!isSupabaseConfigured()) {
    return [
      { id: "e1", amountGhs: 4000, payee: "Local supplier", purpose: "Materials", spentOn: "2026-04-10" },
      { id: "e2", amountGhs: 5500, payee: "Transport", purpose: "Logistics", spentOn: "2026-05-02" },
    ]
  }
  const supabase = await createClient()
  const { data } = await supabase
    .from("expenditures")
    .select("id, amount_ghs, payee, purpose, spent_on")
    .eq("project_id", projectId)
    .order("spent_on", { ascending: false })
  return (data ?? []).map((e) => ({
    id: e.id, amountGhs: Number(e.amount_ghs), payee: e.payee,
    purpose: e.purpose, spentOn: e.spent_on,
  }))
}

export function projectStats(rows: ProjectRow[]) {
  const totalBudget = rows.reduce((s, p) => s + p.budgetGhs, 0)
  const totalSpent = rows.reduce((s, p) => s + p.spentGhs, 0)
  return {
    active: rows.filter((p) => p.status === "in_progress").length,
    pipeline: rows.filter((p) => p.status === "proposed" || p.status === "approved").length,
    completed: rows.filter((p) => p.status === "completed").length,
    totalBudget,
    totalSpent,
    utilization: totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0,
  }
}

export function budgetByStatus(rows: ProjectRow[]) {
  return PROJECT_FLOW_LABELS.map((s) => ({
    status: PROJECT_STATUS_META[s].label,
    budget: rows.filter((p) => p.status === s).reduce((x, p) => x + p.budgetGhs, 0),
    spent: rows.filter((p) => p.status === s).reduce((x, p) => x + p.spentGhs, 0),
  }))
}

const PROJECT_FLOW_LABELS: ProjectStatus[] = [
  "proposed",
  "approved",
  "in_progress",
  "completed",
  "suspended",
]
