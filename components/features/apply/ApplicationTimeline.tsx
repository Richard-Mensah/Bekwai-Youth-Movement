import { History } from "lucide-react"
import { statusMeta } from "@/constants/applications"
import type { ApplicationEvent } from "@/lib/data/applications"
import { cn } from "@/lib/utils"

type Props = {
  events: ApplicationEvent[]
  className?: string
}

function when(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function ApplicationTimeline({ events, className }: Props) {
  if (events.length === 0) {
    return (
      <p className={cn("text-sm text-ink/50 dark:text-paper/50", className)}>
        Nothing has happened yet.
      </p>
    )
  }

  return (
    <ol className={cn("relative", className)}>
      {events.map((e, i) => {
        const meta = statusMeta(e.toStatus)
        const last = i === events.length - 1
        return (
          <li key={e.id} className="relative flex gap-3.5 pb-5 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className="absolute left-[11px] top-6 h-full w-0.5 bg-canopy/10 dark:bg-white/10"
              />
            )}
            <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-canopy-50 text-canopy dark:bg-white/10 dark:text-gold-200">
              <History size={12} />
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-sm font-medium text-canopy dark:text-paper">
                {meta.label}
              </p>
              {e.note && (
                <p className="mt-0.5 text-sm text-ink/65 dark:text-paper/60">
                  {e.note}
                </p>
              )}
              <p className="mt-0.5 text-[11px] tabular-nums text-ink/40 dark:text-paper/40">
                {when(e.createdAt)}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
