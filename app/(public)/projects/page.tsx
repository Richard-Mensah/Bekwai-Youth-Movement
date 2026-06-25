import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import EmptyState from "@/components/ui/EmptyState"
import Badge from "@/components/ui/Badge"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Community development projects delivered by BYM across 32 communities — each with a budget, SDG alignment, timeline, and progress reports.",
}

const STATUSES: { label: string; tone: "gray" | "blue" | "amber" | "green" | "red" }[] = [
  { label: "Proposed", tone: "gray" },
  { label: "Approved", tone: "blue" },
  { label: "In Progress", tone: "amber" },
  { label: "Completed", tone: "green" },
  { label: "Suspended", tone: "red" },
]

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community development"
        title="Projects"
        description="Every project carries a community, budget, SDG alignment, timeline, and published progress and completion reports."
      />

      <section className="container-content py-16">
        <SectionHeading eyebrow="Lifecycle" title="Project status pipeline" />
        <div className="mt-6 flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Badge key={s.label} tone={s.tone}>
              {s.label}
            </Badge>
          ))}
        </div>

        <div className="mt-10">
          <EmptyState
            title="Published projects appear here"
            description="Once the Executive Cabinet & Projects module goes live, approved and completed projects will be published with budgets, images, and SDG impact."
            phase="Roadmap Phase 4"
          />
        </div>
      </section>
    </>
  )
}
