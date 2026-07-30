import { NextResponse, type NextRequest } from "next/server"
import { verifyWebhook } from "@/lib/webhook-signature"
import { buildAuthEmail, type EmailActionType } from "@/lib/auth-emails"
import { sendEmail, emailTransport } from "@/lib/email"
import { SITE_URL, absoluteUrl } from "@/lib/site"
import { safeNext } from "@/lib/auth-redirect"

/**
 * Supabase's Send Email Hook — every auth email, sent by us.
 *
 * With this hook enabled, Supabase stops sending auth mail entirely and posts
 * here instead (Email Provider enabled + Auth Hook enabled → "Auth Hook handles
 * email sending, SMTP not used"). Confirmation, password reset, magic link,
 * invitation and email-change all arrive through this one endpoint, and we send
 * them over BYM's own mail server via `lib/email.ts`.
 *
 * The link we build points at `/auth/callback`, which already knows how to
 * redeem a `token_hash` — that route needs no change, which is the reason this
 * whole feature is three small files.
 *
 * Failure policy is deliberate and inverted from most of this codebase. Almost
 * everywhere else email is best-effort and a failure is swallowed so it cannot
 * break the thing the member was doing. Here the email *is* the thing: a member
 * who never receives a confirmation cannot sign in at all. So a send failure
 * returns 500, which surfaces in Supabase's Auth logs and prompts a retry,
 * rather than a 200 that quietly loses the account.
 */

// nodemailer opens TCP sockets, which the Edge runtime has no API for. Without
// this the route builds and then fails at request time with a module error.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/** Hook payload. Only the fields we use are typed; Supabase sends more. */
type HookPayload = {
  user?: { email?: string | null }
  email_data?: {
    token?: string
    token_hash?: string
    token_new?: string
    token_hash_new?: string
    redirect_to?: string
    email_action_type?: string
    site_url?: string
  }
}

const HANDLED: ReadonlySet<string> = new Set<EmailActionType>([
  "signup",
  "recovery",
  "magiclink",
  "invite",
  "email_change",
  "reauthentication",
])

/** Enough of an address to correlate a log line with a member, not enough to
 *  turn the log into a mailing list. */
function maskEmail(email: string): string {
  const [name, domain] = email.split("@")
  if (!domain) return "***"
  return `${name.slice(0, 2)}***@${domain}`
}

/**
 * Where the confirmation link should point.
 *
 * `redirect_to` is whatever the client asked for at sign-up time. Supabase has
 * already checked it against the project's allow-list, so this is defence in
 * depth — but it is the difference between a bug in that allow-list being a
 * misconfiguration and being a phishing relay that sends from our own verified
 * domain. Anything not on our origin is discarded rather than corrected.
 */
function resolveActionUrl(
  redirectTo: string | undefined,
  type: string,
  tokenHash: string
): string {
  let base: URL
  try {
    base = new URL(redirectTo ?? "")
    if (base.origin !== new URL(SITE_URL).origin) throw new Error("foreign origin")
    // Keep only a same-site `next`, via the same validator the auth pages use.
    const next = safeNext(base.searchParams.get("next"))
    base = new URL(absoluteUrl("/auth/callback"))
    base.searchParams.set("next", next)
  } catch {
    base = new URL(absoluteUrl("/auth/callback"))
    base.searchParams.set("next", type === "recovery" ? "/reset-password" : "/dashboard")
  }

  base.searchParams.set("token_hash", tokenHash)
  base.searchParams.set("type", type)
  return base.toString()
}

export async function POST(request: NextRequest) {
  // The raw bytes, before any parsing — the signature covers exactly these, and
  // re-serialising a parsed object would change key order and fail every time.
  const rawBody = await request.text()

  const verified = verifyWebhook(
    rawBody,
    request.headers,
    process.env.SEND_EMAIL_HOOK_SECRET
  )
  if (!verified.ok) {
    // Logged in full so a misconfiguration is diagnosable; returned as a bare
    // 401 so a prober learns nothing about why they failed.
    console.error(`[auth-email] rejected: ${verified.reason}`)
    return new NextResponse("unauthorized", { status: 401 })
  }

  let payload: HookPayload
  try {
    payload = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: "malformed payload" }, { status: 400 })
  }

  const email = payload.user?.email
  const data = payload.email_data
  const type = data?.email_action_type

  if (!email || !type || !HANDLED.has(type)) {
    console.error(`[auth-email] unhandled action type: ${type ?? "none"}`)
    return NextResponse.json({ error: "unsupported action" }, { status: 400 })
  }

  if (emailTransport() === "none") {
    // Worth its own branch: a 500 here means "nobody configured SMTP", which is
    // a very different fix from "the mail server refused us".
    console.error("[auth-email] no mail transport configured — cannot send")
    return NextResponse.json({ error: "no mail transport" }, { status: 500 })
  }

  // email_change confirms the NEW address, so the token for it is the _new pair.
  const tokenHash =
    type === "email_change" ? data?.token_hash_new || data?.token_hash : data?.token_hash
  const token = (type === "email_change" ? data?.token_new : data?.token) ?? ""

  if (type !== "reauthentication" && !tokenHash) {
    console.error(`[auth-email] ${type}: no token_hash in payload`)
    return NextResponse.json({ error: "missing token" }, { status: 400 })
  }

  const actionUrl = resolveActionUrl(data?.redirect_to, type, tokenHash ?? "")
  const { subject, html, text } = buildAuthEmail(type as EmailActionType, actionUrl, token)

  const result = await sendEmail({ to: email, subject, html, text })

  if (!result.ok) {
    console.error(`[auth-email] ${type} to ${maskEmail(email)} FAILED: ${result.error}`)
    // 500 so Supabase records it and retries. A duplicate confirmation is a
    // nuisance; a missing one is a member who cannot get in.
    return NextResponse.json({ error: result.error ?? "send failed" }, { status: 500 })
  }

  console.log(`[auth-email] ${type} sent to ${maskEmail(email)}`)

  // Empty 200 is the documented success contract for this hook.
  return new NextResponse(null, { status: 200 })
}

/** Anything other than POST is not this endpoint's business. */
export async function GET() {
  return new NextResponse("method not allowed", { status: 405 })
}
