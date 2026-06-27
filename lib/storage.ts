import { createClient } from "@/lib/supabase/server"
import { publicUrl as toPublicUrl } from "@/lib/media"

export { publicUrl } from "@/lib/media"

export const CONTENT_BUCKET = "content"

/** Lists images in the content bucket across known prefixes (newest first). */
export async function listMedia(): Promise<{ path: string; url: string }[]> {
  const supabase = await createClient()
  const prefixes = ["uploads", "posts", "leaders", "gallery", "events", "partners"]
  const out: { path: string; url: string }[] = []
  for (const p of prefixes) {
    const { data } = await supabase.storage
      .from(CONTENT_BUCKET)
      .list(p, { limit: 100, sortBy: { column: "created_at", order: "desc" } })
    for (const f of data ?? []) {
      if (f.name && f.id) {
        const path = `${p}/${f.name}`
        out.push({ path, url: toPublicUrl(path) ?? "" })
      }
    }
  }
  return out
}

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
