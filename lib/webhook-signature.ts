import "server-only"

import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * Standard Webhooks signature verification.
 *
 * This is the only thing standing between the internet and an endpoint that
 * sends email from BYM's verified domain. Without it, anyone who found the URL
 * could post a payload and have us mail an arbitrary address — a spam relay
 * wearing our name, which is the fastest way to lose a sending reputation that
 * took DNS records and a domain purchase to build.
 *
 * Implemented against the spec rather than pulled from a package: it is thirty
 * lines of HMAC, and a dependency that can send mail on our behalf is a strange
 * thing to add to reduce thirty lines.
 *
 * The scheme (https://www.standardwebhooks.com):
 *
 *   signed content = `{webhook-id}.{webhook-timestamp}.{raw body}`
 *   signature      = base64( HMAC-SHA256( base64decode(secret), signed content ) )
 *
 * Supabase presents the secret as `v1,whsec_<base64>`; only the base64 tail is
 * the key, and it must be *decoded* before use. Signing the ASCII of the secret
 * instead is the classic failure here — it produces a stable, plausible-looking
 * signature that never matches, and looks like a Supabase bug rather than ours.
 */

/** How far a timestamp may be from now. Bounds the window in which a captured
 *  request can be replayed. */
const TOLERANCE_SECONDS = 5 * 60

export type VerifyResult =
  | { ok: true }
  | { ok: false; reason: string }

/** Constant-time compare that does not leak the answer through its own timing.
 *  `timingSafeEqual` throws on unequal lengths, which would itself be a signal,
 *  so length is checked first and separately. */
function safeEqual(a: Buffer, b: Buffer): boolean {
  return a.length === b.length && timingSafeEqual(a, b)
}

/**
 * Verifies a Standard Webhooks request.
 *
 * `rawBody` must be the exact bytes received — `await request.text()`, never a
 * parsed object re-serialised. `JSON.parse` followed by `JSON.stringify` is not
 * a round trip: key order, whitespace and number formatting can all differ, and
 * every signature would fail for a reason that looks like a wrong secret.
 */
export function verifyWebhook(
  rawBody: string,
  headers: Headers,
  secret: string | undefined
): VerifyResult {
  if (!secret) return { ok: false, reason: "hook secret not configured" }

  const id = headers.get("webhook-id")
  const timestamp = headers.get("webhook-timestamp")
  const signatureHeader = headers.get("webhook-signature")
  if (!id || !timestamp || !signatureHeader) {
    return { ok: false, reason: "missing webhook headers" }
  }

  const sent = Number(timestamp)
  if (!Number.isFinite(sent)) {
    return { ok: false, reason: "malformed timestamp" }
  }
  const drift = Math.abs(Math.floor(Date.now() / 1000) - sent)
  if (drift > TOLERANCE_SECONDS) {
    return { ok: false, reason: `timestamp outside tolerance (${drift}s)` }
  }

  // `v1,whsec_<base64>` — take the tail, and decode it. Supabase shows the whole
  // string in the dashboard, so it gets pasted whole into the environment.
  const key = Buffer.from(secret.replace(/^v1,whsec_/, ""), "base64")
  if (key.length === 0) return { ok: false, reason: "hook secret is not base64" }

  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest()

  // The header carries a space-delimited list, so more than one key can be live
  // at once. Accepting any match is what makes rotating the secret a change with
  // no outage in the middle of it.
  for (const entry of signatureHeader.split(" ")) {
    const [version, value] = entry.split(",")
    if (version !== "v1" || !value) continue
    if (safeEqual(expected, Buffer.from(value, "base64"))) return { ok: true }
  }

  return { ok: false, reason: "no matching signature" }
}
