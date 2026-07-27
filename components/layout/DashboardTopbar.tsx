"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { LogOut, Menu, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { ROLE_META } from "@/constants/roles"
import DashboardNavList from "@/components/layout/DashboardNavList"
import ThemeToggle from "@/components/theme/ThemeToggle"
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
      {/* Sticky, and translucent so content scrolling underneath stays felt
          rather than being cut off by an opaque bar. */}
      <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-canopy/10 bg-white/85 px-4 backdrop-blur-md dark:border-white/10 dark:bg-canopy-900/85 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setNavOpen(true)}
            className="-ml-1 rounded-lg p-2 text-canopy transition-colors hover:bg-canopy-50 dark:text-paper dark:hover:bg-white/10 lg:hidden"
          >
            <Menu size={22} />
          </button>
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-canopy to-canopy-700 font-display text-xs font-semibold text-gold-300 ring-1 ring-gold-400/25">
            {initials(fullName)}
          </span>
          <div className="min-w-0 leading-tight">
            <p className="truncate text-sm font-semibold text-canopy dark:text-paper">
              {fullName}
            </p>
            <p className="truncate text-xs text-ink/50 dark:text-paper/50">
              {roleLabel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* The console has full dark styling but no way to reach it from
              inside — the only toggle lived on the public header. */}
          <ThemeToggle />
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 rounded-full border border-canopy/20 px-3 py-1.5 text-sm font-medium text-canopy transition-all hover:-translate-y-0.5 hover:border-canopy/35 hover:bg-canopy-50 dark:border-white/15 dark:text-paper dark:hover:bg-white/10 sm:px-4"
          >
            <LogOut size={16} aria-hidden />{" "}
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </header>

      {/* Mobile dashboard nav */}
      {navOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-canopy-900/60 backdrop-blur-sm"
            onClick={() => setNavOpen(false)}
          />
          <div className="canopy-texture absolute inset-y-0 left-0 flex w-72 max-w-[80%] animate-scale-in flex-col bg-gradient-to-b from-canopy via-canopy to-canopy-700 text-white/80 shadow-elevated">
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
            <div className="flex-1 overflow-y-auto px-3 py-5">
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
