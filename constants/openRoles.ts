import { ARM_META, OFFICES, officeByTitle } from "@/constants/offices"
import type { RoleArm } from "@/constants/offices"

/**
 * Roles open for application, grouped by governance arm, for the leadership
 * application flow. Derived from the office catalogue in `constants/offices.ts`
 * so the dropdown, the role catalogue and server-side validation can never
 * drift apart. The Traditional Advisory Council is honorary (appointed, not
 * applied for) and is excluded there.
 */
export type { RoleArm }

export type OpenRoleGroup = {
  arm: RoleArm
  label: string
  roles: string[]
}

const ARM_ORDER: RoleArm[] = ["cabinet", "parliament", "cin", "community"]

export const OPEN_ROLE_GROUPS: OpenRoleGroup[] = ARM_ORDER.map((arm) => ({
  arm,
  label: ARM_META[arm].label,
  // Cabinet runs Director-General down to the last office; the other arms
  // follow their own constitutional order.
  roles: OFFICES.filter((o) => o.arm === arm).map((o) => o.title),
}))

/** Flat set of every valid role title, for server-side validation. */
export const OPEN_ROLE_TITLES: string[] = OFFICES.map((o) => o.title)

/** Maps a role title back to its arm (falls back to undefined if unknown). */
export function armForRole(title: string): RoleArm | undefined {
  return officeByTitle(title)?.arm
}

/** Maps a role title to its catalogue slug, for linking to the role page. */
export function slugForRole(title: string): string | undefined {
  return officeByTitle(title)?.slug
}
