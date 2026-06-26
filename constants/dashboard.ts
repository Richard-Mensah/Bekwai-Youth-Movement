import type { Role } from "@/types"

export type NavItem = { label: string; href: string }

/** Sidebar nav per role. Shared items first, then role-specific. */
export const DASHBOARD_NAV: Record<string, NavItem[]> = {
  base: [
    { label: "Overview", href: "/dashboard" },
    { label: "Account", href: "/dashboard/account" },
  ],
  member: [
    { label: "My profile", href: "/dashboard/member" },
    { label: "My community", href: "/dashboard/member#community" },
  ],
  cin: [
    { label: "CIN overview", href: "/dashboard/cin" },
    { label: "My reports", href: "/dashboard/cin#reports" },
    { label: "Analytics", href: "/dashboard/cin/analytics" },
  ],
  mp: [
    { label: "Parliament", href: "/dashboard/mp" },
    { label: "Bills & motions", href: "/dashboard/mp#bills" },
  ],
  cabinet: [
    { label: "Cabinet", href: "/dashboard/cabinet" },
    { label: "Projects", href: "/dashboard/cabinet#projects" },
  ],
  elder: [{ label: "Advisory Council", href: "/dashboard/elder" }],
  admin: [
    { label: "Administration", href: "/dashboard/admin" },
    { label: "Members & vetting", href: "/dashboard/admin#members" },
    { label: "Compliance", href: "/dashboard/admin#compliance" },
    { label: "Inbox", href: "/dashboard/admin/inbox" },
    { label: "Transparency publishing", href: "/dashboard/admin/transparency" },
  ],
}

/** Which sidebar groups each role sees. */
export const ROLE_NAV_GROUPS: Record<Role, string[]> = {
  public: ["base"],
  member: ["base", "member"],
  volunteer: ["base", "member"],
  cin_officer: ["base", "cin"],
  mp: ["base", "mp"],
  secretary: ["base", "cabinet"],
  elder: ["base", "elder"],
  admin: ["base", "admin", "cin", "mp", "cabinet"],
  super_admin: ["base", "admin", "cin", "mp", "cabinet", "elder"],
}
