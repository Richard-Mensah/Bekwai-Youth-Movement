// Public placeholder image helpers. Swap these for your own assets later
// (e.g. Supabase Storage URLs) without changing the call sites.

/** Deterministic stock photo for a project/card, keyed by a stable seed. */
export function placeholderImage(seed: string, w = 600, h = 400): string {
  return `https://picsum.photos/seed/bym-${encodeURIComponent(seed)}/${w}/${h}`
}

/** Generated avatar from a person's name (initials on brand-green). */
export function avatarUrl(name: string, size = 128): string {
  const n = encodeURIComponent(name || "BYM")
  return `https://ui-avatars.com/api/?name=${n}&background=1F4D3F&color=fff&size=${size}&bold=true`
}
