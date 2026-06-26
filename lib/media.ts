const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""

/**
 * Resolves a stored image reference to a usable URL. Accepts:
 * - a Supabase Storage object key (e.g. "leaders/uuid.jpg") → public URL
 * - an absolute URL (http…) → returned as-is
 * - a /public site asset path (e.g. "/images/history/x.jpg") → returned as-is
 * Client-safe (no server-only imports).
 */
export function publicUrl(
  path?: string | null,
  bucket = "content"
): string | null {
  if (!path) return null
  if (path.startsWith("http") || path.startsWith("/")) return path
  return `${BASE}/storage/v1/object/public/${bucket}/${path}`
}
