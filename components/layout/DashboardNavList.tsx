"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DASHBOARD_NAV, ROLE_NAV_GROUPS } from "@/constants/dashboard"
import type { Role } from "@/types"
import { cn } from "@/lib/utils"

type Props = { role: Role; onNavigate?: () => void }

const GROUP_LABEL: Record<string, string> = {
  base: "Dashboard",
  apply: "Apply",
  member: "Member",
  cin: "Community Intelligence",
  mp: "Parliament",
  cabinet: "Cabinet",
  elder: "Advisory",
  admin: "Administration",
  content: "Content",
}

/**
 * Role-based dashboard nav groups. Shared by the desktop sidebar and the mobile
 * drawer so both stay in sync. Styled for a dark canopy surface.
 */
export default function DashboardNavList({ role, onNavigate }: Props) {
  const pathname = usePathname()
  const groups = ROLE_NAV_GROUPS[role] ?? ["base"]

  return (
    <nav className="space-y-6">
      {groups.map((group) => (
        <div key={group}>
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-gold-300/70">
            {GROUP_LABEL[group] ?? group}
          </p>
          <div className="space-y-0.5">
            {(DASHBOARD_NAV[group] ?? []).map((item) => {
              const active = pathname === item.href.split("#")[0]
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-white/[0.13] text-white"
                      : "text-white/60 hover:bg-white/[0.07] hover:text-white"
                  )}
                >
                  {/* Gold marker on the active row — a rounded pill rather than
                      a full-height inset border, so it reads as a bookmark. */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-gold-400 transition-all duration-200",
                      active ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <Icon
                    size={16}
                    aria-hidden
                    className={cn(
                      "shrink-0 transition-colors",
                      active
                        ? "text-gold-300"
                        : "text-white/45 group-hover:text-gold-300/80"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}
