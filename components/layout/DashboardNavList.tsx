"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { DASHBOARD_NAV, ROLE_NAV_GROUPS } from "@/constants/dashboard"
import type { Role } from "@/types"
import { cn } from "@/lib/utils"

type Props = { role: Role; onNavigate?: () => void }

/** Role-based dashboard nav groups. Shared by the desktop sidebar and the
 * mobile drawer so both stay in sync. Styled for a dark canopy surface. */
export default function DashboardNavList({ role, onNavigate }: Props) {
  const pathname = usePathname()
  const groups = ROLE_NAV_GROUPS[role] ?? ["base"]

  return (
    <nav className="space-y-5">
      {groups.map((group) => (
        <div key={group}>
          <p className="px-2 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-gold-300/80">
            {group === "base" ? "Dashboard" : group}
          </p>
          {(DASHBOARD_NAV[group] ?? []).map((item) => {
            const active = pathname === item.href.split("#")[0]
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white shadow-[inset_2px_0_0_0_theme(colors.gold.400)]"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
