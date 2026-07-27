import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import OrgChart from "@/components/features/public/OrgChart"
import LeadershipGrid from "@/components/features/public/LeadershipGrid"
import { getLeaderTiers } from "@/lib/data/content"

export const metadata: Metadata = {
  title: "Leadership & Cabinet",
  description:
    "The Bekwai Youth Movement leadership: a 19-member Civic Cabinet led by the Director-General, with the Youth Parliament, Community Intelligence Network, and Traditional Advisory Council.",
}

export default async function LeadershipPage() {
  const tiers = await getLeaderTiers()
  const [cabinet, ...rest] = tiers

  return (
    <>
      <PageHeader
        eyebrow="Our Governance"
        title="The people who lead the movement"
        description="Modelled on the UK Cabinet system and Ghana's constitutional tradition, with clear portfolio accountability under the Director-General, anchored by traditional authority."
      />

      {/* Supreme authority note */}
      <section className="section">
        <div className="container-content">
          <Reveal>
            <div className="rounded-3xl bg-canopy p-8 text-white canopy-texture sm:p-10">
              <p className="eyebrow-light">
                <span className="h-px w-5 bg-gold-400" />
                Supreme authority
              </p>
              <h2 className="mt-3 max-w-3xl font-display text-2xl font-semibold text-white sm:text-3xl">
                The BYM Founding Leadership
              </h2>
              <p className="mt-3 max-w-3xl text-white/75">
                A non-elected, non-partisan body above all Assembly structures. It
                ratifies the Constitution, approves senior Cabinet appointments, and
                holds final authority on strategic direction, the guardian of the
                movement&apos;s values.
              </p>
            </div>
          </Reveal>

          <Reveal className="mt-14">
            <SectionHeading
              eyebrow="The Executive"
              title="Civic Cabinet org chart"
              description="The 19-member Civic Cabinet, top-down from the Director-General. Reporting lines reflect the official governance framework."
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <OrgChart />
          </Reveal>
        </div>
      </section>

      {/* Executive Cabinet roster */}
      <section className="section bg-paper">
        <div className="container-content">
          {cabinet && <LeadershipGrid tier={cabinet} />}
          <p className="mt-8 text-sm text-ink/50">
            Names and portraits are added as appointments are confirmed (Cabinet
            appointments: 2026). Office holders shown without a name are pending
            formal appointment.
          </p>
        </div>
      </section>

      {/* Enrolment CTA */}
      <section className="section">
        <div className="container-content">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-gold-400 p-8 text-canopy sm:flex-row sm:items-center sm:p-10">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-widest text-canopy/70">
                  Enrolment is open
                </p>
                <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
                  Step forward to serve
                </h2>
                <p className="mt-2 text-canopy/80">
                  Every office, from Director-General to the last role, is open
                  for application. If you are ready to lead, we want to hear from
                  you.
                </p>
              </div>
              <Link
                href="/leadership/roles"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-canopy px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
              >
                See the open roles
                <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Parliament, CIN, TAC */}
      {rest.map((tier, i) => (
        <section
          key={tier.id}
          className={i % 2 === 0 ? "section" : "section bg-paper"}
        >
          <div className="container-content">
            <LeadershipGrid tier={tier} />
          </div>
        </section>
      ))}
    </>
  )
}
