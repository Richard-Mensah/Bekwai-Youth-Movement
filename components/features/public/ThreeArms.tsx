import Link from "next/link"
import { Landmark, Vote, Radar, ArrowRight } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"

const ARMS = [
  {
    icon: Landmark,
    title: "Youth General Assembly",
    tag: "Executive · New initiative",
    href: "/leadership",
    body: "A 19-member Civic Cabinet led by the Director-General, modelled on the UK Cabinet system, delivering policy and community development across 7 Units.",
  },
  {
    icon: Vote,
    title: "Bekwai Youth Parliament",
    tag: "Legislative · New initiative",
    href: "/parliament",
    body: "A Speaker-led chamber giving legislative voice to youth aged 10–45 — with bills, motions, debates, and Youth Recommendations, one Member per community.",
  },
  {
    icon: Radar,
    title: "Community Intelligence Network",
    tag: "Intelligence",
    href: "/cin",
    body: "32 Community Intelligence Officers gather monthly evidence on health, education, employment, and infrastructure to drive data-led governance.",
  },
]

export default function ThreeArms() {
  return (
    <section className="section">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="How BYM is organised"
            title="Three arms of youth governance"
            description="A separation of powers adapted to the Ghanaian community context — an executive, a legislature, and a grassroots intelligence network working as one."
            centered
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ARMS.map(({ icon: Icon, title, tag, body, href }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <Link href={href} className="group block h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-canopy/10 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-canopy-800">
                  <span className="absolute inset-x-0 top-0 h-1 bg-gold-400" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-canopy text-gold-300">
                    <Icon size={24} />
                  </div>
                  <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-brand-red">
                    {tag}
                  </p>
                  <h3 className="mt-1.5 font-display text-xl font-semibold text-canopy">
                    {title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65 dark:text-paper/65">
                    {body}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-canopy dark:text-paper">
                    Explore
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
