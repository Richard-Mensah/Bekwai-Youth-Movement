"use client"

import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

type Props = { fullName: string; roleLabel: string; configured: boolean }

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
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-5">
      <div>
        <p className="text-sm font-semibold text-brand-green-700">{fullName}</p>
        <p className="text-xs text-gray-500">{roleLabel}</p>
      </div>
      <button
        onClick={signOut}
        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
      >
        <LogOut size={16} /> Sign out
      </button>
    </header>
  )
}
