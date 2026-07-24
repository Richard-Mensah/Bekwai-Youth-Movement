"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { setApplicationStatus, APPLICATION_STATUSES } from "./actions"

/** Status dropdown for a single leadership application. */
export default function ApplicationStatusActions({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const router = useRouter()
  const [pending, start] = useTransition()

  const onChange = (s: string) =>
    start(async () => {
      await setApplicationStatus(id, s)
      router.refresh()
    })

  return (
    <label className="inline-flex items-center gap-2 text-xs text-ink/55">
      Status
      <select
        value={status}
        disabled={pending}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-lg border border-canopy/20 bg-white px-2 py-1 text-xs font-semibold text-canopy focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy disabled:opacity-50"
      >
        {APPLICATION_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    </label>
  )
}
