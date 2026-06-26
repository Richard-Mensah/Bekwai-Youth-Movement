import Hero from "@/components/features/public/Hero"
import TrustBar from "@/components/features/public/TrustBar"
import MissionIntro from "@/components/features/public/MissionIntro"
import JourneyTimeline from "@/components/features/public/JourneyTimeline"
import ImpactStats from "@/components/features/public/ImpactStats"
import ThreeArms from "@/components/features/public/ThreeArms"
import ProgramsGrid from "@/components/features/public/ProgramsGrid"
import SdgShowcase from "@/components/features/public/SdgShowcase"
import NewsHighlights from "@/components/features/public/NewsHighlights"
import RepresentationBand from "@/components/features/public/RepresentationBand"
import CredibilityBand from "@/components/features/public/CredibilityBand"
import GetInvolved from "@/components/features/public/GetInvolved"
import { getSettings } from "@/lib/data/content"

export default async function HomePage() {
  const settings = await getSettings()
  return (
    <>
      <Hero
        eyebrow={settings.heroEyebrow}
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        foundingDate={settings.foundingDate}
      />
      <TrustBar />
      <MissionIntro />
      <ImpactStats />
      <ThreeArms />
      <JourneyTimeline />
      <ProgramsGrid />
      <SdgShowcase />
      <NewsHighlights />
      <RepresentationBand />
      <CredibilityBand />
      <GetInvolved />
    </>
  )
}
