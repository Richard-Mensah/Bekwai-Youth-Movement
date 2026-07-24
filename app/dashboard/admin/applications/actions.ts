"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { NOT_READY, type ContentResult } from "@/lib/cms"

export const APPLICATION_STATUSES = [
  "new",
  "shortlisted",
  "interview",
  "accepted",
  "rejected",
  "archived",
] as const

export async function setApplicationStatus(
  id: string,
  status: string
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  if (!APPLICATION_STATUSES.includes(status as (typeof APPLICATION_STATUSES)[number]))
    return { ok: false, error: "Invalid status." }
  const supabase = await createClient()
  const { error } = await supabase
    .from("leadership_applications")
    .update({ status })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/applications")
  return { ok: true }
}
