import Link from "next/link"
import Image from "next/image"
import { Landmark, Vote, Radar, ArrowRight } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"

const ARMS = [
  {
    icon: Landmark,
    title: "Youth General Assembly",
    tag: "Executive · New initiative",
    href: "/leadership",
    img: "/images/history/279361960_158851559944757_3313056682566741472_n.jpg",
    body: "A 19-member Civic Cabinet led by the Director-General, modelled on the UK Cabinet system, delivering policy and community development across 7 Units.",
  },
  {
    icon: Vote,
    title: "Bekwai Youth Parliament",
    tag: "Legislative · New initiative",
    href: "/parliament",
    img: "/images/history/IMG-20211114-WA0037.jpg",
    body: "A Speaker-led chamber giving legislative voice to youth aged 10–45, with bills, motions, debates, and Youth Recommendations, one Member per community.",
  },
  {
    icon: Radar,
    title: "Community Intelligence Network",
    tag: "Intelligence",
    href: "/cin",
    img: "/images/history/275513517_145137107982869_5887215383066194674_n.jpg",
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
            description="A separation of powers adapted to the Ghanaian community context: an executive, a legislature, and a grassroots intelligence network working as one."
            centered
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ARMS.map(({ icon: Icon, title, tag, body, href, img }, i) => (
            <Reveal key={title} delay={i * 0.08}>
              <Link href={href} className="group block h-full">
                <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-canopy-800">
                  {/* Image banner with overlapping icon */}
                  <div className="relative h-44 overflow-hidden">
                    <Image
                      src={img}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-canopy/85 via-canopy/25 to-transparent" />
                    <span className="absolute inset-x-0 top-0 z-10 h-1 bg-gold-400" />
                    <span className="absolute left-5 top-4 z-10 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-red shadow-sm">
                      {tag}
                    </span>
                    <div className="absolute -bottom-5 left-5 z-10 flex h-12 w-12 items-center justify-center rounded-xl bg-canopy text-gold-300 shadow-lg ring-4 ring-white dark:ring-canopy-800">
                      <Icon size={24} />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-7 pt-8">
                    <h3 className="font-display text-xl font-semibold text-canopy dark:text-paper">
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
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
