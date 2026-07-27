import Link from "next/link"
import {
  ArrowRight,
  CalendarClock,
  Compass,
  FileText,
  ShieldCheck,
  Sparkles,
} from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import RoleCard from "@/components/features/apply/RoleCard"
import ApplicationCard from "@/components/features/apply/ApplicationCard"
import { OFFICES } from "@/constants/offices"
import { APPLICATION_STAGES } from "@/constants/applications"
import {
  getApplicationEvents,
  getMyApplications,
} from "@/lib/data/applications"
import { getSessionProfile } from "@/lib/auth"

export const metadata = { title: "My Applications" }

/** A few offices worth surfacing to someone who hasn't applied yet. */
const SUGGESTED = [
  "youth-mp",
  "community-council-representative",
  "cin-officer-community",
]

function firstName(full: string) {
  return full.trim().split(/\s+/)[0] || "there"
}

export default async function ApplyHomePage() {
  const [session, applications] = await Promise.all([
    getSessionProfile(),
    getMyApplications(),
  ])

  // Stage dates for each live application, so the trackers show real timing.
  const eventMaps = await Promise.all(
    applications
      .filter((a) => a.status !== "draft")
      .map(async (a) => {
        const events = await getApplicationEvents(a.id)
        const reached: Record<string, string> = {}
        for (const e of events) reached[e.toStatus] = e.createdAt
        return [a.id, reached] as const
      })
  )
  const reachedById = Object.fromEntries(eventMaps)

  const draft = applications.find((a) => a.status === "draft")
  const live = applications.filter((a) => a.status !== "draft")
  const suggested = SUGGESTED.map((s) =>
    OFFICES.find((o) => o.slug === s)
  ).filter((o): o is (typeof OFFICES)[number] => Boolean(o))

  return (
    <>
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl bg-canopy p-7 text-white canopy-texture sm:p-9">
          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-gold-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-brand-green/25 blur-3xl" />
          <div className="relative flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-300">
                Applications portal
              </p>
              <h1 className="mt-2 font-display text-2xl font-semibold text-white text-balance sm:text-3xl">
                {applications.length === 0
                  ? `Welcome, ${firstName(session.fullName)} — ready to serve?`
                  : `Welcome back, ${firstName(session.fullName)}`}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-white/70 text-pretty">
                {applications.length === 0
                  ? `Every office of the Movement is open, from Director-General to the community seats. Find the one that fits you.`
                  : `Track where each of your applications stands, and browse the offices still open.`}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/apply/roles"
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-canopy shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gold-300"
              >
                <Compass size={16} />
                Browse {OFFICES.length} offices
              </Link>
              {!draft && (
                <Link
                  href="/dashboard/apply/new"
                  className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 transition-colors hover:bg-white/15"
                >
                  Start an application
                  <ArrowRight size={15} />
                </Link>
              )}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Resume banner */}
      {draft && (
        <Reveal delay={0.05}>
          <div className="mt-6">
            <ApplicationCard application={draft} />
          </div>
        </Reveal>
      )}

      {/* Live applications */}
      {live.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold text-canopy dark:text-paper">
            {live.length === 1 ? "Your application" : "Your applications"}
          </h2>
          <div className="mt-4 space-y-5">
            {live.map((a, i) => (
              <Reveal key={a.id} delay={i * 0.06}>
                <ApplicationCard
                  application={a}
                  reachedAt={reachedById[a.id]}
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {applications.length === 0 && (
        <Reveal delay={0.05}>
          <section className="mt-8">
            <div className="rounded-2xl border border-dashed border-canopy/20 bg-white/60 p-8 text-center dark:border-white/15 dark:bg-canopy-800/50">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-canopy-50 text-canopy dark:bg-white/10 dark:text-gold-200">
                <FileText size={22} />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold text-canopy dark:text-paper">
                You haven&apos;t applied for anything yet
              </h2>
              <p className="mx-auto mt-1.5 max-w-md text-sm text-ink/60 dark:text-paper/60">
                A formal CV is not required, and you do not need to have led
                anything before. Commitment to your community is what counts.
              </p>
              <Link
                href="/dashboard/apply/roles"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
              >
                Find your office <ArrowRight size={15} />
              </Link>
            </div>

            <h3 className="mt-10 font-display text-base font-semibold text-canopy dark:text-paper">
              Good places to start
            </h3>
            <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">
              One of each of these sits in every one of the 32 communities.
            </p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {suggested.map((office, i) => (
                <Reveal key={office.slug} delay={0.1 + i * 0.06}>
                  <RoleCard
                    office={office}
                    href={`/dashboard/apply/roles/${office.slug}`}
                  />
                </Reveal>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* What happens next */}
      <Reveal delay={0.1}>
        <section className="mt-10 rounded-2xl border border-canopy/10 bg-white p-6 shadow-card sm:p-7 dark:border-white/10 dark:bg-canopy-800">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-canopy-50 text-canopy dark:bg-white/10 dark:text-gold-200">
              <CalendarClock size={17} />
            </span>
            <div>
              <h2 className="font-display text-base font-semibold text-canopy dark:text-paper">
                How an application becomes an appointment
              </h2>
              <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">
                The six stages set out in Article 30.2 of the Constitution.
              </p>
            </div>
          </div>

          <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {APPLICATION_STAGES.map((stage, i) => (
              <li
                key={stage.key}
                className="rounded-xl border border-canopy/8 bg-paper/60 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold-400/25 text-[11px] font-bold tabular-nums text-gold-700 dark:text-gold-200">
                  {i + 1}
                </span>
                <p className="mt-2.5 text-sm font-semibold text-canopy dark:text-paper">
                  {stage.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/60 dark:text-paper/55">
                  {stage.blurb}
                </p>
                {stage.citation && (
                  <p className="mt-2 text-[10px] uppercase tracking-wider text-ink/35 dark:text-paper/35">
                    {stage.citation}
                  </p>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex gap-3 rounded-xl bg-gold-50 p-4 dark:bg-gold-400/10">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-gold-600 dark:text-gold-300"
              />
              <p className="text-xs leading-relaxed text-ink/70 dark:text-paper/65">
                <strong className="font-semibold">Vetting is hybrid.</strong>{" "}
                In-person in Sefwi Bekwai if you are home, or online if you are
                away for work or study. You choose in the form.
              </p>
            </div>
            <div className="flex gap-3 rounded-xl bg-canopy-50 p-4 dark:bg-white/5">
              <Sparkles
                size={17}
                className="mt-0.5 shrink-0 text-canopy dark:text-gold-200"
              />
              <p className="text-xs leading-relaxed text-ink/70 dark:text-paper/65">
                <strong className="font-semibold">
                  BYM is strictly non-partisan.
                </strong>{" "}
                Leaders serve the community, never a political party. That is a
                condition of every office.
              </p>
            </div>
          </div>
        </section>
      </Reveal>
    </>
  )
}
