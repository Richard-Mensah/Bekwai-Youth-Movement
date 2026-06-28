import Image from "next/image"
import { MapPin } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import Badge from "@/components/ui/Badge"
import { getProjects } from "@/lib/data/projects"
import { PROJECT_STATUS_META, ghs } from "@/constants/projects"

/** Homepage grid of published community projects (with cover images). */
export default async function ImpactStoriesCarousel() {
  const projects = await getProjects()
  const stories = projects.filter((p) => p.isPublished).slice(0, 6)
  if (stories.length === 0) return null

  return (
    <section className="section">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Impact in motion"
            title="Real projects, real communities"
            description="From sanitation drives to scholarships, here's how youth energy is becoming measurable change on the ground."
            centered
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((p, i) => {
            const meta = PROJECT_STATUS_META[p.status]
            return (
              <Reveal key={p.id} delay={(i % 3) * 0.07}>
                <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="relative h-44 w-full bg-canopy-50">
                    {p.coverUrl ? (
                      <Image
                        src={p.coverUrl}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-canopy to-canopy-700">
                        <MapPin className="text-gold-300/60" size={32} />
                      </div>
                    )}
                    <span className="absolute left-3 top-3">
                      <Badge tone={meta.tone}>{meta.label}</Badge>
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold text-canopy">
                      {p.name}
                    </h3>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-ink/55">
                      <MapPin size={13} className="text-gold-500" />
                      {p.communityName}
                    </p>
                    {p.description && (
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-ink/65">
                        {p.description}
                      </p>
                    )}
                    {p.budgetGhs > 0 && (
                      <p className="mt-3 text-sm font-semibold text-brand-green">
                        {ghs(p.budgetGhs)}
                      </p>
                    )}
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
