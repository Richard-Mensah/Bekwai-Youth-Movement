import type { Metadata } from "next"
import { ArrowUpRight } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import Badge from "@/components/ui/Badge"
import { NEWS } from "@/constants/news"
import { ORG } from "@/constants/nav"

export const metadata: Metadata = {
  title: "News & Press",
  description:
    "Bekwai Youth Movement on the local and global stage — summits, partnerships, and stories from our communities.",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default function NewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Media"
        title="News & press"
        description="From grassroots Sefwi Bekwai to international summits — a record of where the movement has shown up and what we've learned."
      />

      <section className="section">
        <div className="container-content grid gap-6 md:grid-cols-2">
          {NEWS.map((item) => (
            <a
              key={item.title}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
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
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-canopy">
                {item.title}
              </h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                {item.summary}
              </p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-ink/45">{formatDate(item.date)}</span>
                <div className="flex gap-1.5">
                  {item.sdg?.slice(0, 3).map((g) => (
                    <Badge key={g} tone="canopy">
                      SDG {g}
                    </Badge>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="container-content mt-12 text-center">
          <a
            href={ORG.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy hover:text-canopy-600"
          >
            Read more on our Medium publication
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </>
  )
}
