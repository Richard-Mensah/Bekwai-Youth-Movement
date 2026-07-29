import { cache } from "react"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import type { Role, VerificationStatus } from "@/types"

export interface SessionProfile {
  configured: boolean
  userId: string | null
  email: string | null
  fullName: string
  role: Role
  verificationStatus: VerificationStatus
}

/** Signed out, or shut out. The safe answer whenever we cannot establish who
 *  someone is. */
const ANONYMOUS: SessionProfile = {
  configured: true,
  userId: null,
  email: null,
  fullName: "",
  role: "public",
  verificationStatus: "pending",
}

/**
 * Resolves the current user's profile for dashboard rendering.
 *
 * Memoised per request: the dashboard layout, the admin role gate and any page
 * that needs the role all call this, and without `cache` each one would be a
 * separate round trip for an answer that cannot change mid-request.
 *
 * When Supabase is not configured this returns a demo admin profile so the
 * dashboard shells can be previewed locally — but only outside production.
 * `isSupabaseConfigured()` is a shallow check on one env var, so a missing or
 * mistyped `NEXT_PUBLIC_SUPABASE_URL` on the deployed site used to hand the
 * Secretariat console to anonymous visitors. In production the failure mode has
 * to be closed, even at the cost of a broken-looking dashboard.
 */
export const getSessionProfile = cache(async (): Promise<SessionProfile> => {
  if (!isSupabaseConfigured()) {
    if (process.env.NODE_ENV === "production") return ANONYMOUS
    return {
      configured: false,
      userId: null,
      email: "demo@bekwaiyouthmovement.org",
      fullName: "Demo User",
      role: "admin",
      verificationStatus: "verified",
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return ANONYMOUS

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, verification_status")
    .eq("id", user.id)
    .single()

  return {
    configured: true,
    userId: user.id,
    email: user.email ?? null,
    fullName: profile?.full_name ?? user.email ?? "Member",
    role: (profile?.role as Role) ?? "member",
    verificationStatus:
      (profile?.verification_status as VerificationStatus) ?? "pending",
  }
})
