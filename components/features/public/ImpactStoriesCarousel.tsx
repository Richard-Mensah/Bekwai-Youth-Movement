import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import ImpactStoriesClient, {
  type Story,
} from "@/components/features/public/ImpactStoriesClient"
import { getProjects } from "@/lib/data/projects"

/** Homepage carousel of published community projects. */
export default async function ImpactStoriesCarousel() {
  const projects = await getProjects()
  const stories: Story[] = projects
    .filter((p) => p.isPublished)
    .map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      communityName: p.communityName,
      unitName: p.unitName,
      status: p.status,
      sdg: p.sdg,
    }))

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
        <ImpactStoriesClient stories={stories} />
      </div>
    </section>
  )
}
