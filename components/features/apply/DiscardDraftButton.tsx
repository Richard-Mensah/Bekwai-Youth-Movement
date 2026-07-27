"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Trash2 } from "lucide-react"
import { discardDraft } from "@/app/dashboard/apply/actions"

/** Lets an applicant throw away an unfinished application they've abandoned. */
export default function DiscardDraftButton({ id }: { id: string }) {
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  if (error) {
    return <p className="text-xs text-brand-red">{error}</p>
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-ink/45 transition-colors hover:bg-brand-red/10 hover:text-brand-red dark:text-paper/45"
      >
        <Trash2 size={13} /> Discard
      </button>
    )
  }

  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-xs text-ink/60 dark:text-paper/60">Discard it?</span>
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await discardDraft(id)
            if (res.ok) router.refresh()
            else setError(res.error)
          })
        }
        className="inline-flex items-center gap-1 rounded-full bg-brand-red px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-red-600 disabled:opacity-60"
      >
        {pending && <Loader2 size={12} className="animate-spin" />}
        Yes
      </button>
      <button
        type="button"
        onClick={() => setConfirming(false)}
        className="rounded-full px-3 py-1.5 text-xs font-semibold text-ink/55 hover:bg-canopy/5 dark:text-paper/55 dark:hover:bg-white/5"
      >
        Keep
      </button>
    </span>
  )
}
