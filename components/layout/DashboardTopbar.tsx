"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Props = { fullName: string; roleLabel: string; configured: boolean }

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

export default function DashboardTopbar({ fullName, roleLabel, configured }: Props) {
  const router = useRouter()

  async function signOut() {
    if (configured) {
      await createClient().auth.signOut()
    }
    router.push("/")
    router.refresh()
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-canopy/10 bg-white px-5">
      <div className="flex items-center gap-3">
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
        className="inline-flex items-center gap-2 rounded-full border border-canopy/20 px-4 py-1.5 text-sm font-medium text-canopy transition-colors hover:bg-canopy-50"
      >
        <LogOut size={16} /> Sign out
      </button>
    </header>
  )
}
