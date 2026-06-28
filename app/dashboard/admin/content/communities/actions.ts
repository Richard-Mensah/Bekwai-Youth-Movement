"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { audit, slugify, NOT_READY, type ContentResult } from "@/lib/cms"

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
    .update({ name: trimmed, slug: slugify(trimmed) })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("community", String(id), "update", trimmed)
  revalidatePath("/dashboard/admin/content/communities")
  revalidatePath("/representation")
  revalidatePath("/communities")
  revalidatePath("/")
  return { ok: true }
}

/** Updates the editable per-community detail (about, chief, elders). */
export async function updateCommunityDetails(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const id = Number(formData.get("id"))
  if (!id) return { ok: false, error: "Missing community." }
  const name = String(formData.get("name") ?? "").trim()
  if (!name) return { ok: false, error: "Name is required." }

  const patch = {
    name,
    slug: slugify(name),
    about: String(formData.get("about") ?? "").trim() || null,
    chief: String(formData.get("chief") ?? "").trim() || null,
    chief_title: String(formData.get("chiefTitle") ?? "").trim() || null,
    elders: String(formData.get("elders") ?? "").trim() || null,
  }

  const supabase = await createClient()
  const { error } = await supabase.from("communities").update(patch).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("community", String(id), "update", name)
  revalidatePath("/dashboard/admin/content/communities")
  revalidatePath("/communities")
  revalidatePath(`/communities/${patch.slug}`)
  revalidatePath("/representation")
  revalidatePath("/")
  return { ok: true }
}
