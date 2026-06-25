"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export type ActionResult = { ok: boolean; error?: string }

const NOT_READY: ActionResult = {
  ok: false,
  error: "Connect Supabase to manage publishing.",
}

const PUBLISHABLE = [
  "published_budgets",
  "community_scorecards",
  "public_reports",
  "annual_reports",
] as const
type PublishableTable = (typeof PUBLISHABLE)[number]

export async function togglePublish(
  table: PublishableTable,
  id: string,
  next: boolean
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  if (!PUBLISHABLE.includes(table)) return { ok: false, error: "Invalid record." }
  const supabase = await createClient()
  const { error } = await supabase
    .from(table)
    .update({ is_published: next })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/transparency")
  revalidatePath("/transparency")
  return { ok: true }
}

export async function createPublicReport(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const title = String(formData.get("title") ?? "").trim()
  const summary = String(formData.get("summary") ?? "").trim()
  if (title.length < 4) return { ok: false, error: "Enter a report title." }
  const supabase = await createClient()
  const { error } = await supabase
    .from("public_reports")
    .insert({ title, summary, is_published: false })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/transparency")
  return { ok: true }
}

export async function createAnnualReport(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const title = String(formData.get("title") ?? "").trim()
  const year = Number(formData.get("year"))
  if (title.length < 4 || !year) return { ok: false, error: "Enter a title and year." }
  const supabase = await createClient()
  const { error } = await supabase
    .from("annual_reports")
    .insert({ title, year, is_published: false })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/transparency")
  return { ok: true }
}

export async function createBudget(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const title = String(formData.get("title") ?? "").trim()
  const fiscalYear = Number(formData.get("fiscalYear"))
  const income = Number(formData.get("income") ?? 0)
  const expenditure = Number(formData.get("expenditure") ?? 0)
  if (title.length < 3 || !fiscalYear) return { ok: false, error: "Enter a title and fiscal year." }
  const supabase = await createClient()
  const { error } = await supabase.from("published_budgets").insert({
    title,
    fiscal_year: fiscalYear,
    income_ghs: income,
    expenditure_ghs: expenditure,
    is_published: false,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/transparency")
  return { ok: true }
}
