import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  ChevronUp,
  ListChecks,
  Scale,
  Target,
  Users2,
} from "lucide-react"
import type { Office } from "@/constants/offices"
import { ARM_META } from "@/constants/offices"
import { UNITS } from "@/constants/units"
import { SDG_GOALS } from "@/constants/sdgs"
import Reveal from "@/components/ui/Reveal"
import { ARM_STYLE, officeIcon } from "./OfficeIcon"
import { cn } from "@/lib/utils"

type Props = {
  office: Office
  /** Where "back to all offices" goes. */
  backHref: string
  backLabel?: string
  /** Where the apply button goes. Omit to render a sign-in prompt instead. */
  applyHref?: string
  /** Renders an "already applied" state instead of the apply button. */
  applied?: boolean
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: React.ReactNode
}) {
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canopy-50 text-canopy dark:bg-white/10 dark:text-gold-200">
        <Icon size={15} />
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">
          {label}
        </dt>
        <dd className="text-sm font-medium text-canopy dark:text-paper">{value}</dd>
      </div>
    </div>
  )
}

export default function OfficeDetail({
  office,
  backHref,
  backLabel = "All offices",
  applyHref,
  applied = false,
}: Props) {
  const Icon = officeIcon(office.icon)
  const style = ARM_STYLE[office.arm]
  const unit = UNITS.find((u) => u.name === office.unit)
  const goals = (office.sdg ?? [])
    .map((n) => SDG_GOALS.find((g) => g.goal === n))
    .filter((g): g is (typeof SDG_GOALS)[number] => Boolean(g))

  return (
    <article>
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-canopy p-7 text-white canopy-texture sm:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="relative">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/60 transition-colors hover:text-gold-200"
          >
            <ArrowLeft size={14} /> {backLabel}
          </Link>

          <div className="mt-5 flex flex-wrap items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-400/20 text-gold-200">
              <Icon size={26} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={cn(
                    "inline-flex items-center rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-medium text-white/80 ring-1 ring-inset ring-white/15"
                  )}
                >
                  {ARM_META[office.arm].label}
                </span>
                {office.no && (
                  <span className="text-[11px] tabular-nums text-white/45">
                    Office no. {office.no}
                  </span>
                )}
              </div>
              <h1 className="mt-2 font-display text-2xl font-semibold text-white text-balance sm:text-4xl">
                {office.title}
              </h1>
              {office.constitutionalTitle && (
                <p className="mt-1.5 text-sm italic text-gold-200/85">
                  Constitutional office: {office.constitutionalTitle}
                </p>
              )}
              <p className="mt-3 max-w-2xl text-white/75 text-pretty">
                {office.summary}
              </p>
            </div>
          </div>

          {(applyHref || applied) && (
            <div className="mt-7">
              {applied ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-gold-200 ring-1 ring-inset ring-white/15">
                  <CheckCircle2 size={16} /> You have applied for this office
                </span>
              ) : (
                <Link
                  href={applyHref!}
                  className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-canopy shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gold-300"
                >
                  Apply for this office
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* At a glance */}
      <Reveal>
        <dl className="mt-6 grid gap-5 rounded-2xl border border-canopy/10 bg-white p-6 shadow-card sm:grid-cols-2 lg:grid-cols-4 dark:border-white/10 dark:bg-canopy-800">
          {office.ageRange && (
            <Fact
              icon={Users2}
              label="Age range"
              value={`${office.ageRange[0]}–${office.ageRange[1]} years`}
            />
          )}
          {office.term && (
            <Fact icon={CalendarClock} label="Term of office" value={office.term} />
          )}
          {office.reportsTo && (
            <Fact icon={ChevronUp} label="Reports to" value={office.reportsTo} />
          )}
          <Fact
            icon={Target}
            label="Seats"
            value={
              office.seats === 1
                ? "1 — a single office holder"
                : `${office.seats} — one per community`
            }
          />
        </dl>
      </Reveal>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Responsibilities */}
        <Reveal className="lg:col-span-2" delay={0.05}>
          <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card sm:p-7 dark:border-white/10 dark:bg-canopy-800">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-canopy dark:text-paper">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-canopy-50 text-canopy dark:bg-white/10 dark:text-gold-200">
                <ListChecks size={16} />
              </span>
              What you would do
            </h2>
            <ul className="mt-4 space-y-2.5">
              {office.responsibilities.map((r) => (
                <li key={r} className="flex gap-3">
                  <span
                    className={cn(
                      "mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full",
                      style.dot
                    )}
                  />
                  <span className="text-sm leading-relaxed text-ink/72 dark:text-paper/70">
                    {r}
                  </span>
                </li>
              ))}
            </ul>

            {office.citation && (
              <p className="mt-5 border-t border-canopy/8 pt-4 text-xs text-ink/45 dark:border-white/10 dark:text-paper/45">
                Source: BYM Constitution, First Edition 2026 —{" "}
                <span className="font-medium">{office.citation}</span>
              </p>
            )}
          </section>
        </Reveal>

        {/* Eligibility */}
        <Reveal delay={0.1}>
          <section className="rounded-2xl border border-gold-200 bg-gold-50 p-6 dark:border-gold-400/20 dark:bg-gold-400/10">
            <h2 className="flex items-center gap-2.5 font-display text-lg font-semibold text-canopy dark:text-paper">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400/25 text-gold-700 dark:text-gold-200">
                <BadgeCheck size={16} />
              </span>
              Who can apply
            </h2>
            <ul className="mt-4 space-y-2.5">
              {office.eligibility.map((e) => (
                <li key={e} className="flex gap-2.5">
                  <CheckCircle2
                    size={14}
                    className="mt-[3px] shrink-0 text-gold-600 dark:text-gold-300"
                  />
                  <span className="text-sm leading-relaxed text-ink/72 dark:text-paper/70">
                    {e}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-5 rounded-xl bg-white/60 px-3.5 py-3 text-xs leading-relaxed text-ink/60 dark:bg-canopy-900/30 dark:text-paper/60">
              A formal CV is <strong className="font-semibold">not required</strong>.
              Commitment to the community counts for as much as paper
              qualifications — apply even if you are unsure.
            </p>
          </section>
        </Reveal>
      </div>

      {/* Unit + SDGs */}
      {(unit || goals.length > 0 || office.ukEquivalent) && (
        <Reveal delay={0.15}>
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {unit && (
              <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
                <p className="eyebrow">
                  <span className="h-px w-5 bg-gold-400" />
                  Operational unit
                </p>
                <h3 className="mt-2.5 font-display text-base font-semibold text-canopy dark:text-paper">
                  {unit.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
                  {unit.mandate}
                </p>
              </section>
            )}

            <section className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
              {office.ukEquivalent && (
                <div className="mb-4">
                  <p className="eyebrow">
                    <span className="h-px w-5 bg-gold-400" />
                    Westminster equivalent
                  </p>
                  <p className="mt-2 flex items-center gap-2 font-display text-base font-semibold text-canopy dark:text-paper">
                    <Scale size={16} className="text-gold-500" />
                    {office.ukEquivalent}
                  </p>
                </div>
              )}
              {goals.length > 0 && (
                <>
                  <p className="eyebrow">
                    <span className="h-px w-5 bg-gold-400" />
                    Global goals this office serves
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {goals.map((g) => (
                      <li
                        key={g.goal}
                        className="inline-flex items-center gap-1.5 rounded-full bg-canopy-50 px-2.5 py-1 text-[11px] font-medium text-canopy dark:bg-white/10 dark:text-paper"
                      >
                        <span
                          aria-hidden
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: g.color }}
                        />
                        <span className="tabular-nums font-bold">{g.goal}</span>
                        {g.title}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          </div>
        </Reveal>
      )}
    </article>
  )
}
