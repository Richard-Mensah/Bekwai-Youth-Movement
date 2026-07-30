import "server-only"

import nodemailer, { type Transporter } from "nodemailer"
import { Resend } from "resend"

/**
 * The app's outbound email, over BYM's own mail server.
 *
 * Two transports, tried in that order:
 *
 *  1. **SMTP** (`SMTP_HOST` set) — `nodemailer` straight to BYM's own cPanel mail
 *     server. Preferred, and the reason is not ideology: mail leaves an address
 *     the movement controls, there is no third-party quota to exhaust mid-drive,
 *     and no account elsewhere that can be suspended and take registration with
 *     it. It is also the same server Supabase Auth should be pointed at, so
 *     auth mail and app mail finally travel one path.
 *  2. **Resend** (`RESEND_API_KEY` set, no SMTP) — kept as a fallback so nothing
 *     that worked before stops working, and so a broken mail server can be
 *     routed around in one environment variable.
 *
 * Neither configured is a supported state, not an error: `emailEnabled()` is
 * false, every caller degrades gracefully, and registration is unaffected.
 *
 * `server-only` because a bundled SMTP password is a leaked SMTP password.
 */

const RESEND_KEY = process.env.RESEND_API_KEY?.trim() || undefined

const SMTP_HOST = process.env.SMTP_HOST?.trim() || undefined
const SMTP_PORT = Number(process.env.SMTP_PORT ?? 465)
const SMTP_USER = process.env.SMTP_USER?.trim() || undefined
const SMTP_PASS = process.env.SMTP_PASS || undefined
/**
 * Implicit TLS from the first byte (port 465) vs STARTTLS upgrade (587).
 * Inferred from the port rather than asked for, because the two are always
 * paired in practice and a mismatch produces a connection that simply hangs.
 */
const SMTP_SECURE =
  process.env.SMTP_SECURE?.trim() === "true" ||
  (process.env.SMTP_SECURE === undefined && SMTP_PORT === 465)

const FROM =
  process.env.EMAIL_FROM ?? "Bekwai Youth Movement <onboarding@resend.dev>"

/** Which transport a send will actually use. */
export function emailTransport(): "smtp" | "resend" | "none" {
  if (SMTP_HOST && SMTP_USER && SMTP_PASS) return "smtp"
  if (RESEND_KEY) return "resend"
  return "none"
}

/** True when email can be sent at all. */
export function emailEnabled(): boolean {
  return emailTransport() !== "none"
}

/**
 * Where the Secretariat receives notifications (new applications, contact
 * messages). This is a recipient, not a sender: Resend can only send FROM a
 * domain you have verified by DNS, which a gmail.com address can never be —
 * so EMAIL_FROM stays a verified domain (or the resend.dev sandbox) while
 * mail is delivered here.
 */
export const ADMIN_EMAIL = process.env.EMAIL_ADMIN ?? "rmensahuk@gmail.com"

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
 * One transporter for the lifetime of the server process.
 *
 * `pool: true` keeps connections open and reuses them. That matters for a
 * registration drive: a shared cPanel host counts *connections* as well as
 * messages, and opening a fresh TLS session per email is both slow and the
 * fastest way to trip an abuse limit mid-drive.
 */
let transporter: Transporter | null = null

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: { user: SMTP_USER!, pass: SMTP_PASS! },
      pool: true,
      maxConnections: 3,
      maxMessages: 50,
      // A shared host under load can be slow to greet. Fail in ten seconds
      // rather than holding a serverless invocation open until it is killed.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    })
  }
  return transporter
}

/**
 * Sends an email. No-ops gracefully (returns ok:false) when no transport is
 * configured, so callers never break.
 *
 * Most callers treat email as best-effort and ignore the result, so a real
 * delivery failure — a wrong password, a rejected recipient, a rate limit —
 * would otherwise vanish without trace. Failures are logged here, at the
 * boundary, so they surface in the platform's runtime logs no matter which call
 * site triggered them. No transport configured is not an error: that is the
 * documented "email is switched off" state.
 */
export async function sendEmail(
  args: SendArgs
): Promise<{ ok: boolean; error?: string }> {
  const transport = emailTransport()
  if (transport === "none") return { ok: false, error: "Email not configured" }

  try {
    if (transport === "smtp") {
      const info = await getTransporter().sendMail({
        from: FROM,
        to: args.to,
        bcc: args.bcc,
        subject: args.subject,
        html: args.html,
        text: args.text,
        replyTo: args.replyTo,
      })

      // SMTP can accept a message for some recipients and refuse others in the
      // same transaction. Treated as success, a broadcast would silently reach
      // half its audience.
      if (info.rejected?.length) {
        const message = `rejected ${info.rejected.length} recipient(s)`
        console.error(
          `[email] smtp partial failure to ${describeTo(args.to)} — "${args.subject}": ${message}`
        )
        return { ok: false, error: message }
      }
      return { ok: true }
    }

    const { error } = await new Resend(RESEND_KEY).emails.send({
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
        `[email] resend failed to ${describeTo(args.to)} — "${args.subject}": ${error.message}`
      )
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Email failed"
    console.error(
      `[email] ${transport} threw sending to ${describeTo(args.to)} — "${args.subject}": ${message}`
    )
    return { ok: false, error: message }
  }
}

/**
 * Proves the SMTP credentials work without sending anything.
 *
 * Worth having as its own function because the alternative way to discover a
 * wrong password is a member who never got their welcome email — a failure that
 * surfaces days later and looks like a delivery problem rather than a
 * configuration one. `verify()` performs the full connect-and-authenticate
 * handshake and stops there.
 */
export async function verifyEmailTransport(): Promise<{
  ok: boolean
  transport: ReturnType<typeof emailTransport>
  detail: string
}> {
  const transport = emailTransport()
  if (transport === "none") {
    return { ok: false, transport, detail: "No transport configured." }
  }
  if (transport === "resend") {
    return { ok: true, transport, detail: "Resend API key present (not dialled)." }
  }
  try {
    await getTransporter().verify()
    return {
      ok: true,
      transport,
      detail: `Connected and authenticated to ${SMTP_HOST}:${SMTP_PORT} as ${SMTP_USER}.`,
    }
  } catch (e) {
    return {
      ok: false,
      transport,
      detail: e instanceof Error ? e.message : "SMTP verify failed",
    }
  }
}
