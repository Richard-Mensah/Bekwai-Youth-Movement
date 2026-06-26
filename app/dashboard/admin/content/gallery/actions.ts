"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage, deleteImage } from "@/lib/storage"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"

function revalidate() {
  revalidatePath("/dashboard/admin/content/gallery")
  revalidatePath("/gallery")
}

export async function addGalleryImage(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const caption = String(formData.get("caption") ?? "").trim() || null
  const sortOrder = parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0
  const file = formData.get("image") as File | null
  if (!file || file.size === 0) return { ok: false, error: "Choose an image to upload." }

  const up = await uploadImage(file, "gallery")
  if (up.error || !up.path) return { ok: false, error: up.error ?? "Upload failed." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("gallery_images")
    .insert({ path: up.path, caption, sort_order: sortOrder })
  if (error) return { ok: false, error: error.message }
  await audit("gallery", null, "create", caption ?? undefined)
  revalidate()
  return { ok: true }
}

export async function updateGalleryItem(
  id: string,
  caption: string,
  sortOrder: number
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { error } = await supabase
    .from("gallery_images")
    .update({ caption: caption || null, sort_order: sortOrder })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("gallery", id, "update")
  revalidate()
  return { ok: true }
}

export async function deleteGalleryImage(id: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { data } = await supabase
    .from("gallery_images")
    .select("path")
    .eq("id", id)
    .single()
  await deleteImage(data?.path)
  const { error } = await supabase.from("gallery_images").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("gallery", id, "delete")
  revalidate()
  return { ok: true }
}
