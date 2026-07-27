import {
  BarChart3,
  Briefcase,
  CalendarDays,
  ClipboardList,
  Compass,
  Crown,
  FileCheck,
  FileImage,
  FileText,
  FolderKanban,
  Handshake,
  History,
  Images,
  Landmark,
  LayoutDashboard,
  LayoutTemplate,
  Mail,
  MapPin,
  MapPinned,
  Newspaper,
  Quote,
  Radar,
  Receipt,
  Scale,
  Settings,
  ShieldCheck,
  User,
  UserCheck,
  UserCog,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react"
import type { Role } from "@/types"

export type NavItem = { label: string; href: string; icon: LucideIcon }

/**
 * Sidebar nav per role. Shared items first, then role-specific.
 *
 * Every item carries an icon: with eleven entries under Content alone, a
 * column of same-weight text is slow to scan, and the icon is what the eye
 * actually returns to once someone knows the console.
 */
export const DASHBOARD_NAV: Record<string, NavItem[]> = {
  base: [
    { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { label: "Account", href: "/dashboard/account", icon: UserCog },
  ],
  // Open to every role — a sitting MP may still apply for a Cabinet office.
  apply: [
    { label: "My applications", href: "/dashboard/apply", icon: FileText },
    { label: "Browse offices", href: "/dashboard/apply/roles", icon: Compass },
  ],
  member: [
    { label: "My profile", href: "/dashboard/member", icon: User },
    { label: "My community", href: "/dashboard/member#community", icon: MapPin },
  ],
  cin: [
    { label: "CIN overview", href: "/dashboard/cin", icon: Radar },
    { label: "My reports", href: "/dashboard/cin#reports", icon: ClipboardList },
    { label: "Analytics", href: "/dashboard/cin/analytics", icon: BarChart3 },
  ],
  mp: [
    { label: "Parliament", href: "/dashboard/mp", icon: Landmark },
    { label: "Bills & motions", href: "/dashboard/mp#bills", icon: Scale },
  ],
  cabinet: [
    { label: "Cabinet", href: "/dashboard/cabinet", icon: Briefcase },
    {
      label: "Projects",
      href: "/dashboard/cabinet#projects",
      icon: FolderKanban,
    },
  ],
  elder: [{ label: "Advisory Council", href: "/dashboard/elder", icon: Crown }],
  admin: [
    { label: "Administration", href: "/dashboard/admin", icon: ShieldCheck },
    {
      label: "Applications pipeline",
      href: "/dashboard/admin/applications",
      icon: Workflow,
    },
    {
      label: "Members & vetting",
      href: "/dashboard/admin#members",
      icon: UserCheck,
    },
    {
      label: "Members directory",
      href: "/dashboard/admin/members",
      icon: Users,
    },
    {
      label: "Compliance",
      href: "/dashboard/admin#compliance",
      icon: FileCheck,
    },
    { label: "Inbox", href: "/dashboard/admin/inbox", icon: Mail },
    {
      label: "Transparency publishing",
      href: "/dashboard/admin/transparency",
      icon: Receipt,
    },
  ],
  content: [
    {
      label: "Content Studio",
      href: "/dashboard/admin/content",
      icon: LayoutTemplate,
    },
    {
      label: "Posts & Blog",
      href: "/dashboard/admin/content/posts",
      icon: Newspaper,
    },
    {
      label: "Leadership",
      href: "/dashboard/admin/content/leaders",
      icon: Users,
    },
    { label: "Gallery", href: "/dashboard/admin/content/gallery", icon: Images },
    {
      label: "Events",
      href: "/dashboard/admin/content/events",
      icon: CalendarDays,
    },
    {
      label: "Partners",
      href: "/dashboard/admin/content/partners",
      icon: Handshake,
    },
    {
      label: "Member voices",
      href: "/dashboard/admin/content/testimonials",
      icon: Quote,
    },
    {
      label: "Communities",
      href: "/dashboard/admin/content/communities",
      icon: MapPinned,
    },
    {
      label: "Site settings",
      href: "/dashboard/admin/content/settings",
      icon: Settings,
    },
    {
      label: "Media library",
      href: "/dashboard/admin/content/media",
      icon: FileImage,
    },
    {
      label: "Activity log",
      href: "/dashboard/admin/content/audit",
      icon: History,
    },
  ],
}

/** Which sidebar groups each role sees. */
export const ROLE_NAV_GROUPS: Record<Role, string[]> = {
  public: ["base", "apply"],
  member: ["base", "apply", "member"],
  volunteer: ["base", "apply", "member"],
  cin_officer: ["base", "apply", "cin"],
  mp: ["base", "apply", "mp"],
  secretary: ["base", "apply", "content", "cabinet"],
  elder: ["base", "apply", "elder"],
  admin: ["base", "apply", "admin", "content", "cin", "mp", "cabinet"],
  super_admin: [
    "base",
    "apply",
    "admin",
    "content",
    "cin",
    "mp",
    "cabinet",
    "elder",
  ],
}
