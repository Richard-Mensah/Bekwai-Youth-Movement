import Image from "next/image"
import Reveal from "@/components/ui/Reveal"
import SectionHeading from "@/components/ui/SectionHeading"

const MILESTONES = [
  {
    year: "2021",
    title: "Grassroots beginnings",
    body: "Young volunteers begin organising for change across Sefwi Bekwai and its sub-communities.",
    img: "/images/history/when we first started with an interview.jpg",
  },
  {
    year: "2023",
    title: "On the global stage",
    body: "BYM delegates engage internationally, from the African Youth Summit on Biodiversity in Morocco to the MAI Foundation Sustainability Week and UN SDG forums.",
    img: "/images/history/472434052_1644476419477350_7263677863074049163_n.jpg",
  },
  {
    year: "2026",
    title: "Formalising governance",
    body: "The movement drafts its Constitution and governance framework, and constitutes the 19-member Civic Cabinet.",
    img: "/images/history/IMG-20211204-WA0001.jpg",
  },
  {
    year: "2027",
    title: "Founding Day",
    body: "The Youth General Assembly and Bekwai Youth Parliament are formally launched on 12 January 2027.",
    img: "/images/history/IMG-20211210-WA0013.jpg",
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
          <ol className="grid gap-6 md:grid-cols-4">
            {MILESTONES.map((m, i) => (
              <Reveal as="li" key={m.year} delay={i * 0.08}>
                <div
                  className={`group flex h-full flex-col overflow-hidden rounded-2xl ring-1 transition-all duration-300 hover:-translate-y-1 ${
                    m.highlight
                      ? "bg-gold-400/10 ring-gold-400/40"
                      : "bg-white/5 ring-white/10"
                  }`}
                >
                  {/* Photo */}
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={m.img}
                      alt={`${m.year} — ${m.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-canopy via-canopy/20 to-transparent" />
                    <span
                      className={`absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold shadow ${
                        m.highlight
                          ? "bg-gold-400 text-canopy"
                          : "bg-canopy/80 text-gold-300 ring-1 ring-white/20 backdrop-blur"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <p className="absolute bottom-3 left-4 font-display text-2xl font-semibold text-gold-300">
                      {m.year}
                    </p>
                  </div>
                  {/* Copy */}
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-base font-semibold text-white">{m.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{m.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
