import { createServerClient, type CookieOptions } from "@supabase/ssr"
import { cookies } from "next/headers"

type CookieToSet = { name: string; value: string; options: CookieOptions }

/**
 * Server-side Supabase client (Server Components, Server Actions, Route
 * Handlers). Reads the session from cookies; RLS enforces access.
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Called from a Server Component — safe to ignore; middleware
            // refreshes the session.
          }
        },
      },
    }
  )
}

/** True when real Supabase credentials are configured (not placeholders). */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
  return url.length > 0 && !url.includes("placeholder")
}
