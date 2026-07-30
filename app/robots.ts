import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

/**
 * robots.txt, which did not exist — so crawlers were free to spend their budget
 * on signed-in routes that only ever answer with a redirect to /login.
 *
 * `/dashboard` and `/auth` are disallowed because they are session-gated and
 * hold personal data; `/print` because the ID-card and appointment-letter routes
 * render a named individual's details for printing and have no business in a
 * search index. Disallow is a request, not a control — the real protection is
 * middleware plus RLS — but it keeps honest crawlers out of pages that would
 * otherwise leak a member's name into a search result.
 *
 * The sitemap reference is the part that earns its keep: it is how a crawler
 * finds `app/sitemap.ts` without being told.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/auth", "/print", "/api"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
