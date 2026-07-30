import "server-only"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * A Supabase client holding the service-role key.
 *
 * This key is not "a more powerful login" — it is the absence of a login. Every
 * RLS policy in the schema is skipped, so the only protection left is the code
 * around the call. Two rules follow, and both are load-bearing:
 *
 *  1. **Never import this from a Client Component.** The `server-only` import
 *     above turns that mistake into a build error rather than a key published in
 *     a JavaScript bundle, which is why it is the first line of the file.
 *  2. **Every caller must check the caller's role itself.** The admin layout's
 *     gate does not help here: a Server Action is its own POST endpoint, and a
 *     layout never runs for one. Use `assertSecretariat()` below.
 *
 * Only reach for this when the anon-key client in `./server` genuinely cannot do
 * the job — that one carries the member's own session and RLS still applies, so
 * it is the safe default. The real reason this file exists is `auth.admin.*`:
 * the `auth.users` table is not reachable through RLS at all, so confirming or
 * correcting a member's email address has no other route.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. Add it to .env.local (and to the Vercel environment variables for the deployed site)."
    )
  }

  return createSupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key, {
    auth: {
      // There is no user here and no cookie jar to write to. Left on, the client
      // would try to persist and refresh a session that does not exist.
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/** True when the service-role key is available, so callers can degrade instead
 *  of throwing at the member. */
export function adminClientReady(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY)
}
