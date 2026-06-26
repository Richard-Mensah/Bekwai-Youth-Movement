import type { Role } from "@/types"
import { createClient } from "@/lib/supabase/server"

export type ContentResult = { ok: boolean; error?: string; id?: string }

export const NOT_READY: ContentResult = {
  ok: false,
  error: "Connect Supabase to manage content.",
}

/** Roles allowed to manage frontend content. */
export function canManageContent(role: Role): boolean {
  return role === "admin" || role === "super_admin" || role === "secretary"
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
