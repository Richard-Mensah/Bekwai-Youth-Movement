import { CABINET_POSITIONS } from "@/constants/cabinet"
import { LEADERSHIP_TIERS } from "@/constants/leadership"

/**
 * Roles open for application, grouped by governance arm, for the public
 * "Apply for a leadership role" form. Derived from the canonical role data so
 * the list stays in sync with the Cabinet, Parliament, and CIN definitions.
 * The Traditional Advisory Council is honorary (appointed, not applied for)
 * and is deliberately excluded.
 */
export type RoleArm = "cabinet" | "parliament" | "cin" | "community"

export type OpenRoleGroup = {
  arm: RoleArm
  label: string
  roles: string[]
}

const parliamentTier = LEADERSHIP_TIERS.find((t) => t.id === "parliament")
const cinTier = LEADERSHIP_TIERS.find((t) => t.id === "cin")

export const OPEN_ROLE_GROUPS: OpenRoleGroup[] = [
  {
    arm: "cabinet",
    label: "Civic Cabinet (Executive)",
    // Director-General down to the last Cabinet office.
    roles: CABINET_POSITIONS.map((p) => p.title),
  },
  {
    arm: "parliament",
    label: "Bekwai Youth Parliament (Legislature)",
    roles: (parliamentTier?.members ?? []).map((m) => m.title),
  },
  {
    arm: "cin",
    label: "Community Intelligence Network",
    roles: cinTier?.members.map((m) => m.title) ?? [],
  },
  {
    arm: "community",
    label: "Community-level seats",
    roles: [
      "Youth MP (ages 10–45)",
      "Community Council Representative (18–45)",
      "CIN Officer — Community (18+)",
    ],
  },
]

/** Flat set of every valid role title, for server-side validation. */
export const OPEN_ROLE_TITLES: string[] = OPEN_ROLE_GROUPS.flatMap((g) => g.roles)

/** Maps a role title back to its arm (falls back to undefined if unknown). */
export function armForRole(title: string): RoleArm | undefined {
  return OPEN_ROLE_GROUPS.find((g) => g.roles.includes(title))?.arm
}
