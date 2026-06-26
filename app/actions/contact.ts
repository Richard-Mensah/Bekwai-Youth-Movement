"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendEmail, emailEnabled, ADMIN_EMAIL } from "@/lib/email"

export type ContactResult = { ok: boolean; error?: string }

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** Stores a contact-form enquiry. Public — no auth required. */
export async function submitContact(formData: FormData): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const topic = String(formData.get("topic") ?? "").trim()
  const message = String(formData.get("message") ?? "").trim()

  if (!name) return { ok: false, error: "Please enter your name." }
  if (!EMAIL_RE.test(email))
    return { ok: false, error: "Please enter a valid email address." }
  if (message.length < 5)
    return { ok: false, error: "Please enter a short message." }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Messaging isn't available right now." }
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("contact_messages")
    .insert({ name, email, topic, message })

  if (error) {
    return { ok: false, error: "Could not send your message. Please try again." }
  }

  // Best-effort admin notification (only if Resend is configured).
  if (emailEnabled()) {
    await sendEmail({
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New contact message${topic ? ` — ${topic}` : ""} from ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic || "—"}\n\n${message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
<p><strong>Topic:</strong> ${escapeHtml(topic) || "—"}</p>
<p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`,
    })
  }

  return { ok: true }
}
