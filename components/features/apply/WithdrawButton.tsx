"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { withdrawApplication } from "@/app/dashboard/apply/actions"

export default function WithdrawButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-xs font-semibold text-ink/45 underline-offset-2 hover:text-brand-red hover:underline dark:text-paper/45"
      >
        Withdraw this application
      </button>
    )
  }

  return (
    <div className="rounded-xl border border-brand-red/25 bg-brand-red/5 p-4">
      <p className="text-sm text-ink/75 dark:text-paper/75">
        Withdraw this application? The Secretariat will stop considering it. You
        can always apply again later.
      </p>
      {error && <p className="mt-2 text-xs text-brand-red">{error}</p>}
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            start(async () => {
              const res = await withdrawApplication(id)
              if (res.ok) router.refresh()
              else setError(res.error)
            })
          }
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-red px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-red-600 disabled:opacity-60"
        >
          {pending && <Loader2 size={12} className="animate-spin" />}
          Yes, withdraw
        </button>
        <button
          type="button"
          onClick={() => setConfirming(false)}
          className="rounded-full px-4 py-1.5 text-xs font-semibold text-ink/60 hover:bg-canopy/5 dark:text-paper/60 dark:hover:bg-white/5"
        >
          Keep it
        </button>
      </div>
    </div>
  )
}
