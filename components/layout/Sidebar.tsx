"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { DASHBOARD_NAV, ROLE_NAV_GROUPS } from "@/constants/dashboard"
import { ROLE_META } from "@/constants/roles"
import type { Role } from "@/types"
import { cn } from "@/lib/utils"

type Props = { role: Role }

export default function Sidebar({ role }: Props) {
  const pathname = usePathname()
  const groups = ROLE_NAV_GROUPS[role] ?? ["base"]

  return (
    <aside className="canopy-texture hidden w-64 shrink-0 flex-col bg-canopy text-white/80 lg:flex">
      <div className="flex h-16 items-center gap-2.5 border-b border-white/10 px-5">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-gold-400/40">
          <Image
            src="/images/logo.jpg"
            alt="BYM"
            width={32}
            height={32}
            className="rounded-full"
          />
        </span>
        <span className="font-display text-sm font-semibold text-white">
          BYM Console
        </span>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
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

      <div className="border-t border-white/10 px-5 py-4 text-[11px] uppercase tracking-wider text-white/45">
        Role · <span className="text-gold-300">{ROLE_META[role].label}</span>
      </div>
    </aside>
  )
}
