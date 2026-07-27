import Link from "next/link"
import { ArrowUpRight, Clock, FileText } from "lucide-react"
import Badge from "@/components/ui/Badge"
import StageTracker from "./StageTracker"
import { ARM_STYLE, officeIcon } from "./OfficeIcon"
import { officeByTitle } from "@/constants/offices"
import { statusMeta } from "@/constants/applications"
import type { ApplicationRow } from "@/lib/data/applications"
import { formatDate } from "@/lib/utils"
import { cn } from "@/lib/utils"

type Props = {
  application: ApplicationRow
  /** Dates keyed by stage, from the event log. */
  reachedAt?: Record<string, string>
}

export default function ApplicationCard({ application, reachedAt }: Props) {
  const office = officeByTitle(application.roleApplied)
  const Icon = office ? officeIcon(office.icon) : FileText
  const meta = statusMeta(application.status)
  const style = office ? ARM_STYLE[office.arm] : ARM_STYLE.cabinet

  return (
    <article className="relative overflow-hidden rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
      <span
        aria-hidden
        className={cn("absolute inset-x-0 top-0 h-1", style.dot)}
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3.5">
          <span
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              style.tint
            )}
          >
            <Icon size={20} />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-base font-semibold leading-snug text-canopy dark:text-paper">
              {application.roleApplied || "Office not chosen yet"}
            </h3>
            <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50 dark:text-paper/50">
              {application.submittedAt ? (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Submitted {formatDate(application.submittedAt)}
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  Started {formatDate(application.createdAt)}
                </span>
              )}
              {application.membershipId && (
                <span className="font-mono">{application.membershipId}</span>
              )}
            </p>
          </div>
        </div>
        <Badge tone={meta.tone}>{meta.label}</Badge>
      </div>

      {application.status === "draft" ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-paper/70 px-4 py-3.5 dark:bg-white/5">
          <p className="text-sm text-ink/65 dark:text-paper/60">
            Not submitted yet — you&apos;re on step {application.currentStep} of 7.
          </p>
          <Link
            href={`/dashboard/apply/new?id=${application.id}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-canopy px-4 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
          >
            Continue <ArrowUpRight size={13} />
          </Link>
        </div>
      ) : (
        <>
          <StageTracker
            status={application.status}
            reachedAt={reachedAt}
            className="mt-6"
          />
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-canopy/8 pt-4 dark:border-white/10">
            <p className="text-xs text-ink/50 dark:text-paper/50">
              {meta.description}
            </p>
            <Link
              href={`/dashboard/apply/${application.id}`}
              className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-brand-blue hover:underline"
            >
              View details <ArrowUpRight size={13} />
            </Link>
          </div>
        </>
      )}
    </article>
  )
}
