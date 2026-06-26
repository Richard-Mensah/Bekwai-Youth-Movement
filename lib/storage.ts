import { createClient } from "@/lib/supabase/server"

export { publicUrl } from "@/lib/media"

export const CONTENT_BUCKET = "content"

/**
 * Uploads an image to a public Storage bucket and returns its object key.
 * Returns {} when no file was provided (so callers can keep an existing image).
 */
export async function uploadImage(
  file: File | null,
  prefix = "",
  bucket = CONTENT_BUCKET
): Promise<{ path?: string; error?: string }> {
  if (!file || file.size === 0) return {}
  const supabase = await createClient()
  const ext = (file.name.split(".").pop() || "bin").toLowerCase()
  const key = `${prefix ? prefix + "/" : ""}${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage
    .from(bucket)
    .upload(key, file, { upsert: false, contentType: file.type || undefined })
  if (error) return { error: error.message }
  return { path: key }
}

/** Removes a Storage object. No-op for external/public-asset paths. */
export async function deleteImage(
  path?: string | null,
  bucket = CONTENT_BUCKET
): Promise<void> {
  if (!path || path.startsWith("http") || path.startsWith("/")) return
  const supabase = await createClient()
  await supabase.storage.from(bucket).remove([path])
}
