"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Loader2, MailWarning, PencilLine, ShieldCheck } from "lucide-react"
import { confirmMemberEmail, correctMemberEmail } from "./actions"

/**
 * A member's login state, and the two repairs for it.
 *
 * Kept next to the address rather than the verification badge, because these
 * answer a different question. Verification is "should this person be in the
 * Movement?" — a decision. This is "can this person get in at all?" — a fact, and
 * one the console could not see before, since it lives in `auth.users` and not in
 * `profiles`.
 *
 * Nothing renders when the member is confirmed and has signed in. Most rows are
 * fine, and a badge on every one of them would bury the handful that are not.
 */
export default function MemberAccount({
  id,
  email,
  confirmed,
  everSignedIn,
  known,
}: {
  id: string
  email: string | null
  confirmed: boolean
  everSignedIn: boolean
  /** False when login state could not be read at all — say so rather than
   *  reporting every member as unconfirmed. */
  known: boolean
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(email ?? "")
  const [error, setError] = useState<string | null>(null)

  function run(fn: () => Promise<{ ok: boolean; error?: string }>) {
    setError(null)
    start(async () => {
      const res = await fn()
      if (res.ok) {
        setEditing(false)
        router.refresh()
      } else {
        setError(res.error ?? "Could not save that.")
      }
    })
  }

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          run(() => correctMemberEmail(id, draft))
        }}
        className="mt-1 space-y-1.5"
      >
        <input
          type="email"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          className="block w-full rounded-lg border border-canopy/25 bg-white px-2 py-1 text-xs focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/15 dark:bg-canopy-700 dark:text-paper"
        />
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <button type="submit" disabled={pending} className="text-brand-green hover:underline">
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setEditing(false)
              setDraft(email ?? "")
              setError(null)
            }}
            className="text-ink/55 hover:underline"
          >
            Cancel
          </button>
        </div>
        <p className="text-[11px] leading-snug text-ink/50 dark:text-paper/45">
          Changes the address they sign in with, and confirms it.
        </p>
        {error && <p className="text-[11px] text-brand-red">{error}</p>}
      </form>
    )
  }

  const healthy = known && confirmed && everSignedIn

  return (
    <div className="mt-1 space-y-1">
      {!known ? (
        <p className="text-[11px] text-ink/40 dark:text-paper/35">Login state unavailable</p>
      ) : (
        <>
          {!confirmed && (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-brand-red">
              <MailWarning size={11} aria-hidden /> Email not confirmed
            </p>
          )}
          {confirmed && !everSignedIn && (
            <p className="flex items-center gap-1 text-[11px] font-semibold text-gold-700 dark:text-gold-300">
              <Hourglassish /> Never signed in
            </p>
          )}
        </>
      )}

      {pending ? (
        <Loader2 size={12} className="animate-spin text-ink/40" />
      ) : (
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] font-semibold">
          {known && !confirmed && (
            <button
              type="button"
              onClick={() => run(() => confirmMemberEmail(id))}
              className="inline-flex items-center gap-1 text-brand-green hover:underline"
            >
              <ShieldCheck size={11} aria-hidden /> Confirm for them
            </button>
          )}
          {/* Offered on healthy rows too, just quietly: a member can sign in
              perfectly well on an address that is still the wrong one. */}
          <button
            type="button"
            onClick={() => setEditing(true)}
            className={
              healthy
                ? "inline-flex items-center gap-1 text-ink/40 hover:text-canopy hover:underline dark:text-paper/35"
                : "inline-flex items-center gap-1 text-canopy hover:underline dark:text-gold-300"
            }
          >
            <PencilLine size={11} aria-hidden /> Fix address
          </button>
        </div>
      )}

      {error && <p className="text-[11px] text-brand-red">{error}</p>}
    </div>
  )
}

/** A dot, standing in for an hourglass at 11px where the icon reads as mud. */
function Hourglassish() {
  return <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
}
