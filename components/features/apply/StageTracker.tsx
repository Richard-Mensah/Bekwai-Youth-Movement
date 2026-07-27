import { Check, X, CircleDot } from "lucide-react"
import {
  APPLICATION_STAGES,
  isClosed,
  stageIndex,
  statusMeta,
} from "@/constants/applications"
import { cn } from "@/lib/utils"

type Props = {
  status: string
  /** Dates keyed by stage, e.g. { submitted: "2026-07-21T..." }. */
  reachedAt?: Record<string, string>
  /** Compact drops the per-stage blurb and shrinks the nodes. */
  compact?: boolean
  className?: string
}

function shortDate(value?: string) {
  if (!value) return null
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  })
}

/**
 * The applicant's journey through the appointment stages of Article 30.2.
 * Horizontal from `sm` up, vertical on phones. Progress is expressed by a
 * filled connector so the whole path is legible at a glance.
 */
export default function StageTracker({
  status,
  reachedAt = {},
  compact = false,
  className,
}: Props) {
  const closed = isClosed(status)
  const current = stageIndex(status)
  const meta = statusMeta(status)

  return (
    <div className={className}>
      {closed && (
        <div className="mb-4 flex items-center gap-2.5 rounded-xl border border-canopy/10 bg-paper px-4 py-3 dark:border-white/10 dark:bg-canopy-700/40">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
            <X size={15} />
          </span>
          <p className="text-sm text-ink/70 dark:text-paper/70">
            <span className="font-semibold text-canopy dark:text-paper">
              {meta.label}.
            </span>{" "}
            {meta.description}
          </p>
        </div>
      )}

      <ol
        className={cn(
          "relative flex flex-col gap-0 sm:flex-row",
          closed && "opacity-45 grayscale"
        )}
      >
        {APPLICATION_STAGES.map((stage, i) => {
          const done = !closed && current > i
          const active = !closed && current === i
          const date = shortDate(reachedAt[stage.key])
          const last = i === APPLICATION_STAGES.length - 1

          return (
            <li
              key={stage.key}
              className="relative flex flex-1 gap-3 pb-6 last:pb-0 sm:flex-col sm:gap-0 sm:pb-0"
            >
              {/* Connector — vertical on phones, horizontal from sm */}
              {!last && (
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-[13px] top-7 h-full w-0.5 sm:left-auto sm:top-[13px] sm:h-0.5 sm:w-full sm:translate-x-[14px]",
                    done ? "bg-gold-400" : "bg-canopy/12 dark:bg-white/12"
                  )}
                />
              )}

              <span
                className={cn(
                  "relative z-10 flex shrink-0 items-center justify-center rounded-full ring-4 ring-white transition-colors dark:ring-canopy-800",
                  compact ? "h-6 w-6" : "h-7 w-7",
                  done && "bg-gold-400 text-canopy",
                  active && "bg-canopy text-gold-300",
                  !done && !active && "bg-canopy/10 text-ink/35 dark:bg-white/10 dark:text-paper/35"
                )}
              >
                {done ? (
                  <Check size={compact ? 13 : 15} strokeWidth={3} />
                ) : active ? (
                  <CircleDot size={compact ? 13 : 15} />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>

              <div className={cn("min-w-0 sm:mt-2.5 sm:pr-4")}>
                <p
                  className={cn(
                    "text-[13px] font-semibold leading-tight",
                    active
                      ? "text-canopy dark:text-gold-200"
                      : done
                        ? "text-ink/70 dark:text-paper/70"
                        : "text-ink/40 dark:text-paper/40"
                  )}
                >
                  {stage.label}
                </p>
                {date && (
                  <p className="mt-0.5 text-[11px] tabular-nums text-ink/45 dark:text-paper/45">
                    {date}
                  </p>
                )}
                {!compact && active && (
                  <p className="mt-1 text-xs leading-relaxed text-ink/60 dark:text-paper/60">
                    {stage.blurb}
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
