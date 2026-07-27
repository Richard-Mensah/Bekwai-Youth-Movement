import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  PartyPopper,
} from "lucide-react"
import Badge from "@/components/ui/Badge"
import Reveal from "@/components/ui/Reveal"
import StageTracker from "@/components/features/apply/StageTracker"
import ApplicationTimeline from "@/components/features/apply/ApplicationTimeline"
import WithdrawButton from "@/components/features/apply/WithdrawButton"
import { ARM_STYLE, officeIcon } from "@/components/features/apply/OfficeIcon"
import { officeByTitle } from "@/constants/offices"
import {
  docKindLabel,
  statusMeta,
  VETTING_LABEL,
} from "@/constants/applications"
import {
  getApplication,
  getApplicationDocuments,
  getApplicationEvents,
} from "@/lib/data/applications"
import { formatDate, cn } from "@/lib/utils"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ submitted?: string }>
}

export const metadata = { title: "Application" }

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

export default async function ApplicationDetailPage({
  params,
  searchParams,
}: Props) {
  const { id } = await params
  const { submitted } = await searchParams

  const application = await getApplication(id)
  if (!application) notFound()
  if (application.status === "draft")
    redirect(`/dashboard/apply/new?id=${application.id}`)

  const [events, documents] = await Promise.all([
    getApplicationEvents(application.id),
    getApplicationDocuments(application.id),
  ])

  const reached: Record<string, string> = {}
  for (const e of events) reached[e.toStatus] = e.createdAt

  const office = officeByTitle(application.roleApplied)
  const Icon = office ? officeIcon(office.icon) : FileText
  const style = office ? ARM_STYLE[office.arm] : ARM_STYLE.cabinet
  const meta = statusMeta(application.status)
  const appointed =
    application.status === "appointed" || application.status === "sworn_in"
  const canWithdraw = !["appointed", "sworn_in", "withdrawn", "archived"].includes(
    application.status
  )

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard/apply"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline dark:text-brand-green-100"
      >
        <ArrowLeft size={14} /> My applications
      </Link>

      {submitted && (
        <Reveal>
          <div className="mb-6 flex items-start gap-3.5 rounded-2xl border border-gold-200 bg-gold-50 p-5 dark:border-gold-400/25 dark:bg-gold-400/10">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold-400/25 text-gold-700 dark:text-gold-200">
              <CheckCircle2 size={22} />
            </span>
            <div>
              <h2 className="font-display text-lg font-semibold text-canopy dark:text-paper">
                Application received — thank you
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink/70 dark:text-paper/70">
                Thank you for stepping forward to serve. The Secretariat reviews
                every application. Watch this page, your email and your phone for
                the next steps.
              </p>
            </div>
          </div>
        </Reveal>
      )}

      {/* Header */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl bg-canopy p-6 text-white canopy-texture sm:p-8">
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-gold-400/15 blur-3xl" />
          <div className="relative flex flex-wrap items-start justify-between gap-4">
            <div className="flex min-w-0 gap-4">
              <span
                className={cn(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gold-400/20 text-gold-200"
                )}
              >
                <Icon size={22} />
              </span>
              <div className="min-w-0">
                <h1 className="font-display text-xl font-semibold text-white text-balance sm:text-2xl">
                  {application.roleApplied}
                </h1>
                {office?.constitutionalTitle && (
                  <p className="mt-0.5 text-sm italic text-gold-200/80">
                    {office.constitutionalTitle}
                  </p>
                )}
                <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/55">
                  {application.submittedAt && (
                    <span>Submitted {formatDate(application.submittedAt)}</span>
                  )}
                  {application.membershipId && (
                    <span className="font-mono text-gold-200">
                      {application.membershipId}
                    </span>
                  )}
                  {application.altRole && (
                    <span>2nd choice: {application.altRole}</span>
                  )}
                </p>
              </div>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white ring-1 ring-inset ring-white/20"
              )}
            >
              {meta.label}
            </span>
          </div>

          {office && (
            <Link
              href={`/dashboard/apply/roles/${office.slug}`}
              className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-200 hover:underline"
            >
              Read the full role description <ArrowUpRight size={13} />
            </Link>
          )}
        </section>
      </Reveal>

      {/* Tracker */}
      <Reveal delay={0.05}>
        <section className="mt-6 rounded-2xl border border-canopy/10 bg-white p-6 shadow-card sm:p-7 dark:border-white/10 dark:bg-canopy-800">
          <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
            Where your application stands
          </h2>
          <StageTracker
            status={application.status}
            reachedAt={reached}
            className="mt-6"
          />
          {appointed && (
            <div className="mt-6 flex gap-3 rounded-xl bg-gold-50 px-4 py-4 dark:bg-gold-400/10">
              <PartyPopper
                size={18}
                className="mt-0.5 shrink-0 text-gold-600 dark:text-gold-300"
              />
              <div>
                <p className="text-sm font-semibold text-canopy dark:text-paper">
                  Congratulations — you have been appointed.
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/65 dark:text-paper/60">
                  {application.status === "appointed"
                    ? "The Secretariat will issue your Letter of Appointment and invite you to be sworn in, in accordance with Schedule I of the Constitution."
                    : "You have taken the Oath of Service and are formally in office. Welcome."}
                </p>
              </div>
            </div>
          )}
        </section>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* What you submitted */}
        <Reveal className="lg:col-span-2" delay={0.1}>
          <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card sm:p-7 dark:border-white/10 dark:bg-canopy-800">
            <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
              What you submitted
            </h2>

            <dl className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Name" value={application.fullName} />
              <Field label="Email" value={application.email} />
              <Field label="Phone" value={application.phone} />
              <Field label="Community" value={application.community} />
              <Field
                label="Age / gender"
                value={
                  [application.age, application.gender].filter(Boolean).join(" · ") ||
                  null
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
              <Field label="Qualifications" value={application.qualifications} />
              <Field label="Experience" value={application.experience} />
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
            </dl>

            <div className="mt-5 border-t border-canopy/8 pt-4 dark:border-white/10">
              <dt className="text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">
                Why you want to serve
              </dt>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-ink/72 dark:text-paper/70">
                {application.motivation}
              </p>
            </div>

            {documents.length > 0 && (
              <div className="mt-5 border-t border-canopy/8 pt-4 dark:border-white/10">
                <dt className="text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">
                  Documents
                </dt>
                <ul className="mt-2 space-y-2">
                  {documents.map((d) => (
                    <li key={d.id}>
                      <a
                        href={d.url ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "inline-flex items-center gap-2 rounded-lg bg-paper px-3 py-2 text-sm text-ink/75 transition-colors hover:bg-canopy-50 dark:bg-white/5 dark:text-paper/75 dark:hover:bg-white/10",
                          !d.url && "pointer-events-none opacity-50"
                        )}
                      >
                        <FileText size={14} className="text-canopy dark:text-gold-200" />
                        <span className="truncate">{d.filename}</span>
                        <span className="text-[11px] text-ink/40 dark:text-paper/40">
                          {docKindLabel(d.kind)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {canWithdraw && (
              <div className="mt-6 border-t border-canopy/8 pt-4 dark:border-white/10">
                <WithdrawButton id={application.id} />
              </div>
            )}
          </section>
        </Reveal>

        {/* Timeline */}
        <Reveal delay={0.15}>
          <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
            <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
              Activity
            </h2>
            <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
              Every step recorded, newest last.
            </p>
            <ApplicationTimeline events={events} className="mt-5" />

            <div className="mt-6 rounded-xl bg-paper/70 p-4 dark:bg-white/5">
              <Badge tone={meta.tone}>{meta.label}</Badge>
              <p className="mt-2 text-xs leading-relaxed text-ink/60 dark:text-paper/60">
                {meta.description}
              </p>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  )
}
