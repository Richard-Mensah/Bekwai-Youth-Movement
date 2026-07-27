"use client"

import { Check } from "lucide-react"
import { WIZARD_STEPS, TOTAL_STEPS } from "@/constants/applications"
import { cn } from "@/lib/utils"

type Props = {
  step: number
  /** Highest step the applicant has reached — earlier steps are clickable. */
  furthest: number
  onJump: (n: number) => void
}

export default function StepRail({ step, furthest, onJump }: Props) {
  const pct = Math.round(((step - 1) / (TOTAL_STEPS - 1)) * 100)

  return (
    <div>
      {/* Phones: a progress bar and the current step's name */}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between">
          <p className="font-display text-base font-semibold text-canopy dark:text-paper">
            {WIZARD_STEPS[step - 1].title}
          </p>
          <p className="text-xs tabular-nums text-ink/45 dark:text-paper/45">
            Step {step} of {TOTAL_STEPS}
          </p>
        </div>
        <div
          className="mt-2 h-1.5 overflow-hidden rounded-full bg-canopy/10 dark:bg-white/10"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-label="Application progress"
        >
          <div
            className="h-full rounded-full bg-gold-400 transition-[width] duration-500 ease-out motion-reduce:transition-none"
            style={{ width: `${Math.max(pct, 6)}%` }}
          />
        </div>
      </div>

      {/* Desktop: a full vertical rail */}
      <ol className="hidden lg:block">
        {WIZARD_STEPS.map((s, i) => {
          const done = furthest > s.n || step > s.n
          const active = step === s.n
          const reachable = s.n <= furthest
          const last = i === WIZARD_STEPS.length - 1

          return (
            <li key={s.n} className="relative flex gap-3.5 pb-6 last:pb-0">
              {!last && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[13px] top-7 h-full w-0.5",
                    done ? "bg-gold-400" : "bg-canopy/10 dark:bg-white/10"
                  )}
                />
              )}
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(s.n)}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ring-4 ring-paper transition-colors dark:ring-canopy-900",
                  done && "bg-gold-400 text-canopy",
                  active && !done && "bg-canopy text-gold-300",
                  !done && !active && "bg-canopy/10 text-ink/40 dark:bg-white/10 dark:text-paper/40",
                  reachable ? "cursor-pointer" : "cursor-default"
                )}
              >
                {done ? <Check size={14} strokeWidth={3} /> : s.n}
              </button>
              <div className="min-w-0 pt-0.5">
                <button
                  type="button"
                  disabled={!reachable}
                  onClick={() => reachable && onJump(s.n)}
                  className={cn(
                    "block text-left text-sm font-semibold leading-tight transition-colors",
                    active
                      ? "text-canopy dark:text-gold-200"
                      : reachable
                        ? "text-ink/65 hover:text-canopy dark:text-paper/65 dark:hover:text-paper"
                        : "cursor-default text-ink/35 dark:text-paper/35"
                  )}
                >
                  {s.title}
                </button>
                <p className="mt-0.5 text-xs text-ink/45 dark:text-paper/45">
                  {s.hint}
                </p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
