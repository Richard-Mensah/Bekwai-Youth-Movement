import Reveal from "@/components/ui/Reveal"
import SectionHeading from "@/components/ui/SectionHeading"

const MILESTONES = [
  {
    year: "2021",
    title: "Grassroots beginnings",
    body: "Young volunteers begin organising for change across Sefwi Bekwai and its sub-communities.",
  },
  {
    year: "2023",
    title: "On the global stage",
    body: "BYM delegates engage internationally, from the African Youth Summit on Biodiversity in Morocco to the MAI Foundation Sustainability Week and UN SDG forums.",
  },
  {
    year: "2026",
    title: "Formalising governance",
    body: "The movement drafts its Constitution and governance framework, and constitutes the 19-member Civic Cabinet.",
  },
  {
    year: "2027",
    title: "Founding Day",
    body: "The Youth General Assembly and Bekwai Youth Parliament are formally launched on 12 January 2027.",
    highlight: true,
  },
]

/** Horizontal credibility timeline: grassroots → global → governance → launch. */
export default function JourneyTimeline() {
  return (
    <section className="section bg-canopy text-white">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Our journey"
            title="From a local movement to a youth institution"
            description="Real momentum, built community by community and recognised well beyond Ghana."
            invert
            centered
          />
        </Reveal>

        <div className="relative mt-14">
          {/* connecting line */}
          <div className="absolute left-0 right-0 top-5 hidden h-px bg-white/15 md:block" />
          <ol className="grid gap-8 md:grid-cols-4">
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 0.08} className="relative">
                <span
                  className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                    m.highlight
                      ? "bg-gold-400 text-canopy"
                      : "bg-white/10 text-gold-300 ring-1 ring-white/20"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="mt-4 font-display text-2xl font-semibold text-gold-300">
                  {m.year}
                </p>
                <h3 className="mt-1 text-base font-semibold text-white">{m.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{m.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
