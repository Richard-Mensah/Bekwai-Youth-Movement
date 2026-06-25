"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { nominationSchema } from "@/lib/validations"
import { nextNominationStage, type NominationStage } from "@/constants/governance"

export type ActionResult = { ok: boolean; error?: string }
const NOT_READY: ActionResult = { ok: false, error: "Connect Supabase to use this feature." }

export async function createNomination(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const parsed = nominationSchema.safeParse({
    fullName: formData.get("fullName"),
    communityId: formData.get("communityId"),
    seatType: formData.get("seatType"),
    nominatedBy: formData.get("nominatedBy") || undefined,
  })
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message }
  const supabase = await createClient()
  const { error } = await supabase.from("nominations").insert({
    full_name: parsed.data.fullName,
    community_id: parsed.data.communityId,
    seat_type: parsed.data.seatType,
    nominated_by: parsed.data.nominatedBy ?? null,
    stage: "nominated",
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/vetting")
  return { ok: true }
}

export async function advanceNomination(
  id: string,
  current: NominationStage
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const next = nextNominationStage(current)
  if (!next) return { ok: false, error: "Already appointed." }
  const supabase = await createClient()
  const { error } = await supabase.from("nominations").update({ stage: next }).eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/vetting")
  return { ok: true }
}

export async function rejectNomination(id: string): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { error } = await supabase.from("nominations").update({ stage: "rejected" }).eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/vetting")
  return { ok: true }
}

export async function decideEndorsement(
  id: string,
  decision: "endorsed" | "declined"
): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { error } = await supabase
    .from("endorsements")
    .update({ decision, endorser_id: user?.id ?? null, decided_at: new Date().toISOString() })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/elder")
  return { ok: true }
}

export async function createTacEngagement(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const communityId = Number(formData.get("communityId")) || null
  const kind = String(formData.get("kind") ?? "").trim()
  const summary = String(formData.get("summary") ?? "").trim()
  if (!kind) return { ok: false, error: "Select an engagement type." }
  const supabase = await createClient()
  const { error } = await supabase.from("tac_engagements").insert({
    community_id: communityId,
    kind,
    summary,
  })
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/elder")
  return { ok: true }
}
