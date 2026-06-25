import Hero from "@/components/features/public/Hero"
import ImpactStats from "@/components/features/public/ImpactStats"
import ThreeArms from "@/components/features/public/ThreeArms"
import SdgStrip from "@/components/features/public/SdgStrip"
import JoinBanner from "@/components/features/public/JoinBanner"
import SectionHeading from "@/components/ui/SectionHeading"

export default function HomePage() {
  return (
    <>
      <Hero />
      <ImpactStats />
      <ThreeArms />

      <section className="bg-paper">
        <div className="container-content py-16">
          <SectionHeading
            eyebrow="Global alignment"
            title="Aligned with the UN Sustainable Development Goals"
            description="Every Unit, programme, and governance activity maps to the UN 2030 Agenda — making BYM's work globally recognised and fundable by development partners."
          />
          <div className="mt-8">
            <SdgStrip />
          </div>
        </div>
      </section>

      <JoinBanner />
    </>
  )
}
