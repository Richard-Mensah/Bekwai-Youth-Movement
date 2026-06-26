"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage, deleteImage } from "@/lib/storage"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"

function parse(formData: FormData) {
  return {
    tier: String(formData.get("tier") ?? "cabinet").trim(),
    title: String(formData.get("title") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim() || null,
    blurb: String(formData.get("blurb") ?? "").trim() || null,
    ukEquivalent: String(formData.get("ukEquivalent") ?? "").trim() || null,
    sdg: String(formData.get("sdg") ?? "")
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n)),
    sortOrder: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
    isPublished: formData.get("isPublished") === "on",
  }
}

function revalidate() {
  revalidatePath("/dashboard/admin/content/leaders")
  revalidatePath("/leadership")
  revalidatePath("/")
}

export async function createLeader(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const d = parse(formData)
  if (d.title.length < 2) return { ok: false, error: "Enter a role title." }
  const supabase = await createClient()
  const photo = await uploadImage(formData.get("photo") as File | null, "leaders")
  if (photo.error) return { ok: false, error: photo.error }
  const { data: row, error } = await supabase
    .from("leaders")
    .insert({
      tier: d.tier,
      title: d.title,
      name: d.name,
      blurb: d.blurb,
      uk_equivalent: d.ukEquivalent,
      sdg: d.sdg,
      sort_order: d.sortOrder,
      is_published: d.isPublished,
      photo_path: photo.path ?? null,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  await audit("leader", row?.id ?? null, "create", d.name ?? d.title)
  revalidate()
  return { ok: true, id: row?.id }
}

export async function updateLeader(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const id = String(formData.get("id") ?? "")
  if (!id) return { ok: false, error: "Missing id." }
  const d = parse(formData)
  const supabase = await createClient()
  const patch: Record<string, unknown> = {
    tier: d.tier,
    title: d.title,
    name: d.name,
    blurb: d.blurb,
    uk_equivalent: d.ukEquivalent,
    sdg: d.sdg,
    sort_order: d.sortOrder,
    is_published: d.isPublished,
  }
  const file = formData.get("photo") as File | null
  if (file && file.size > 0) {
    const photo = await uploadImage(file, "leaders")
    if (photo.error) return { ok: false, error: photo.error }
    patch.photo_path = photo.path
  }
  const { error } = await supabase.from("leaders").update(patch).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("leader", id, "update", d.name ?? d.title)
  revalidate()
  return { ok: true, id }
}

export async function deleteLeader(id: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { data } = await supabase
    .from("leaders")
    .select("photo_path")
    .eq("id", id)
    .single()
  await deleteImage(data?.photo_path)
  const { error } = await supabase.from("leaders").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("leader", id, "delete")
  revalidate()
  return { ok: true }
}

export async function toggleLeaderPublish(
  id: string,
  next: boolean
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { error } = await supabase
    .from("leaders")
    .update({ is_published: next })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("leader", id, next ? "publish" : "unpublish")
  revalidate()
  return { ok: true }
}
