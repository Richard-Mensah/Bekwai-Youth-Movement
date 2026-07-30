"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendEmail, emailEnabled, ADMIN_EMAIL } from "@/lib/email"
import { SITE_URL } from "@/lib/site"
import { ORG } from "@/constants/nav"

/**
 * Sends a newly registered member their welcome email.
 *
 * Registration does not wait on this and cannot fail because of it. Email
 * confirmation is off (see supabase/README.md §4-0), so a member is already
 * signed in and holding a working dashboard by the time this runs — the email is
 * a record of their account, not a gate in front of it. That is the whole point:
 * six of the first ten members were lost to a link they had to click, and nothing
 * here can recreate that.
 *
 * **Takes no arguments, deliberately.** An action that accepted an address would
 * be a public open relay: anyone could POST to it and have our verified domain
 * send mail to anyone. The recipient is read from the caller's own session
 * cookie, so the only inbox this can ever reach is the caller's own.
 *
 * Idempotent via `profiles.welcome_email_sent_at`. React re-invocations, retried
 * submits and reloads all resolve to one send.
 */
export async function sendWelcomeEmail(): Promise<{ sent: boolean }> {
  // Every early return is `sent: false` and never a thrown error. The caller is
  // a fire-and-forget call on the happy path of registration; an exception here
  // would surface as a failure on a signup that actually succeeded.
  if (!isSupabaseConfigured()) return { sent: false }

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // getUser() validates the JWT against Supabase rather than trusting the
    // cookie's contents, so this is an authentication check and not just a read.
    if (!user?.email) return { sent: false }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, membership_id, welcome_email_sent_at, communities(name)")
      .eq("id", user.id)
      .single()

    if (profile?.welcome_email_sent_at) return { sent: false }

    // Claim the send *before* dispatching. If Resend is slow and the member
    // reloads, the second call sees the timestamp and stops — a duplicate email
    // is worse than a missing one, because it makes us look broken to someone
    // who has just decided to trust us.
    const claimedAt = new Date().toISOString()
    const { data: claimed } = await supabase
      .from("profiles")
      .update({ welcome_email_sent_at: claimedAt })
      .eq("id", user.id)
      .is("welcome_email_sent_at", null)
      .select("id")

    // Somebody else claimed it in the gap. Not an error; just not ours to send.
    if ((claimed?.length ?? 0) === 0) return { sent: false }

    // Checked after claiming so that turning email on later does not produce a
    // backlog of welcomes for members who registered while it was off. Their
    // account works; a welcome three weeks late is worse than none.
    if (!emailEnabled()) return { sent: false }

    const firstName = (profile?.full_name ?? "").trim().split(/\s+/)[0] || "member"
    const community = (profile?.communities as { name?: string } | null)?.name
    const membershipId = profile?.membership_id

    const dashboardUrl = `${SITE_URL}/dashboard`
    const subject = `Akwaaba ${firstName} — your ${ORG.shortName} account is ready`

    const lines = [
      `Akwaaba ${firstName},`,
      "",
      `You are registered with the ${ORG.name}. Your account is active and you can sign in whenever you like.`,
      "",
      membershipId ? `Membership number: ${membershipId}` : null,
      community ? `Community: ${community}` : null,
      `Email: ${user.email}`,
      "",
      `Your dashboard: ${dashboardUrl}`,
      "",
      "You can apply for office straight away — you do not need to wait for an administrator to verify your membership first.",
      "",
      `${ORG.motto}.`,
      ORG.name,
    ].filter((l): l is string => l !== null)

    const text = lines.join("\n")

    // Deliberately plain: a table-based responsive template is wasted on an
    // inbox reached from a phone on Ghanaian mobile data, and inlined styles are
    // what survive Gmail's stripping anyway.
    const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;line-height:1.6;color:#1a1a1a;max-width:520px">
  <p style="margin:0 0 16px">Akwaaba <strong>${escapeHtml(firstName)}</strong>,</p>
  <p style="margin:0 0 16px">You are registered with the ${escapeHtml(ORG.name)}. Your account is active — you can sign in whenever you like.</p>
  <table style="border-collapse:collapse;margin:0 0 20px;font-size:14px">
    ${membershipId ? row("Membership number", membershipId) : ""}
    ${community ? row("Community", community) : ""}
    ${row("Email", user.email)}
  </table>
  <p style="margin:0 0 24px">
    <a href="${dashboardUrl}" style="display:inline-block;background:#14342B;color:#F5C542;text-decoration:none;padding:12px 24px;border-radius:999px;font-weight:600">Open my dashboard</a>
  </p>
  <p style="margin:0 0 16px;font-size:14px;color:#555">You can apply for office straight away — there is no need to wait for an administrator to verify your membership first.</p>
  <p style="margin:24px 0 0;font-size:13px;color:#777">${escapeHtml(ORG.motto)}.<br/>${escapeHtml(ORG.name)}</p>
</div>`

    const res = await sendEmail({
      to: user.email,
      subject,
      html,
      text,
      // So a reply reaches the Secretariat rather than bouncing off a no-reply
      // sender. A new member replying to ask a question is a good outcome.
      replyTo: ADMIN_EMAIL,
    })

    // Release the claim so a retry can happen — a send that failed at the
    // provider should not leave the member permanently marked as emailed.
    if (!res.ok) {
      await supabase
        .from("profiles")
        .update({ welcome_email_sent_at: null })
        .eq("id", user.id)
      return { sent: false }
    }

    return { sent: true }
  } catch {
    // A welcome email is never worth failing a registration over.
    return { sent: false }
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

function row(label: string, value: string) {
  return `<tr><td style="padding:2px 16px 2px 0;color:#666">${escapeHtml(label)}</td><td style="padding:2px 0"><strong>${escapeHtml(value)}</strong></td></tr>`
}
