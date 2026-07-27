import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, HeartHandshake, ShieldCheck, Users } from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import RoleCatalogue from "@/components/features/apply/RoleCatalogue"
import { OFFICES } from "@/constants/offices"

export const metadata: Metadata = {
  title: "Open Roles",
  description:
    "Every office of the Bekwai Youth Movement open for application — from Director-General to community-level seats. Browse the duties, eligibility and term of each role, then put your name forward.",
}

const POINTS = [
  {
    icon: Users,
    title: "Every office is open",
    body: "From Director-General down to the last community seat. All 33 communities, all four arms of the Movement.",
  },
  {
    icon: ShieldCheck,
    title: "Merit and values first",
    body: "Selection follows the vetting and appointment stages set out in Article 30 of the Constitution. BYM is strictly non-partisan.",
  },
  {
    icon: HeartHandshake,
    title: "No CV needed",
    body: "Not everyone has had the same chance at formal education. Commitment to the community counts for just as much.",
  },
]

export default function OpenRolesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-canopy text-white">
        <div className="absolute inset-0 canopy-texture" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="container-content relative py-16 sm:py-20">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-200 ring-1 ring-inset ring-gold-400/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
              </span>
              Enrolment is now open
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-3xl font-display text-3xl font-semibold text-white text-balance sm:text-5xl">
              {OFFICES.length} ways to serve your community
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-lg text-white/75 text-pretty">
              Every office of the Movement, with the duties, eligibility and term
              set out in full. Read what each role actually involves, then put
              your name forward for the one that fits you.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <Link
              href="/leadership/apply"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-canopy shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gold-300"
            >
              How applying works
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Reassurance strip */}
      <section className="section pb-0">
        <div className="container-content">
          <div className="grid gap-5 sm:grid-cols-3">
            {POINTS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-canopy/10 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-canopy-800">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-canopy-50 text-canopy transition-colors group-hover:bg-canopy group-hover:text-white dark:bg-white/10 dark:text-gold-200">
                    <Icon size={20} />
                  </span>
                  <h2 className="mt-4 font-display text-base font-semibold text-canopy dark:text-paper">
                    {title}
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Catalogue */}
      <section className="section">
        <div className="container-content">
          <RoleCatalogue basePath="/leadership/roles" />
        </div>
      </section>
    </>
  )
}
