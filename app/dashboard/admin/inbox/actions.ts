"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { NOT_READY, type ContentResult } from "@/lib/cms"

const ALLOWED = ["new", "read", "archived"] as const

export async function setMessageStatus(
  id: string,
  status: string
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  if (!ALLOWED.includes(status as (typeof ALLOWED)[number]))
    return { ok: false, error: "Invalid status." }
  const supabase = await createClient()
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  revalidatePath("/dashboard/admin/inbox")
  return { ok: true }
}
