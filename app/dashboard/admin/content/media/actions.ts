"use server"

import { revalidatePath } from "next/cache"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage, deleteImage } from "@/lib/storage"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"

export async function uploadMedia(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const file = formData.get("file") as File | null
  if (!file || file.size === 0) return { ok: false, error: "Choose a file." }
  const up = await uploadImage(file, "uploads")
  if (up.error) return { ok: false, error: up.error }
  await audit("media", up.path ?? null, "upload")
  revalidatePath("/dashboard/admin/content/media")
  return { ok: true }
}

export async function deleteMedia(path: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  await deleteImage(path)
  await audit("media", path, "delete")
  revalidatePath("/dashboard/admin/content/media")
  return { ok: true }
}
