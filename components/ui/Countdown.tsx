"use client"

import { useEffect, useState } from "react"

type Props = {
  /** Target date (ISO string). */
  to: string
  className?: string
}

type Parts = { days: number; hours: number; minutes: number; seconds: number }

function diff(target: number): Parts {
  const now = Date.now()
  let delta = Math.max(0, Math.floor((target - now) / 1000))
  const days = Math.floor(delta / 86400)
  delta -= days * 86400
  const hours = Math.floor(delta / 3600)
  delta -= hours * 3600
  const minutes = Math.floor(delta / 60)
  const seconds = delta - minutes * 60
  return { days, hours, minutes, seconds }
}

const UNITS: { key: keyof Parts; label: string }[] = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hrs" },
  { key: "minutes", label: "Min" },
  { key: "seconds", label: "Sec" },
]

/** Live countdown to BYM's Founding Day. Mounts client-side to avoid hydration drift. */
export default function Countdown({ to, className }: Props) {
  const target = new Date(to).getTime()
  const [parts, setParts] = useState<Parts | null>(null)

  useEffect(() => {
    setParts(diff(target))
    const id = setInterval(() => setParts(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  return (
    <div className={className}>
      <div className="flex items-center gap-2.5 sm:gap-3" aria-hidden={!parts}>
        {UNITS.map(({ key, label }) => (
          <div key={key} className="text-center">
            <div className="min-w-[3rem] rounded-xl border border-gold-400/30 bg-white/5 px-2.5 py-2 font-display text-2xl font-semibold tabular-nums text-white sm:text-3xl">
              {parts ? String(parts[key]).padStart(2, "0") : "––"}
            </div>
            <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-widest text-gold-300">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
