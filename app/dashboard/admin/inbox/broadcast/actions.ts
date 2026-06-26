"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendEmail, emailEnabled, ADMIN_EMAIL } from "@/lib/email"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** Sends a newsletter to all subscribers via Resend (bcc, batched), or saves a
 * draft if email isn't configured. Logs every attempt to newsletter_broadcasts. */
export async function sendBroadcast(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const subject = String(formData.get("subject") ?? "").trim()
  const body = String(formData.get("body") ?? "").trim()
  if (subject.length < 3) return { ok: false, error: "Enter a subject." }
  if (body.length < 10) return { ok: false, error: "Write a longer message." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const { data: subs } = await supabase
    .from("newsletter_subscribers")
    .select("email")
  const emails = (subs ?? []).map((s) => s.email as string)

  if (!emailEnabled()) {
    await supabase.from("newsletter_broadcasts").insert({
      subject,
      body,
      status: "draft",
      recipient_count: emails.length,
      created_by: user?.id ?? null,
    })
    revalidatePath("/dashboard/admin/inbox/broadcast")
    return {
      ok: false,
      error: "Saved as draft — set RESEND_API_KEY to send broadcasts.",
    }
  }

  const html = `<div style="font-family:system-ui,sans-serif;line-height:1.6">${escapeHtml(
    body
  ).replace(/\n/g, "<br/>")}</div>`

  let sent = 0
  for (let i = 0; i < emails.length; i += 50) {
    const batch = emails.slice(i, i + 50)
    const res = await sendEmail({
      to: ADMIN_EMAIL,
      bcc: batch,
      subject,
      html,
      text: body,
    })
    if (res.ok) sent += batch.length
  }

  await supabase.from("newsletter_broadcasts").insert({
    subject,
    body,
    status: "sent",
    recipient_count: sent,
    sent_at: new Date().toISOString(),
    created_by: user?.id ?? null,
  })
  await audit("broadcast", null, "send", `${sent} recipient(s)`)
  revalidatePath("/dashboard/admin/inbox/broadcast")
  return {
    ok: true,
    error: sent === 0 ? "No subscribers to send to yet." : undefined,
  }
}
