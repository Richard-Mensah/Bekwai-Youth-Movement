import Image from "next/image"
import { ROLE_META } from "@/constants/roles"
import DashboardNavList from "@/components/layout/DashboardNavList"
import type { Role } from "@/types"

type Props = { role: Role }

export default function Sidebar({ role }: Props) {
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

      <div className="flex-1 overflow-y-auto p-4">
        <DashboardNavList role={role} />
      </div>

      <div className="border-t border-white/10 px-5 py-4 text-[11px] uppercase tracking-wider text-white/45">
        Role · <span className="text-gold-300">{ROLE_META[role].label}</span>
      </div>
    </aside>
  )
}
