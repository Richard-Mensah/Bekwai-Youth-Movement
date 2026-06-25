"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ROLE_META } from "@/constants/roles"
import DashboardNavList from "@/components/layout/DashboardNavList"
import type { Role } from "@/types"

type Props = {
  fullName: string
  roleLabel: string
  role: Role
  configured: boolean
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase() ?? "")
      .join("") || "BYM"
  )
}

export default function DashboardTopbar({
  fullName,
  roleLabel,
  role,
  configured,
}: Props) {
  const router = useRouter()
  const [navOpen, setNavOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = navOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [navOpen])

  async function signOut() {
    if (configured) {
      await createClient().auth.signOut()
    }
    router.push("/")
    router.refresh()
  }

  return (
    <>
      <header className="flex h-16 items-center justify-between border-b border-canopy/10 bg-white px-4 sm:px-5">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
            className="rounded-md p-1.5 text-canopy lg:hidden"
          >
            <Menu size={22} />
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-canopy font-display text-xs font-semibold text-gold-300">
            {initials(fullName)}
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-canopy">{fullName}</p>
            <p className="text-xs text-ink/50">{roleLabel}</p>
          </div>
        </div>
        <button
          onClick={signOut}
          className="inline-flex items-center gap-2 rounded-full border border-canopy/20 px-3 py-1.5 text-sm font-medium text-canopy transition-colors hover:bg-canopy-50 sm:px-4"
        >
          <LogOut size={16} /> <span className="hidden sm:inline">Sign out</span>
        </button>
      </header>

      {/* Mobile dashboard nav */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-canopy-900/50"
            onClick={() => setNavOpen(false)}
          />
          <div className="canopy-texture absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-canopy text-white/80">
            <div className="flex h-16 items-center justify-between border-b border-white/10 px-5">
              <span className="flex items-center gap-2.5">
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
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setNavOpen(false)}
                className="rounded-md p-1.5 text-white/70 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <DashboardNavList role={role} onNavigate={() => setNavOpen(false)} />
            </div>
            <div className="border-t border-white/10 px-5 py-4 text-[11px] uppercase tracking-wider text-white/45">
              Role · <span className="text-gold-300">{ROLE_META[role].label}</span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
