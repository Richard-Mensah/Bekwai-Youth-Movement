"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, UserCheck } from "lucide-react"
import Card from "@/components/ui/Card"
import { verifyMembers } from "./actions"

export type PendingMember = {
  id: string
  fullName: string
  email: string | null
  communityName: string | null
}

/**
 * The verification queue, cleared in one pass.
 *
 * A drive makes the per-row control in the table below the wrong shape for the
 * job: nobody clicks Verify three hundred times, so the queue stops being
 * cleared and starts being worked around in the SQL editor. This is the same
 * decision at the scale it now arrives in.
 *
 * Everyone starts ticked, because approving is the expected outcome — the work
 * is spotting the handful who should not be, and that is a matter of unticking
 * rather than ticking. The community is shown next to each name because it is
 * what an administrator actually recognises someone by; the email is not.
 *
 * Hidden entirely when the queue is empty. A panel saying "nothing to do" is
 * just something to scroll past.
 */
export default function PendingVerification({
  members,
}: {
  members: PendingMember[]
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(members.map((m) => m.id))
  )
  const [note, setNote] = useState<string | null>(null)

  if (members.length === 0) return null

  const allSelected = selected.size === members.length

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function submit() {
    setNote(null)
    start(async () => {
      const res = await verifyMembers([...selected])
      // `error` alongside ok:true means a partial sweep — worth showing, not
      // worth treating as a failure.
      if (res.error) setNote(res.error)
      if (res.ok) router.refresh()
    })
  }

  return (
    <Card className="mb-6 border-gold-400/40 bg-gold-50/50 dark:border-gold-400/20 dark:bg-gold-400/[0.06]">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-base font-semibold text-canopy dark:text-paper">
          {members.length} awaiting verification
        </h3>
        <button
          type="button"
          onClick={() =>
            setSelected(allSelected ? new Set() : new Set(members.map((m) => m.id)))
          }
          className="text-xs font-semibold text-canopy underline hover:no-underline dark:text-gold-300"
        >
          {allSelected ? "Clear all" : "Select all"}
        </button>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-ink/60 dark:text-paper/55">
        Untick anyone who should not be verified, then confirm. Verifying opens
        the role dashboards; it sends no email, so announce it with{" "}
        <strong>Email members</strong> if you want members told.
      </p>

      <ul className="mt-4 max-h-72 space-y-0.5 overflow-y-auto pr-1">
        {members.map((m) => (
          <li key={m.id}>
            <label className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm hover:bg-white/70 dark:hover:bg-white/[0.04]">
              <input
                type="checkbox"
                checked={selected.has(m.id)}
                onChange={() => toggle(m.id)}
                className="h-4 w-4 shrink-0 rounded border-canopy/30 text-canopy focus:ring-canopy"
              />
              <span className="min-w-0 flex-1 truncate font-medium text-canopy dark:text-paper">
                {m.fullName || m.email || "Unnamed member"}
              </span>
              <span className="shrink-0 text-xs text-ink/50 dark:text-paper/45">
                {m.communityName ?? "no community"}
              </span>
            </label>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-canopy/10 pt-4 dark:border-white/10">
        <button
          type="button"
          onClick={submit}
          disabled={pending || selected.size === 0}
          className="inline-flex items-center gap-2 rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
        >
          {pending ? (
            <>
              <Loader2 size={15} className="animate-spin" aria-hidden /> Verifying…
            </>
          ) : (
            <>
              <UserCheck size={15} aria-hidden /> Verify {selected.size}{" "}
              {selected.size === 1 ? "member" : "members"}
            </>
          )}
        </button>
        {selected.size < members.length && (
          <span className="inline-flex items-center gap-1 text-xs text-ink/55 dark:text-paper/50">
            <Check size={12} aria-hidden />
            {members.length - selected.size} left for later
          </span>
        )}
      </div>

      {note && (
        <p className="mt-3 text-xs text-brand-red-700 dark:text-brand-red-100">{note}</p>
      )}
    </Card>
  )
}
