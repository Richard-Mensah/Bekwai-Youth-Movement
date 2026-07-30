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
