import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import CommunityMapInteractive from "@/components/features/public/CommunityMapInteractive"
import { getCommunities } from "@/lib/data/content"

/** Interactive exploration of all communities and their representation. */
export default async function CommunityMap() {
  const communities = await getCommunities()
  if (communities.length === 0) return null

  return (
    <section className="section bg-paper">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Explore the map"
            title="Representation in every corner of Sefwi Bekwai"
            description="From the town to the furthest sub-community, no one is left without a voice. Explore how each of our communities is represented."
            centered
          />
        </Reveal>
        <CommunityMapInteractive communities={communities} />
      </div>
    </section>
  )
}
