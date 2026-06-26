"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"

export async function updateCommunityName(
  id: number,
  name: string
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, error: "Name is required." }
  const supabase = await createClient()
  const { error } = await supabase
    .from("communities")
    .update({ name: trimmed })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("community", String(id), "update", trimmed)
  revalidatePath("/dashboard/admin/content/communities")
  revalidatePath("/representation")
  revalidatePath("/")
  return { ok: true }
}
