/**
 * Where to send someone once they are signed in.
 *
 * `next` arrives from the query string, so it is attacker-controlled: an
 * absolute URL here would turn our own sign-in page into an open redirect, and
 * a protocol-relative `//evil.example` is an absolute URL that merely looks
 * relative. Only a single-slash path survives.
 *
 * The fallback differs by caller — signup passes "" so it can tell "no
 * destination was asked for" apart from "/dashboard was asked for" — so it is a
 * parameter rather than a constant.
 */
export function safeNext(v: string | null | undefined, fallback = "/dashboard"): string {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : fallback
}
