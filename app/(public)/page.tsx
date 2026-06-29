import Hero from "@/components/features/public/Hero"
import TrustBar from "@/components/features/public/TrustBar"
import MissionIntro from "@/components/features/public/MissionIntro"
import JourneyTimeline from "@/components/features/public/JourneyTimeline"
import ImpactStats from "@/components/features/public/ImpactStats"
import ThreeArms from "@/components/features/public/ThreeArms"
import ProgramsGrid from "@/components/features/public/ProgramsGrid"
import SdgShowcase from "@/components/features/public/SdgShowcase"
import ImpactStoriesCarousel from "@/components/features/public/ImpactStoriesCarousel"
import NewsHighlights from "@/components/features/public/NewsHighlights"
import RepresentationBand from "@/components/features/public/RepresentationBand"
import MembersWall from "@/components/features/public/MembersWall"
import MemberVoices from "@/components/features/public/MemberVoices"
import ImpactTicker from "@/components/features/public/ImpactTicker"
import CredibilityBand from "@/components/features/public/CredibilityBand"
import FinanceTransparencyBand from "@/components/features/public/FinanceTransparencyBand"
import PartnersStrip from "@/components/features/public/PartnersStrip"
import GetInvolved from "@/components/features/public/GetInvolved"
import { getSettings, getGallery } from "@/lib/data/content"

export default async function HomePage() {
  const [settings, gallery] = await Promise.all([getSettings(), getGallery()])
  return (
    <>
      <Hero
        eyebrow={settings.heroEyebrow}
        title={settings.heroTitle}
        subtitle={settings.heroSubtitle}
        foundingDate={settings.foundingDate}
        images={gallery.slice(0, 8).map((g) => g.url)}
      />
      <ImpactTicker />
      <TrustBar />
      <MissionIntro />
      <ImpactStats />
      <FinanceTransparencyBand />
      <ThreeArms />
      <JourneyTimeline />
      <ProgramsGrid />
      <SdgShowcase />
      <ImpactStoriesCarousel />
      <NewsHighlights />
      <RepresentationBand />
      <MembersWall />
      <MemberVoices />
      <CredibilityBand />
      <PartnersStrip />
      <GetInvolved />
    </>
  )
}
