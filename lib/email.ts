import { Resend } from "resend"

const KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM ?? "Bekwai Youth Movement <onboarding@resend.dev>"

/** True when a Resend API key is configured. */
export function emailEnabled(): boolean {
  return Boolean(KEY)
}

export const ADMIN_EMAIL =
  process.env.EMAIL_ADMIN ?? "info@bekwaiyouthmovement.org"

type SendArgs = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  bcc?: string | string[]
}

/**
 * Sends an email via Resend. No-ops gracefully (returns ok:false) when
 * RESEND_API_KEY is not set, so callers never break.
 */
export async function sendEmail(
  args: SendArgs
): Promise<{ ok: boolean; error?: string }> {
  if (!KEY) return { ok: false, error: "Email not configured" }
  try {
    const resend = new Resend(KEY)
    const { error } = await resend.emails.send({
      from: FROM,
      to: args.to,
      bcc: args.bcc,
      subject: args.subject,
      html: args.html,
      text: args.text,
      replyTo: args.replyTo,
    })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Email failed" }
  }
}
