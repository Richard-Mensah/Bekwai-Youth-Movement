/**
 * The site's own origin, in one place.
 *
 * Four files were deriving this independently — the root layout, the members
 * actions, and both print routes — two of them with a different fallback from
 * the others. That is the shape of bug you only find after a domain move: the
 * pages look right because they read the env var, while one server action keeps
 * emailing links to the address it was born with.
 *
 * So a domain migration is this constant plus `NEXT_PUBLIC_SITE_URL`, and
 * nothing else in the codebase.
 *
 * The trailing slash is stripped because every caller concatenates a path that
 * starts with one, and `metadataBase` silently produces `//dashboard` otherwise.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit) return explicit.replace(/\/+$/, "")

  // Vercel sets this on every deployment, including previews. It means a preview
  // build generates links to itself rather than to production — which is what
  // you want when testing an auth flow on a preview URL.
  const vercel = process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`

  return "http://localhost:3000"
}

export const SITE_URL = resolveSiteUrl()

/** An absolute URL for a path on this site. `path` should start with "/". */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}
