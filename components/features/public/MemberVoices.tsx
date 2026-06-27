import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import MemberVoicesClient from "@/components/features/public/MemberVoicesClient"
import { getTestimonials } from "@/lib/data/content"

/** "Member voices" — rotating testimonials, managed in the CMS. */
export default async function MemberVoices() {
  const items = await getTestimonials()
  if (items.length === 0) return null

  return (
    <section className="section">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Member voices"
            title="Why young people join us"
            centered
          />
        </Reveal>
        <Reveal delay={0.1}>
          <MemberVoicesClient items={items} />
        </Reveal>
      </div>
    </section>
  )
}
