"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Star } from "lucide-react"
import {
  ADMIN_PIPELINE,
  CLOSED_STATUSES,
  statusMeta,
} from "@/constants/applications"
import { saveReview, setApplicationStatus } from "../actions"
import { cn } from "@/lib/utils"

type Props = {
  id: string
  status: string
  reviewerNotes: string | null
  score: number | null
}

/** Vetting Panel controls: move the stage (with a note) and record a score. */
export default function ReviewPanel({
  id,
  status,
  reviewerNotes,
  score,
}: Props) {
  const [nextStatus, setNextStatus] = useState(status)
  const [note, setNote] = useState("")
  const [notes, setNotes] = useState(reviewerNotes ?? "")
  const [stars, setStars] = useState<number | null>(score)
  const [error, setError] = useState<string | null>(null)
  const [savedAt, setSavedAt] = useState<"stage" | "review" | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  function moveStage() {
    setError(null)
    setSavedAt(null)
    start(async () => {
      const res = await setApplicationStatus(id, nextStatus, note)
      if (!res.ok) setError(res.error ?? "Could not update the stage.")
      else {
        setNote("")
        setSavedAt("stage")
        router.refresh()
      }
    })
  }

  function persistReview() {
    setError(null)
    setSavedAt(null)
    start(async () => {
      const res = await saveReview(id, notes, stars)
      if (!res.ok) setError(res.error ?? "Could not save your review.")
      else {
        setSavedAt("review")
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Stage */}
      <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
        <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
          Move this application
        </h2>
        <p className="mt-0.5 text-xs text-ink/50 dark:text-paper/50">
          The applicant sees the new stage on their tracker, and is emailed.
        </p>

        <label htmlFor="next-stage" className="mt-4 block text-sm font-medium text-ink/75 dark:text-paper/75">
          Stage
        </label>
        <select
          id="next-stage"
          value={nextStatus}
          onChange={(e) => setNextStatus(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-700 dark:text-paper"
        >
          {[...ADMIN_PIPELINE, ...CLOSED_STATUSES].map((s) => (
            <option key={s} value={s}>
              {statusMeta(s).label}
            </option>
          ))}
        </select>

        <label htmlFor="stage-note" className="mt-4 block text-sm font-medium text-ink/75 dark:text-paper/75">
          Note to the applicant <span className="font-normal text-ink/40">(optional)</span>
        </label>
        <textarea
          id="stage-note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Vetting is on Saturday 14 March at the Secretariat, 10am."
          className="mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-700 dark:text-paper"
        />

        <button
          type="button"
          onClick={moveStage}
          disabled={pending || nextStatus === status}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {pending ? <Loader2 size={15} className="animate-spin" /> : null}
          {nextStatus === status
            ? "Already at this stage"
            : `Move to ${statusMeta(nextStatus).label}`}
        </button>
        {savedAt === "stage" && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-brand-green dark:text-brand-green-100">
            <Check size={13} /> Stage updated and applicant notified
          </p>
        )}
      </section>

      {/* Panel review */}
      <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
        <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
          Panel review
        </h2>
        <p className="mt-0.5 text-xs text-ink/50 dark:text-paper/50">
          Internal only — never shown to the applicant.
        </p>

        <span className="mt-4 block text-sm font-medium text-ink/75 dark:text-paper/75">
          Score
        </span>
        <div className="mt-1.5 flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setStars(stars === n ? null : n)}
              aria-label={`${n} out of 5`}
              aria-pressed={stars === n}
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                stars != null && n <= stars
                  ? "bg-gold-400 text-canopy"
                  : "bg-canopy/8 text-ink/35 hover:bg-canopy/15 dark:bg-white/10 dark:text-paper/35"
              )}
            >
              <Star size={16} className={stars != null && n <= stars ? "fill-current" : ""} />
            </button>
          ))}
          {stars != null && (
            <button
              type="button"
              onClick={() => setStars(null)}
              className="ml-1 text-xs text-ink/45 hover:underline dark:text-paper/45"
            >
              Clear
            </button>
          )}
        </div>

        <label htmlFor="reviewer-notes" className="mt-4 block text-sm font-medium text-ink/75 dark:text-paper/75">
          Notes
        </label>
        <textarea
          id="reviewer-notes"
          rows={6}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Panel observations, residency check, references taken up…"
          className="mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-700 dark:text-paper"
        />

        <button
          type="button"
          onClick={persistReview}
          disabled={pending}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-canopy/25 bg-white px-5 py-2.5 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50 disabled:opacity-50 dark:border-white/15 dark:bg-transparent dark:text-paper dark:hover:bg-white/10"
        >
          {pending ? <Loader2 size={15} className="animate-spin" /> : null}
          Save review
        </button>
        {savedAt === "review" && (
          <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-brand-green dark:text-brand-green-100">
            <Check size={13} /> Review saved
          </p>
        )}
      </section>

      {error && (
        <p className="rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
          {error}
        </p>
      )}
    </div>
  )
}
