import type { Metadata } from "next"
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
