/**
 * Header the middleware stamps on every request so server components can tell
 * which path is being rendered. A layout has no other way to know this, and the
 * dashboard layout needs it to decide whether the verification gate applies.
 *
 * The middleware always overwrites it, so a client cannot forge the value to
 * slip past the gate.
 */
export const PATHNAME_HEADER = "x-bym-pathname"

/**
 * Areas a member may use before an administrator has verified their membership.
 *
 * Applying for office is deliberately open: someone joins BYM in order to
 * stand for a role, and making them wait on a manual approval before they can
 * even read the role catalogue turns an eager volunteer away at the door. The
 * Secretariat still reviews the application itself — vetting happens there,
 * where it belongs, not at the front gate. Account is open so a pending member
 * can correct the details the administrator is about to check.
 *
 * Everything else — the role dashboards, Parliament, CIN, admin — stays closed
 * until verification, because those grant standing within the Movement.
 */
const OPEN_WHILE_PENDING = ["/dashboard/apply", "/dashboard/account"]

export function openWhilePending(pathname: string): boolean {
  return OPEN_WHILE_PENDING.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  )
}
