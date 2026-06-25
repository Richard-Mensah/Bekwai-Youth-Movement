import { ArrowUpRight } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import Badge from "@/components/ui/Badge"
import { FEATURED_NEWS } from "@/constants/news"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  })
}

/** "BYM on the global stage" — real international participation, from Medium. */
export default function NewsHighlights() {
  return (
    <section className="section bg-paper">
      <div className="container-content">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="On the global stage"
            title="Youth from Sefwi Bekwai, engaging the world"
            description="Since 2023, BYM delegates have represented our communities at international summits on climate, biodiversity, and the Sustainable Development Goals."
          />
          <a
            href="/news"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-canopy hover:text-canopy-600"
          >
            All news & press
            <ArrowUpRight size={16} />
          </a>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_NEWS.map((item, i) => (
            <Reveal key={item.title} delay={(i % 4) * 0.06}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {item.context}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ink/30 transition-colors group-hover:text-canopy"
                  />
                </div>
                <h3 className="mt-3 font-display text-base font-semibold leading-snug text-canopy">
                  {item.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60">
                  {item.summary}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-ink/45">{formatDate(item.date)}</span>
                  {item.sdg && item.sdg.length > 0 && (
                    <Badge tone="canopy">SDG {item.sdg[0]}</Badge>
                  )}
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
