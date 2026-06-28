"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage } from "@/lib/storage"
import { projectSchema, expenditureSchema } from "@/lib/validations"
import { nextProjectStatus } from "@/constants/projects"
import type { ProjectStatus } from "@/types"

export type ActionResult = { ok: boolean; error?: string }

const NOT_READY: ActionResult = {
  ok: false,
  error: "Connect Supabase to manage projects.",
}

async function userOrError() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const parsed = projectSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    communityId: formData.get("communityId"),
    unitId: formData.get("unitId") || undefined,
    budgetGhs: formData.get("budgetGhs") || 0,
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message }

  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }

  const cover = await uploadImage(formData.get("cover") as File | null, "projects")
  if (cover.error) return { ok: false, error: cover.error }

  const { error } = await supabase.from("projects").insert({
    name: parsed.data.name,
    description: parsed.data.description,
    community_id: parsed.data.communityId,
    unit_id: parsed.data.unitId ?? null,
    budget_ghs: parsed.data.budgetGhs,
    cover_path: cover.path ?? null,
    lead_id: user.id,
    status: "proposed",
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/cabinet")
  revalidatePath("/projects")
  revalidatePath("/")
  return { ok: true }
}

/** Sets/replaces a project's cover image. */
export async function updateProjectImage(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const projectId = String(formData.get("projectId") ?? "")
  if (!projectId) return { ok: false, error: "Missing project." }

  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }

  const cover = await uploadImage(formData.get("cover") as File | null, "projects")
  if (cover.error) return { ok: false, error: cover.error }
  if (!cover.path) return { ok: false, error: "Choose an image to upload." }

  const { error } = await supabase
    .from("projects")
    .update({ cover_path: cover.path, updated_at: new Date().toISOString() })
    .eq("id", projectId)
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/dashboard/cabinet/projects/${projectId}`)
  revalidatePath("/projects")
  revalidatePath("/")
  return { ok: true }
}

export async function advanceProjectStatus(
  projectId: string,
  current: ProjectStatus
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const next = nextProjectStatus(current)
  if (!next) return { ok: false, error: "Project is already completed." }
  return setProjectStatus(projectId, next)
}

export async function setProjectStatus(
  projectId: string,
  status: ProjectStatus
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }
  const { error } = await supabase
    .from("projects")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", projectId)
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/dashboard/cabinet/projects/${projectId}`)
  revalidatePath("/dashboard/cabinet")
  return { ok: true }
}

export async function recordExpenditure(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const parsed = expenditureSchema.safeParse({
    projectId: formData.get("projectId"),
    amountGhs: formData.get("amountGhs"),
    payee: formData.get("payee"),
    purpose: formData.get("purpose"),
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message }

  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }
  const { error } = await supabase.from("expenditures").insert({
    project_id: parsed.data.projectId,
    amount_ghs: parsed.data.amountGhs,
    payee: parsed.data.payee,
    purpose: parsed.data.purpose,
    approved_by: user.id,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/dashboard/cabinet/projects/${parsed.data.projectId}`)
  return { ok: true }
}
