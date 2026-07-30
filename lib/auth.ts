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
  /** Null for anyone who signed in with Google and has not finished the form. */
  communityId: number | null
  /** True when the dashboard should divert to `/complete-profile`. */
  needsProfile: boolean
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
  communityId: null,
  // Deliberately false: a signed-out visitor needs sign-in, not a profile form.
  // Sending them to /complete-profile would bounce them between the two.
  needsProfile: false,
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
      communityId: null,
      needsProfile: false,
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return ANONYMOUS

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, verification_status, community_id")
    .eq("id", user.id)
    .single()

  const role = (profile?.role as Role) ?? "member"
  const communityId = (profile?.community_id as number | null) ?? null

  return {
    configured: true,
    userId: user.id,
    email: user.email ?? null,
    // Google supplies a name; the email is the fallback for a provider that
    // does not, so the dashboard never greets somebody as "Member".
    fullName: profile?.full_name ?? user.email ?? "Member",
    role,
    verificationStatus:
      (profile?.verification_status as VerificationStatus) ?? "pending",
    communityId,
    /**
     * Community is the only field gated on, and only for ordinary members.
     *
     * Only community, because it is the one that changes what the Movement can
     * do: representation, the community wall and every per-community report are
     * computed from it, and a member without one is invisible to all three.
     * Phone and date of birth are asked for on the same form but are not worth
     * standing between someone and their dashboard.
     *
     * Only members, because staff roles are conferred by an administrator rather
     * than self-registered — and because the super_admin account predates the
     * field being collected at all. Gating every role would have met the one
     * account that can repair things with a form it must fill in before it can
     * reach the console, which is a lockout of our own making.
     */
    needsProfile: role === "member" && communityId === null,
  }
})
