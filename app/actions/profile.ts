"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { completeProfileSchema } from "@/lib/validations"
import { sendWelcomeEmail } from "@/app/actions/welcome"

/**
 * Fills in the fields Google could not supply.
 *
 * Written as a server action rather than a client-side update for one reason
 * that matters: the row it writes is chosen from the session cookie, never from
 * anything the browser sends. There is no `id` parameter, so there is no version
 * of this call that edits somebody else's profile — the same rule that keeps
 * `sendWelcomeEmail()` from being an open relay.
 *
 * Two server-side controls still stand behind it, and both are load-bearing:
 *
 *  - RLS `profiles_update_own` (0007) restricts the write to `auth.uid()`.
 *  - The 0021 BEFORE UPDATE trigger silently restores `role`,
 *    `verification_status`, `membership_id`, `is_public` and the rest. So even
 *    if this action were ever changed to pass a whole object through, a member
 *    still could not promote themselves — the extra columns are reverted rather
 *    than rejected.
 *
 * Only the four fields below are written regardless, because a narrow update is
 * easier to reason about than a trigger that has to catch a wide one.
 */
export async function completeProfile(
  raw: unknown
): Promise<{ ok: boolean; error?: string; fieldErrors?: Record<string, string> }> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." }
  }

  const parsed = completeProfileSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as string] = issue.message
    }
    return { ok: false, fieldErrors }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Validates the JWT with Supabase rather than trusting the cookie, so this is
  // an authentication check and not merely a read.
  if (!user) return { ok: false, error: "Please sign in again." }

  const { error } = await supabase
    .from("profiles")
    .update({
      gender: parsed.data.gender,
      dob: parsed.data.dob,
      phone: parsed.data.phone,
      community_id: parsed.data.communityId,
    })
    .eq("id", user.id)

  if (error) {
    // RLS filters rather than rejects, so a policy failure arrives as zero rows
    // updated and no error — a genuine error here means something structural
    // (a bad community id, a dropped column), which is worth showing.
    return { ok: false, error: "Could not save your details. Please try again." }
  }

  // Now, not at sign-in: the welcome email names the member's community and
  // membership number, and until this moment there was no community to name.
  // Idempotent via `welcome_email_sent_at`, so an OAuth member who somehow
  // reaches this twice still receives exactly one.
  void sendWelcomeEmail()

  // The dashboard layout reads the profile to decide whether to gate; without
  // this it would serve the cached "incomplete" answer and bounce them straight
  // back to this form.
  revalidatePath("/dashboard", "layout")

  return { ok: true }
}
