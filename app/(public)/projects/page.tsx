import type { Metadata } from "next"
import Image from "next/image"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import EmptyState from "@/components/ui/EmptyState"
import Badge from "@/components/ui/Badge"
import { getProjects } from "@/lib/data/projects"
import { PROJECT_STATUS_META, ghs } from "@/constants/projects"
import { placeholderImage } from "@/lib/images"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Community development projects delivered by BYM across 32 communities — each with a budget, SDG alignment, timeline, and progress reports.",
}

export default async function ProjectsPage() {
  const all = await getProjects()
  const published = all.filter((p) => p.isPublished)

  return (
    <>
      <PageHeader
        eyebrow="Community development"
        title="Projects"
        description="Approved and completed projects, published openly with their community, budget, and status."
      />

      <section className="container-content py-16">
        <SectionHeading eyebrow="Published" title="Our projects" />
        <div className="mt-8">
          {published.length === 0 ? (
            <EmptyState
              title="Published projects appear here"
              description="As the Cabinet approves and publishes projects, they appear here with budgets and SDG impact."
              phase="Roadmap Phase 4"
            />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {published.map((p) => {
                const meta = PROJECT_STATUS_META[p.status]
                return (
                  <div
                    key={p.id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    <div className="relative h-40 w-full bg-gray-100">
                      <Image
                        src={p.coverUrl ?? placeholderImage(p.id, 600, 360)}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-2">
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                        <span className="text-xs font-semibold text-brand-blue">
                          {ghs(p.budgetGhs)}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-bold text-canopy">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">{p.communityName}</p>
                      {p.description && (
                        <p className="mt-2 text-sm text-ink/65">{p.description}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
