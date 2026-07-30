import type { NextConfig } from "next"

/**
 * Response headers applied to every route.
 *
 * There were none, which left the site relying entirely on browser defaults.
 * These are the four that cost nothing and cannot break a working page:
 *
 *  - `X-Content-Type-Options: nosniff` stops a browser second-guessing a
 *    Content-Type — the mechanism that turns an uploaded file into script.
 *    Relevant here because the CMS accepts member and gallery uploads.
 *  - `Referrer-Policy` keeps full URLs off third parties. Without it, a member
 *    following an outbound link from a dashboard page hands the destination the
 *    path they were on, IDs and all.
 *  - `X-Frame-Options: SAMEORIGIN` prevents another site framing ours to trick a
 *    signed-in member into clicking something (clickjacking).
 *  - `Strict-Transport-Security` tells the browser never to try plain HTTP again.
 *    Safe on Vercel, which serves HTTPS on every domain including previews.
 *
 * Deliberately NOT set here: `Content-Security-Policy`. This app inlines a
 * theme-flash script in `app/layout.tsx` and Next injects its own inline
 * bootstrap, so a correct policy needs per-request nonces threaded through the
 * document — worth doing, but it is a change that breaks the site when it is
 * wrong, and it does not belong in the same pass as a header list that cannot.
 * Tracked in the audit report as the next security item.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
]

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // Vercel serves these from the edge, so the app never pays for the transform
  // twice. AVIF first: appreciably smaller than WebP for the photography this
  // site is mostly made of, and every browser that matters now decodes it.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Supabase Storage public bucket
      { protocol: "https", hostname: "*.supabase.co" },
      // Public placeholder image sources (swap for your own assets later)
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }]
  },
}

export default nextConfig
