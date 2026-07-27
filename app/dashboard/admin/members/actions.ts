"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendEmail, emailEnabled, ADMIN_EMAIL } from "@/lib/email"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"
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
 */
export async function setMemberVerification(
  id: string,
  status: VerificationStatus
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()

  const { data: member } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", id)
    .single()

  const { error } = await supabase
    .from("profiles")
    .update({ verification_status: status })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }

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
