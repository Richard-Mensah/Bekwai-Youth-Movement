import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ROLE_META } from "@/constants/roles"
import DashboardNavList from "@/components/layout/DashboardNavList"
import type { Role } from "@/types"

type Props = { role: Role }

export default function Sidebar({ role }: Props) {
  return (
    <aside className="canopy-texture sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-white/[0.06] bg-gradient-to-b from-canopy via-canopy to-canopy-700 text-white/80 lg:flex">
      <Link
        href="/"
        className="flex h-16 shrink-0 items-center gap-2.5 border-b border-white/10 px-5 transition-colors hover:bg-white/[0.04]"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full ring-1 ring-gold-400/40">
          <Image
            src="/images/logo.jpg"
            alt=""
            width={32}
            height={32}
            className="rounded-full"
          />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-sm font-semibold leading-tight text-white">
            BYM Console
          </span>
          <span className="block text-[10px] uppercase tracking-[0.14em] text-gold-300/70">
            Youth General Assembly
          </span>
        </span>
      </Link>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <DashboardNavList role={role} />
      </div>

      <div className="shrink-0 border-t border-white/10 p-4">
        <div className="rounded-xl bg-white/[0.06] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/40">
            Signed in as
          </p>
          <p className="mt-0.5 truncate text-sm font-semibold text-gold-300">
            {ROLE_META[role].label}
          </p>
        </div>
        <Link
          href="/"
          className="mt-2 flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white"
        >
          View public site
          <ArrowUpRight size={13} aria-hidden />
        </Link>
      </div>
    </aside>
  )
}
