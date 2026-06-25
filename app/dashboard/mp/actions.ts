"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { billSchema, motionSchema, recommendationSchema } from "@/lib/validations"
import { nextStage } from "@/constants/parliament"
import type { BillStatus } from "@/types"
import type { VoteChoice } from "@/constants/parliament"

export type ActionResult = { ok: boolean; error?: string }

const NOT_READY: ActionResult = {
  ok: false,
  error: "Connect Supabase to use Parliament features.",
}

async function userOrError() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function createBill(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const parsed = billSchema.safeParse({
    title: formData.get("title"),
    summary: formData.get("summary"),
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message }

  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }
  const { error } = await supabase.from("bills").insert({
    title: parsed.data.title,
    summary: parsed.data.summary,
    sponsor_id: user.id,
    status: "draft",
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/mp")
  return { ok: true }
}

export async function advanceBillStage(
  billId: string,
  current: BillStatus
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const next = nextStage(current)
  if (!next) return { ok: false, error: "Bill is already at the final stage." }
  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }
  const { error } = await supabase
    .from("bills")
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq("id", billId)
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/dashboard/mp/bills/${billId}`)
  revalidatePath("/dashboard/mp")
  return { ok: true }
}

export async function castVote(
  billId: string,
  choice: VoteChoice
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }
  const { error } = await supabase
    .from("votes")
    .upsert(
      { bill_id: billId, member_id: user.id, choice },
      { onConflict: "member_id,bill_id" }
    )
  if (error) return { ok: false, error: error.message }
  revalidatePath(`/dashboard/mp/bills/${billId}`)
  return { ok: true }
}

export async function createMotion(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const parsed = motionSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message }
  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }
  const { error } = await supabase.from("motions").insert({
    title: parsed.data.title,
    body: parsed.data.body,
    mover_id: user.id,
    status: "submitted",
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/mp")
  return { ok: true }
}

export async function createRecommendation(
  formData: FormData
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const parsed = recommendationSchema.safeParse({
    title: formData.get("title"),
    body: formData.get("body"),
    communityId: formData.get("communityId") || undefined,
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message }
  const { supabase, user } = await userOrError()
  if (!user) return { ok: false, error: "Sign in required." }
  const { error } = await supabase.from("youth_recommendations").insert({
    title: parsed.data.title,
    body: parsed.data.body,
    community_id: parsed.data.communityId ?? null,
    status: "submitted",
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/mp")
  return { ok: true }
}
