import Link from "next/link"
import { ArrowUpRight, CheckCircle2, Users2 } from "lucide-react"
import type { Office } from "@/constants/offices"
import { ARM_META } from "@/constants/offices"
import { ARM_STYLE, officeIcon } from "./OfficeIcon"
import { cn } from "@/lib/utils"

type Props = {
  office: Office
  /** Where clicking the card leads. */
  href: string
  /** The signed-in user has already applied for this office. */
  applied?: boolean
  /** How many people have applied so far. */
  applicants?: number
  className?: string
}

export default function RoleCard({
  office,
  href,
  applied = false,
  applicants,
  className,
}: Props) {
  const Icon = officeIcon(office.icon)
  const style = ARM_STYLE[office.arm]

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-canopy/10 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-canopy/20 hover:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-canopy focus-visible:ring-offset-2 dark:border-white/10 dark:bg-canopy-800 dark:focus-visible:ring-offset-canopy-900",
        "before:absolute before:inset-x-0 before:top-0 before:h-1 before:content-['']",
        style.edge,
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
            style.tint
          )}
        >
          <Icon size={20} />
        </span>
        <span
          className={cn(
            "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
            style.chip
          )}
        >
          {ARM_META[office.arm].short}
        </span>
      </div>

      <h3 className="mt-3.5 font-display text-base font-semibold leading-snug text-canopy dark:text-paper">
        {office.title}
      </h3>
      {office.constitutionalTitle && (
        <p className="mt-0.5 text-[11px] italic text-ink/45 dark:text-paper/45">
          {office.constitutionalTitle}
        </p>
      )}

      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
        {office.summary}
      </p>

      <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-canopy/8 pt-3 text-[11px] text-ink/55 dark:border-white/10 dark:text-paper/50">
        {office.ageRange && (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Age range</dt>
            <dd className="tabular-nums">
              Ages {office.ageRange[0]}–{office.ageRange[1]}
            </dd>
          </div>
        )}
        {office.term && (
          <div>
            <dt className="sr-only">Term</dt>
            <dd>{office.term.split(",")[0]}</dd>
          </div>
        )}
        {office.seats > 1 && (
          <div className="flex items-center gap-1">
            <dt className="sr-only">Seats</dt>
            <dd className="flex items-center gap-1">
              <Users2 size={12} /> {office.seats} seats
            </dd>
          </div>
        )}
      </dl>

      <div className="mt-3 flex items-center justify-between">
        {applied ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-green dark:text-brand-green-100">
            <CheckCircle2 size={13} /> You&apos;ve applied
          </span>
        ) : applicants && applicants > 0 ? (
          <span className="text-xs text-ink/45 dark:text-paper/45">
            {applicants} {applicants === 1 ? "application" : "applications"} so far
          </span>
        ) : (
          <span className="text-xs text-ink/45 dark:text-paper/45">
            Be the first to apply
          </span>
        )}
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-canopy-50 text-canopy transition-all duration-300 group-hover:bg-canopy group-hover:text-gold-300 dark:bg-white/10 dark:text-paper">
          <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  )
}
