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

/**
 * Resolves the current user's profile for dashboard rendering.
 * When Supabase is not configured, returns a demo admin profile so the
 * dashboard shells can be previewed locally.
 */
export async function getSessionProfile(): Promise<SessionProfile> {
  if (!isSupabaseConfigured()) {
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

  if (!user) {
    return {
      configured: true,
      userId: null,
      email: null,
      fullName: "",
      role: "public",
      verificationStatus: "pending",
    }
  }

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
}
