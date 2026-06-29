import type { Role } from "@/types"

/** Human-friendly labels + the dashboard each role lands on. */
export const ROLE_META: Record<
  Role,
  { label: string; dashboard: string; description: string }
> = {
  public: {
    label: "Public",
    dashboard: "/",
    description: "Open access to the public transparency portal.",
  },
  member: {
    label: "Member",
    dashboard: "/dashboard/member",
    description: "Verified BYM member.",
  },
  volunteer: {
    label: "Community Volunteer",
    dashboard: "/dashboard/member",
    description: "Volunteer Action Team member.",
  },
  cin_officer: {
    label: "CIN Officer",
    dashboard: "/dashboard/cin",
    description: "Community Intelligence Officer: monthly reporting.",
  },
  mp: {
    label: "Parliament Member",
    dashboard: "/dashboard/mp",
    description: "Bekwai Youth Parliament Member.",
  },
  secretary: {
    label: "Cabinet Secretary",
    dashboard: "/dashboard/cabinet",
    description: "Executive Cabinet portfolio holder.",
  },
  elder: {
    label: "Traditional Elder",
    dashboard: "/dashboard/elder",
    description: "Traditional Advisory Council: read-only + endorsements.",
  },
  admin: {
    label: "Administrator",
    dashboard: "/dashboard/admin",
    description: "Manages members, vetting, and content.",
  },
  super_admin: {
    label: "Super Administrator",
    dashboard: "/dashboard/admin",
    description: "Full platform access and configuration.",
  },
}

export const ROLE_ORDER: Role[] = [
  "super_admin",
  "admin",
  "secretary",
  "mp",
  "elder",
  "cin_officer",
  "volunteer",
  "member",
  "public",
]
