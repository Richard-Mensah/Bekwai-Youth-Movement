import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { safeNext } from "@/lib/auth-redirect"

/**
 * The landing point for every link Supabase emails us — confirm-your-signup,
 * password reset, magic link, email change.
 *
 * Until this route existed, `emailRedirectTo` pointed straight at /dashboard.
 * That address is a page, not an exchange point: `@supabase/ssr` defaults to the
 * PKCE flow, so Supabase appended a `?code=` that nothing ever redeemed, the
 * middleware saw a request with no session and bounced the member to /login.
 * The account was confirmed and the person was still locked out.
 *
 * Two link shapes have to be honoured, because which one arrives depends on the
 * email template rather than on us:
 *
 *  - `?code=…` — PKCE. The verifier is in a cookie this route can read, which
 *    means the link only works in the browser that started the sign-up.
 *  - `?token_hash=…&type=…` — a one-time token carrying its own proof, so it
 *    works anywhere. This is the one that saves the member who registers on a
 *    laptop and opens their mail on their phone.
 *
 * Handling both here means the templates can change without breaking sign-in.
 */

/** Redeemable link types. Anything else is not ours and is refused. */
const OTP_TYPES = new Set<string>([
  "signup",
  "invite",
  "magiclink",
  "recovery",
  "email_change",
  "email",
])

/** Send failures back to sign-in, where the message can be shown in context. */
function toLogin(request: NextRequest, message: string) {
  const url = new URL("/login", request.nextUrl.origin)
  url.searchParams.set("error", message)
  return NextResponse.redirect(url)
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams
  const next = safeNext(params.get("next"))

  // Supabase reports a refused link (expired, already used) on the redirect
  // itself rather than by failing the exchange, so check that first.
  const linkError = params.get("error_description") ?? params.get("error")
  if (linkError) return toLogin(request, linkError)

  const code = params.get("code")
  const tokenHash = params.get("token_hash")
  const type = params.get("type")

  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return toLogin(request, error.message)
  } else if (tokenHash && type && OTP_TYPES.has(type)) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as EmailOtpType,
      token_hash: tokenHash,
    })
    if (error) return toLogin(request, error.message)
  } else {
    return toLogin(
      request,
      "That confirmation link is incomplete. Please open the most recent email we sent you."
    )
  }

  // The session cookies were written onto this response by the server client,
  // so the redirect below carries them and `next` loads signed in.
  return NextResponse.redirect(new URL(next, request.nextUrl.origin))
}
