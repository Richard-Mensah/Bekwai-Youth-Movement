"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

export type SubscribeResult = { ok: boolean; error?: string }

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Stores a newsletter signup (footer form). Public — no auth required. */
export async function subscribeNewsletter(
  formData: FormData
): Promise<SubscribeResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase()

  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "Please enter a valid email address." }
  }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Subscriptions aren't available right now." }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("newsletter_subscribers")
    .insert({ email, source: "footer" })

  if (error) {
    // Unique violation → already subscribed; treat as success.
    if (error.code === "23505") return { ok: true }
    return { ok: false, error: "Could not subscribe. Please try again." }
  }

  return { ok: true }
}
