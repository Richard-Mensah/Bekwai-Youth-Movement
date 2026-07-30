import type { Role } from "@/types"
import { createClient } from "@/lib/supabase/server"
import { getSessionProfile } from "@/lib/auth"

export type ContentResult = { ok: boolean; error?: string; id?: string }

export const NOT_READY: ContentResult = {
  ok: false,
  error: "Connect Supabase to manage content.",
}

/** Roles allowed to manage frontend content. */
export function canManageContent(role: Role): boolean {
  return role === "admin" || role === "super_admin" || role === "secretary"
}

/**
 * Roles that may confer standing in the Movement — verify a membership, confirm
 * or change the address someone signs in with.
 *
 * Narrower than `canManageContent` on purpose, and the narrowness is not a
 * preference: it is what the database will actually honour. Every relevant RLS
 * policy and the 0021 privilege-guard trigger key off `is_admin()`, which is
 * `role in ('admin','super_admin')` — `secretary` is not in it. Left to
 * `canManageContent`, a secretary would pass the app's gate, reach the members
 * console, click Verify, and change nothing: RLS filters the row out rather than
 * rejecting it, so Supabase returns no error and the UI reports success. A
 * refusal they can read beats a button that lies.
 *
 * Widening `is_admin()` to include secretaries would also work, but it is used
 * by policies on every table in the schema, so it would quietly hand a secretary
 * write access to all of them. Standing is the narrower thing to gate.
 */
export function canVerifyMembers(role: Role): boolean {
  return role === "admin" || role === "super_admin"
}

/** As `assertSecretariat`, for the actions that confer standing. */
export async function assertMemberAdmin(): Promise<ContentResult | null> {
  const session = await getSessionProfile()
  if (!session.userId || !canVerifyMembers(session.role)) {
    return {
      ok: false,
      error:
        "Only an administrator can verify memberships or change a member's sign-in address.",
    }
  }
  return null
}

/**
 * Refuses the call unless the signed-in user is Secretariat. Returns null when
 * they are, or the `ContentResult` to hand straight back when they are not.
 *
 * Required in any action that uses the service-role client, and only there. The
 * ordinary actions in this codebase are already safe without it: they go through
 * the anon-key client carrying the member's own session, so an over-reaching
 * write is refused by RLS. A service-role write has no such backstop — RLS is
 * skipped entirely — and `app/dashboard/admin/layout.tsx` cannot cover the gap,
 * because a Server Action is its own POST endpoint that no layout runs for. So
 * the check has to be in the action, and it has to be on the server.
 */
export async function assertSecretariat(): Promise<ContentResult | null> {
  const session = await getSessionProfile()
  if (!session.userId || !canManageContent(session.role)) {
    // Deliberately the same wording whoever asks: a member probing this endpoint
    // learns only that they cannot use it.
    return { ok: false, error: "You do not have permission to do that." }
  }
  return null
}

/** Best-effort audit-trail row. Never throws. */
export async function audit(
  entity: string,
  entityId: string | null,
  action: string,
  summary?: string
): Promise<void> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    await supabase.from("content_audit").insert({
      actor_id: user?.id ?? null,
      entity,
      entity_id: entityId,
      action,
      summary: summary ?? null,
    })
  } catch {
    // auditing must never break the action
  }
}

/** Builds a URL-safe slug from a title. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
}
