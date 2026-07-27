import Link from "next/link"
import { ArrowLeft } from "lucide-react"

type Props = {
  title: string
  subtitle?: string
  /** Small uppercase label above the title, for section context. */
  eyebrow?: string
  /** Renders a proper back affordance instead of a bare "←" text link. */
  backHref?: string
  backLabel?: string
  /** Buttons or filters, right-aligned on the same optical line as the title. */
  actions?: React.ReactNode
}

/**
 * The standard page header for the console.
 *
 * Pages were each hand-rolling their own arrangement — a bare arrow link, an
 * h1, and a flex wrapper for buttons — which drifted apart in spacing and
 * weight. Everything a dashboard page needs at the top now lives here, so the
 * rhythm is identical on every screen.
 */
export default function DashboardHeading({
  title,
  subtitle,
  eyebrow,
  backHref,
  backLabel = "Back",
  actions,
}: Props) {
  return (
    <div className="mb-7">
      {backHref && (
        <Link
          href={backHref}
          className="group mb-3 inline-flex items-center gap-1.5 rounded-full py-1 text-xs font-semibold text-ink/50 transition-colors hover:text-canopy dark:text-paper/50 dark:hover:text-paper"
        >
          <ArrowLeft
            size={13}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          {backLabel}
        </Link>
      )}

      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          {eyebrow && (
            <p className="eyebrow mb-1.5">
              <span aria-hidden className="civic-rule" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-canopy dark:text-paper sm:text-3xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink/55 dark:text-paper/55">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
