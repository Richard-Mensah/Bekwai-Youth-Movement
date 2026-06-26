import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import LeaderCard from "@/components/features/public/LeaderCard"
import type { LeaderTierGroup } from "@/lib/data/content"

/** Renders one leadership tier (header + responsive grid of person cards). */
export default function LeadershipGrid({ tier }: { tier: LeaderTierGroup }) {
  return (
    <div id={tier.id} className="scroll-mt-24">
      <Reveal>
        <SectionHeading
          eyebrow={tier.eyebrow}
          title={tier.title}
          description={tier.description}
        />
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tier.members.map((leader, i) => (
          <Reveal key={leader.id} delay={(i % 3) * 0.06}>
            <LeaderCard leader={leader} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
