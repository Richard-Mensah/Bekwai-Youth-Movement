import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import RepresentationBand from "@/components/features/public/RepresentationBand"
import Card from "@/components/ui/Card"

export const metadata: Metadata = {
  title: "Community Representation",
  description:
    "No community left without a voice — every one of BYM's 32 communities is entitled to three dedicated representatives.",
}

const INTERIM_TIERS = [
  {
    tier: "Tier 1",
    title: "Neighbouring Community Advocate",
    body: "The nearest community's Council Representative serves as an interim dual representative, visiting monthly to collect data and raise issues.",
  },
  {
    tier: "Tier 2",
    title: "BYM Caretaker Representative",
    body: "A trusted BYM volunteer is appointed for up to six months, visiting at least twice monthly to speak on the community's behalf.",
  },
  {
    tier: "Tier 3",
    title: "Traditional Authority Liaison",
    body: "The sub-chief designates a liaison to attend Assembly meetings and relay community concerns until a resident representative is found.",
  },
]

export default function RepresentationPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Impact"
        title="No community left without a voice"
        description="Representation is a promise, not a privilege. Every community — town or remote — holds three seats in the movement, and an interim protocol ensures none goes unheard."
      />

      <RepresentationBand />

      <section className="section bg-paper">
        <div className="container-content">
          <div className="max-w-2xl">
            <p className="eyebrow">
              <span className="h-px w-5 bg-gold-400" />
              When a seat is unfilled
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-canopy">
              A three-tier interim protocol
            </h2>
            <p className="mt-4 leading-relaxed text-ink/70">
              If a community produces no qualified candidate after two nomination
              cycles, representation is guaranteed through escalating tiers — and a
              fresh recruitment drive runs every six months until a resident is
              appointed.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {INTERIM_TIERS.map((t) => (
              <Card key={t.tier} accent="gold">
                <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {t.tier}
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold text-canopy">
                  {t.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{t.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
