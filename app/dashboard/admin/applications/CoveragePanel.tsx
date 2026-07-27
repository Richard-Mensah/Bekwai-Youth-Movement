"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AlertTriangle, ChevronDown } from "lucide-react"
import { ARM_META, OFFICES } from "@/constants/offices"
import { cn } from "@/lib/utils"

type Props = { counts: Record<string, number> }

/**
 * How applications are spread across the offices — and, more usefully, which
 * offices nobody has applied for yet. Those gaps are what the Secretariat
 * needs to go recruiting for.
 */
export default function CoveragePanel({ counts }: Props) {
  const [open, setOpen] = useState(false)

  const rows = useMemo(
    () =>
      OFFICES.map((o) => ({
        slug: o.slug,
        title: o.title,
        arm: o.arm,
        n: counts[o.title] ?? 0,
      })).sort((a, b) => b.n - a.n || a.title.localeCompare(b.title)),
    [counts]
  )

  const max = Math.max(1, ...rows.map((r) => r.n))
  const empty = rows.filter((r) => r.n === 0)
  const shown = open ? rows : rows.filter((r) => r.n > 0).slice(0, 8)

  return (
    <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
            Interest by office
          </h2>
          <p className="mt-0.5 text-sm text-ink/55 dark:text-paper/55">
            Where applications are landing, across all {OFFICES.length} offices.
          </p>
        </div>
        {empty.length > 0 && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-400/10 dark:text-amber-200 dark:ring-amber-400/20">
            <AlertTriangle size={13} />
            {empty.length} with no applicants
          </span>
        )}
      </div>

      {rows.every((r) => r.n === 0) ? (
        <p className="mt-6 text-sm text-ink/50 dark:text-paper/50">
          No applications yet — nothing to chart.
        </p>
      ) : (
        <ul className="mt-5 space-y-2.5">
          {shown.map((r) => (
            <li key={r.slug} className="flex items-center gap-3">
              <Link
                href={`/leadership/roles/${r.slug}`}
                className="w-52 shrink-0 truncate text-xs text-ink/70 hover:underline dark:text-paper/65"
                title={r.title}
              >
                {r.title}
              </Link>
              <div className="h-4 flex-1 overflow-hidden rounded-full bg-canopy/[0.06] dark:bg-white/10">
                <div
                  className={cn(
                    "h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none",
                    r.n === 0 ? "bg-transparent" : "bg-gold-400"
                  )}
                  style={{ width: `${(r.n / max) * 100}%` }}
                />
              </div>
              <span
                className={cn(
                  "w-7 shrink-0 text-right text-xs font-bold tabular-nums",
                  r.n === 0
                    ? "text-brand-red/70"
                    : "text-canopy dark:text-paper"
                )}
              >
                {r.n}
              </span>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
      >
        {open ? "Show fewer" : `Show all ${OFFICES.length} offices`}
        <ChevronDown
          size={13}
          className={cn("transition-transform", open && "rotate-180")}
        />
      </button>

      {open && empty.length > 0 && (
        <div className="mt-5 rounded-xl bg-amber-50 p-4 dark:bg-amber-400/10">
          <p className="text-xs font-semibold text-amber-900 dark:text-amber-200">
            Offices nobody has applied for yet
          </p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {empty.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/leadership/roles/${r.slug}`}
                  className="inline-block rounded-full bg-white/70 px-2.5 py-1 text-[11px] text-amber-900 hover:bg-white dark:bg-canopy-900/40 dark:text-amber-100"
                  title={ARM_META[r.arm].short}
                >
                  {r.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
