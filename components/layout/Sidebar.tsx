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
    <aside className="hidden w-60 shrink-0 border-r border-gray-200 bg-white lg:block">
      <div className="flex h-16 items-center gap-2.5 border-b border-gray-200 px-5">
        <Image
          src="/images/logo.jpg"
          alt="BYM"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="text-sm font-bold text-brand-green-700">
          BYM Console
        </span>
      </div>

      <nav className="space-y-5 p-4">
        {groups.map((group) => (
          <div key={group}>
            <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              {group === "base" ? "Dashboard" : group}
            </p>
            {(DASHBOARD_NAV[group] ?? []).map((item) => {
              const active = pathname === item.href.split("#")[0]
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "block rounded-md px-3 py-2 text-sm font-medium",
                    active
                      ? "bg-brand-green-50 text-brand-green-700"
                      : "text-gray-600 hover:bg-gray-50"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="mt-auto px-5 py-4 text-[11px] text-gray-400">
        Role: {ROLE_META[role].label}
      </div>
    </aside>
  )
}
