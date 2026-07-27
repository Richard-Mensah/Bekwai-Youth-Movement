import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, FileText, Mail, Phone } from "lucide-react"
import Badge from "@/components/ui/Badge"
import StageTracker from "@/components/features/apply/StageTracker"
import ApplicationTimeline from "@/components/features/apply/ApplicationTimeline"
import EligibilityPanel from "@/components/features/apply/EligibilityPanel"
import { ARM_STYLE, officeIcon } from "@/components/features/apply/OfficeIcon"
import ReviewPanel from "./ReviewPanel"
import { officeByTitle } from "@/constants/offices"
import type { RoleArm } from "@/constants/offices"
import { docKindLabel, statusMeta, VETTING_LABEL } from "@/constants/applications"
import {
  getApplication,
  getApplicationDocuments,
  getApplicationEvents,
} from "@/lib/data/applications"
import { formatDate, cn } from "@/lib/utils"

type Props = { params: Promise<{ id: string }> }

export const metadata = { title: "Review Application" }

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">
        {label}
      </dt>
      <dd className="mt-0.5 whitespace-pre-wrap text-sm text-ink/75 dark:text-paper/75">
        {value}
      </dd>
    </div>
  )
}

export default async function ReviewApplicationPage({ params }: Props) {
  const { id } = await params
  const application = await getApplication(id)
  if (!application) notFound()

  const [events, documents] = await Promise.all([
    getApplicationEvents(application.id),
    getApplicationDocuments(application.id),
  ])

  const reached: Record<string, string> = {}
  for (const e of events) reached[e.toStatus] = e.createdAt

  const office = officeByTitle(application.roleApplied)
  const Icon = office ? officeIcon(office.icon) : FileText
  const style = office
    ? ARM_STYLE[office.arm]
    : ARM_STYLE[(application.roleArm as RoleArm) ?? "cabinet"] ?? ARM_STYLE.cabinet
  const meta = statusMeta(application.status)

  return (
    <>
      <Link
        href="/dashboard/admin/applications"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline dark:text-brand-green-100"
      >
        <ArrowLeft size={14} /> Applications pipeline
      </Link>

      {/* Candidate header */}
      <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 gap-4">
            <span
              className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
                style.tint
              )}
            >
              <Icon size={22} />
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-xl font-semibold text-canopy dark:text-paper">
                  {application.fullName}
                </h1>
                {application.membershipId && (
                  <span className="rounded bg-canopy-50 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-canopy dark:bg-white/10 dark:text-paper">
                    {application.membershipId}
                  </span>
                )}
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>

              <p className="mt-1 text-sm text-ink/70 dark:text-paper/65">
                Applying for{" "}
                <span className="font-semibold text-canopy dark:text-paper">
                  {application.roleApplied}
                </span>
                {application.altRole && (
                  <span className="text-ink/45 dark:text-paper/45">
                    {" "}· 2nd choice: {application.altRole}
                  </span>
                )}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
                <a
                  href={`mailto:${application.email}?subject=Your BYM application — ${application.roleApplied}`}
                  className="inline-flex items-center gap-1.5 text-brand-blue hover:underline"
                >
                  <Mail size={13} /> {application.email}
                </a>
                {application.phone && (
                  <a
                    href={`tel:${application.phone}`}
                    className="inline-flex items-center gap-1.5 text-ink/60 hover:underline dark:text-paper/60"
                  >
                    <Phone size={13} /> {application.phone}
                  </a>
                )}
                {application.submittedAt && (
                  <span className="text-ink/45 dark:text-paper/45">
                    Submitted {formatDate(application.submittedAt)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {office && (
            <Link
              href={`/leadership/roles/${office.slug}`}
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-brand-blue hover:underline"
            >
              Role description <ArrowUpRight size={13} />
            </Link>
          )}
        </div>

        <StageTracker
          status={application.status}
          reachedAt={reached}
          compact
          className="mt-7"
        />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Submission */}
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
            <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
              The submission
            </h2>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Community" value={application.community} />
              <Field
                label="Age / gender"
                value={
                  [application.age, application.gender]
                    .filter(Boolean)
                    .join(" · ") || null
                }
              />
              <Field label="Occupation" value={application.occupation} />
              <Field label="Availability" value={application.availability} />
              <Field
                label="Vetting preference"
                value={
                  application.vettingPref
                    ? (VETTING_LABEL[application.vettingPref] ?? null)
                    : null
                }
              />
              <Field
                label="Referee"
                value={
                  application.refereeName
                    ? `${application.refereeName}${
                        application.refereeContact
                          ? ` — ${application.refereeContact}`
                          : ""
                      }`
                    : null
                }
              />
              <Field label="Qualifications" value={application.qualifications} />
              <Field label="Experience" value={application.experience} />
            </dl>

            <div className="mt-5 border-t border-canopy/8 pt-4 dark:border-white/10">
              <dt className="text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">
                Why they want to serve
              </dt>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink/72 dark:text-paper/70">
                {application.motivation}
              </p>
            </div>

            <div className="mt-5 border-t border-canopy/8 pt-4 dark:border-white/10">
              <dt className="text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">
                Documents
              </dt>
              {documents.length === 0 ? (
                <p className="mt-1 text-sm text-ink/45 dark:text-paper/45">
                  None attached — a CV is optional.
                </p>
              ) : (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {documents.map((d) => (
                    <li key={d.id}>
                      <a
                        href={d.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full bg-gold-50 px-3 py-1.5 text-xs font-semibold text-gold-700 ring-1 ring-inset ring-gold-200 hover:bg-gold-100 dark:bg-gold-400/15 dark:text-gold-200 dark:ring-gold-400/25",
                          !d.url && "pointer-events-none opacity-50"
                        )}
                      >
                        <FileText size={12} />
                        {docKindLabel(d.kind)}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {office && (
            <EligibilityPanel office={office} age={application.age} />
          )}

          <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
            <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
              Audit trail
            </h2>
            <ApplicationTimeline events={events} className="mt-5" />
          </section>
        </div>

        {/* Panel controls */}
        <div className="lg:sticky lg:top-8 lg:self-start">
          <ReviewPanel
            id={application.id}
            status={application.status}
            reviewerNotes={application.reviewerNotes}
            score={application.score}
          />
        </div>
      </div>
    </>
  )
}
