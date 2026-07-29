import { Resend } from "resend"

const KEY = process.env.RESEND_API_KEY
const FROM = process.env.EMAIL_FROM ?? "Bekwai Youth Movement <onboarding@resend.dev>"

/** True when a Resend API key is configured. */
export function emailEnabled(): boolean {
  return Boolean(KEY)
}

/**
 * Where the Secretariat receives notifications (new applications, contact
 * messages). This is a recipient, not a sender: Resend can only send FROM a
 * domain you have verified by DNS, which a gmail.com address can never be —
 * so EMAIL_FROM stays a verified domain (or the resend.dev sandbox) while
 * mail is delivered here.
 */
export const ADMIN_EMAIL =
  process.env.EMAIL_ADMIN ?? "rmensahuk@gmail.com"

type SendArgs = {
  to: string | string[]
  subject: string
  html: string
  text?: string
  replyTo?: string
  bcc?: string | string[]
}

/** Recipients, flattened and truncated — never log a full BCC list. */
function describeTo(to: string | string[]): string {
  const list = Array.isArray(to) ? to : [to]
  return list.length > 1 ? `${list[0]} (+${list.length - 1} more)` : list[0]
}

/**
 * Sends an email via Resend. No-ops gracefully (returns ok:false) when
 * RESEND_API_KEY is not set, so callers never break.
 *
 * Most callers treat email as best-effort and ignore the result, so a real
 * delivery failure — an unverified sending domain, a rejected recipient, a
 * rate limit — would otherwise vanish without trace. Failures are logged here,
 * at the boundary, so they surface in the platform's runtime logs no matter
 * which call site triggered them. A missing API key is not an error: that is
 * the documented "email is switched off" state.
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
    if (error) {
      console.error(
        `[email] send failed to ${describeTo(args.to)} — "${args.subject}": ${error.message}`
      )
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Email failed"
    console.error(
      `[email] threw sending to ${describeTo(args.to)} — "${args.subject}": ${message}`
    )
    return { ok: false, error: message }
  }
}
