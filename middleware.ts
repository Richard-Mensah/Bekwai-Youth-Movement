import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return updateSession(request)
}

export const config = {
  matcher: [
    /**
     * Everything except static assets, and except the routes that provably have
     * no session to refresh.
     *
     * `api/auth/send-email` is the Supabase Send Email Hook. It authenticates by
     * HMAC signature, not by cookie, so running the session refresh on it costs a
     * `getUser()` round trip to Supabase on every auth email — latency added to
     * the one request a member is actually waiting on, to compute an answer the
     * route discards.
     *
     * `sitemap.xml` and `robots.txt` are anonymous by definition and get hit by
     * crawlers far more often than by people.
     */
    "/((?!_next/static|_next/image|favicon.ico|images|api/auth/send-email|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
