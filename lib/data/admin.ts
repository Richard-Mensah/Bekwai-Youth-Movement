import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export type MemberStats = {
  configured: boolean
  total: number
  pending: number
  verified: number
}

/**
 * Live member counts for the admin overview. Returns zeros in demo mode
 * (Supabase not configured) so the dashboard still renders.
 */
export async function getMemberStats(): Promise<MemberStats> {
  if (!isSupabaseConfigured()) {
    return { configured: false, total: 0, pending: 0, verified: 0 }
  }

  const supabase = await createClient()

  const counts = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "pending"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("verification_status", "verified"),
  ])

  const [total, pending, verified] = counts.map((r) => r.count ?? 0)
  return { configured: true, total, pending, verified }
}
