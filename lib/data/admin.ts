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

export type ContactMessage = {
  id: string
  name: string
  email: string
  topic: string | null
  message: string
  createdAt: string
}

export type Subscriber = {
  id: string
  email: string
  source: string
  createdAt: string
}

/**
 * Contact-form enquiries, newest first. Returns [] in demo mode or if the
 * table hasn't been created yet (migration 0012 not applied).
 */
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("contact_messages")
    .select("id, name, email, topic, message, created_at")
    .order("created_at", { ascending: false })
    .limit(200)
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    topic: r.topic,
    message: r.message,
    createdAt: r.created_at,
  }))
}

/**
 * Newsletter subscribers, newest first. Returns [] in demo mode or if the
 * table hasn't been created yet (migration 0011 not applied).
 */
export async function getSubscribers(): Promise<Subscriber[]> {
  if (!isSupabaseConfigured()) return []
  const supabase = await createClient()
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, source, created_at")
    .order("created_at", { ascending: false })
    .limit(500)
  return (data ?? []).map((r) => ({
    id: r.id,
    email: r.email,
    source: r.source,
    createdAt: r.created_at,
  }))
}
