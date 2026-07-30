"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { createAdminClient, adminClientReady } from "@/lib/supabase/admin"
import { sendEmail, emailEnabled, ADMIN_EMAIL } from "@/lib/email"
import { audit, assertMemberAdmin, NOT_READY, type ContentResult } from "@/lib/cms"
import { emailOnlySchema } from "@/lib/validations"
import type { VerificationStatus } from "@/types"

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://bekwai-youth-movement.vercel.app"

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * Emails registered members via Resend (bcc, batched in 50s). Optionally
 * filtered by verification status. Logs the send to newsletter_broadcasts.
 */
export async function emailMembers(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const subject = String(formData.get("subject") ?? "").trim()
  const body = String(formData.get("body") ?? "").trim()
  const status = String(formData.get("status") ?? "all")
  if (subject.length < 3) return { ok: false, error: "Enter a subject." }
  if (body.length < 10) return { ok: false, error: "Write a longer message." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let q = supabase.from("profiles").select("email, verification_status")
  if (status === "verified" || status === "pending") q = q.eq("verification_status", status)
  const { data: rows } = await q
  const emails = (rows ?? [])
    .map((r) => r.email as string | null)
    .filter((e): e is string => Boolean(e))

  const logSubject = `[Members] ${subject}`

  if (!emailEnabled()) {
    await supabase.from("newsletter_broadcasts").insert({
      subject: logSubject,
      body,
      status: "draft",
      recipient_count: emails.length,
      created_by: user?.id ?? null,
    })
    revalidatePath("/dashboard/admin/members")
    return { ok: false, error: "Saved as draft — set RESEND_API_KEY to send." }
  }

  if (emails.length === 0) return { ok: false, error: "No members match that filter yet." }

  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.6">${escapeHtml(
    body
  ).replace(/\n/g, "<br/>")}</div>`

  let sent = 0
  for (let i = 0; i < emails.length; i += 50) {
    const batch = emails.slice(i, i + 50)
    const res = await sendEmail({ to: ADMIN_EMAIL, bcc: batch, subject, html, text: body })
    if (res.ok) sent += batch.length
  }

  await supabase.from("newsletter_broadcasts").insert({
    subject: logSubject,
    body,
    status: "sent",
    recipient_count: sent,
    sent_at: new Date().toISOString(),
    created_by: user?.id ?? null,
  })
  await audit("members", null, "email", `${sent} recipient(s)`)
  revalidatePath("/dashboard/admin/members")
  return { ok: true, error: sent === 0 ? "No members to send to yet." : undefined }
}

/**
 * Approves or declines a membership registration.
 *
 * This is what unlocks a member's role-based dashboard, so it is the one place
 * the Secretariat decides who is genuinely of the Movement. Applying for office
 * deliberately does not wait on it — see lib/dashboard-access.ts.
 *
 * The member is told by email when a decision is made, because otherwise the
 * only signal is a dashboard that silently starts working. Mail is best-effort:
 * a delivery failure is logged inside sendEmail and never blocks the decision.
 *
 * The role check is not belt-and-braces over RLS — it is the only thing that
 * reports the refusal. A caller RLS declines to serve gets no error back, just
 * zero rows touched, so before this guard a secretary could click Verify and
 * watch the badge stay exactly where it was, with nothing on screen to say why.
 */
export async function setMemberVerification(
  id: string,
  status: VerificationStatus
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const denied = await assertMemberAdmin()
  if (denied) return denied
  const supabase = await createClient()

  const { data: member } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .single()

  const { data: updated, error } = await supabase
    .from("profiles")
    .update({ verification_status: status })
    .eq("id", id)
    .select("id")
  if (error) return { ok: false, error: error.message }
  if ((updated?.length ?? 0) === 0) {
    return {
      ok: false,
      error: "That member's record did not change. Reload the page and try again.",
    }
  }

  // A rejected member should not stay on the public homepage wall.
  if (status !== "verified") {
    await supabase.from("profiles").update({ is_public: false }).eq("id", id)
  }

  await audit("member", id, `verification_${status}`, member?.full_name ?? undefined)

  const to = member?.email as string | null | undefined
  if (to && status !== "pending") {
    const name = (member?.full_name as string) || "member"
    const verified = status === "verified"
    const subject = verified
      ? "Your BYM membership is verified"
      : "About your BYM membership registration"
    const body = verified
      ? `Akwaaba ${name} — your membership of the Bekwai Youth Movement has been verified. Your dashboard is now open at ${SITE_URL}/dashboard.`
      : `Hello ${name} — we were not able to verify your BYM membership registration at this time. If you believe this is a mistake, reply to this email and the Secretariat will take another look.`
    await sendEmail({
      to,
      subject,
      html: `<div style="font-family:system-ui,sans-serif;line-height:1.6">${escapeHtml(body)}</div>`,
      text: body,
      replyTo: ADMIN_EMAIL,
    })
  }

  revalidatePath("/dashboard/admin/members")
  revalidatePath("/")
  return { ok: true }
}

/**
 * Verifies many members in one decision.
 *
 * An enrolment drive turns verification from a judgement made a few times a week
 * into a queue of hundreds, and a queue that can only be cleared one row at a
 * time does not get cleared — it gets cleared by whoever is willing to run an
 * `update` in the SQL editor, which is how six members came to be confirmed with
 * no audit trail on 29 Jul. Making the sweep a real, recorded action is what
 * stops that happening again.
 *
 * Deliberately no email, unlike the single-member decision. Two reasons: three
 * hundred individual sends would exhaust the provider's daily quota to say
 * something better said once, and the Secretariat already has "Email members"
 * on this page for exactly that announcement. So the sweep is silent, and saying
 * so is part of the UI.
 *
 * One `update ... in (...)` rather than a loop — three hundred round trips would
 * time the request out long before they finished.
 */
export async function verifyMembers(ids: string[]): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const denied = await assertMemberAdmin()
  if (denied) return denied
  if (ids.length === 0) return { ok: false, error: "Select at least one member." }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from("profiles")
    .update({ verification_status: "verified" })
    .in("id", ids)
    // Returned so the count reported back is what the database actually changed,
    // not what the browser hoped it would.
    .select("id")
  if (error) return { ok: false, error: error.message }

  const changed = data?.length ?? 0
  await audit("members", null, "bulk_verified", `${changed} member(s)`)
  revalidatePath("/dashboard/admin/members")
  revalidatePath("/")

  // Nothing at all changed. Distinguished from a partial sweep because the cause
  // is different: RLS serving zero rows rather than a race with another
  // administrator, and telling someone to "reload to see where they stand" when
  // the real answer is "you were not permitted" wastes their evening.
  if (changed === 0) {
    return {
      ok: false,
      error:
        "No records changed. Your account may not have permission to verify memberships — ask a super admin.",
    }
  }
  if (changed < ids.length) {
    return {
      ok: true,
      error: `Verified ${changed} of ${ids.length}. The rest were changed by someone else — reload to see where they stand.`,
    }
  }
  return { ok: true }
}

/**
 * Confirms a member's email address on their behalf.
 *
 * The escape hatch for someone who cannot get in because a confirmation email
 * never arrived, or arrived and expired. Before this existed the only remedy was
 * an `update` against `auth.users` in the SQL editor — which is how six members
 * came to be confirmed in a single statement on 29 Jul, with no audit trail and
 * no way for the Secretariat to do it themselves.
 *
 * Note what this does *not* do: it proves nothing about the address. It says an
 * administrator vouches for it. That is why it is a deliberate per-member action
 * and not a "confirm everyone" button.
 */
export async function confirmMemberEmail(id: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const denied = await assertMemberAdmin()
  if (denied) return denied
  if (!adminClientReady()) {
    return {
      ok: false,
      error:
        "Set SUPABASE_SERVICE_ROLE_KEY to confirm addresses from here (see supabase/README.md §4-0).",
    }
  }

  const { error } = await createAdminClient().auth.admin.updateUserById(id, {
    email_confirm: true,
  })
  if (error) return { ok: false, error: error.message }

  await audit("member", id, "email_confirmed_by_admin")
  revalidatePath("/dashboard/admin/members")
  return { ok: true }
}

/**
 * Corrects the email address a member registered with.
 *
 * A registration desk produces typos, and a typo'd address is not cosmetic: it
 * is a member who can never reset their own password, because the reset goes to
 * an inbox nobody reads. That gets worse, not better, with "Confirm email"
 * turned off for a drive — nothing bounces to reveal the mistake.
 *
 * Both places must move together. `auth.users.email` is what the member signs in
 * with; `profiles.email` is what the directory, exports and notifications read.
 * Left half-done, someone signs in with one address while the Secretariat emails
 * another — so the auth side goes first and the profile only follows if it
 * succeeded.
 */
export async function correctMemberEmail(
  id: string,
  rawEmail: string
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const denied = await assertMemberAdmin()
  if (denied) return denied
  if (!adminClientReady()) {
    return {
      ok: false,
      error:
        "Set SUPABASE_SERVICE_ROLE_KEY to change addresses from here (see supabase/README.md §4-0).",
    }
  }

  // Same normalisation the join form applies, so an address corrected by hand
  // cannot differ from the same address typed by the member.
  const parsed = emailOnlySchema.safeParse({ email: rawEmail })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0].message }
  }
  const email = parsed.data.email

  const admin = createAdminClient()

  // `email_confirm` alongside the new address, because the point of the fix is a
  // member who can now be reached: leaving it unconfirmed would send them back
  // to waiting for an email, which is the problem being solved.
  const { error } = await admin.auth.admin.updateUserById(id, {
    email,
    email_confirm: true,
  })
  if (error) {
    // The likeliest failure by far, and worth naming: the address already
    // belongs to another member, usually because they registered twice.
    return {
      ok: false,
      error: /already|duplicate/i.test(error.message)
        ? `${email} already belongs to another member.`
        : error.message,
    }
  }

  const supabase = await createClient()
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ email })
    .eq("id", id)
  if (profileError) {
    return {
      ok: false,
      error: `Sign-in address changed to ${email}, but the directory still shows the old one — retry to finish. (${profileError.message})`,
    }
  }

  await audit("member", id, "email_corrected", email)
  revalidatePath("/dashboard/admin/members")
  revalidatePath("/")
  return { ok: true }
}

/** Shows or hides a member from the public homepage wall. */
export async function toggleMemberPublic(
  id: string,
  next: boolean
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { error } = await supabase.from("profiles").update({ is_public: next }).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("member", id, next ? "show_on_site" : "hide_from_site")
  revalidatePath("/dashboard/admin/members")
  revalidatePath("/")
  return { ok: true }
}
