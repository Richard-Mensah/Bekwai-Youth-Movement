import Link from "next/link"
import { ArrowRight } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import { SDG_GOALS } from "@/constants/sdgs"

/** Rich, colour-coded showcase of the 12 aligned UN Global Goals. */
export default function SdgShowcase() {
  return (
    <section className="section">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Global alignment"
            title="Aligned with 12 UN Sustainable Development Goals"
            description="Every unit, programme, and governance activity maps to the UN 2030 Agenda — making BYM's work globally recognised and fundable by development partners."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {SDG_GOALS.map((sdg) => (
              <div
                key={sdg.goal}
                className="group flex flex-col justify-between rounded-xl p-4 text-white shadow-card transition-transform duration-300 hover:-translate-y-1"
                style={{ backgroundColor: sdg.color }}
              >
                <span className="font-display text-2xl font-bold">
                  {String(sdg.goal).padStart(2, "0")}
                </span>
                <span className="mt-6 text-xs font-semibold leading-snug">
                  {sdg.title}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/sdgs"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-canopy hover:text-canopy-600"
          >
            See our full SDG alignment framework
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
