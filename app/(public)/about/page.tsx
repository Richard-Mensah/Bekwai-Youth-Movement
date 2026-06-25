import Image from "next/image"
import type { Metadata } from "next"
import {
  ShieldCheck,
  HandHeart,
  Scale,
  Eye,
  Landmark,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import JourneyTimeline from "@/components/features/public/JourneyTimeline"

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of the Bekwai Youth Movement — from its grassroots beginnings to a structured youth governance movement serving 32 communities.",
}

const PRINCIPLES: [LucideIcon, string, string][] = [
  [ShieldCheck, "Non-political", "Strictly non-partisan. No member uses their position for any political party or candidate."],
  [HandHeart, "Service over self", "Members serve the community, never personal or sectional interests."],
  [Scale, "Inclusion & equality", "At least 40% of all positions are held by women; every community matters equally."],
  [Eye, "Accountability", "All finances, reports, and project outcomes are published and open to scrutiny."],
  [Landmark, "Traditional authority", "BYM acts only with the blessing and permission of the relevant sub-chief."],
]

const TAC = [
  ["Paramount Chief of Sefwi Bekwai", "Patron of the Assembly"],
  ["Sub-Chiefs of the 31 sub-communities", "Community Patrons"],
  ["Queenmother of Sefwi Bekwai", "Women's Patron"],
  ["Municipal Chief Executive", "Government Liaison Patron"],
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="About the Bekwai Youth Movement"
        description="A non-political youth movement in Sefwi Bekwai, Western North Region, Ghana — built to harness the potential of every young person."
      />

      {/* Our story */}
      <section className="section">
        <div className="container-content grid gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading eyebrow="Our story" title="A movement built from the ground up" />
            <div className="mt-5 space-y-4 leading-relaxed text-ink/70">
              <p>
                What began as a small group of volunteers has grown into a
                structured movement with a founding leadership, advising partners,
                and a clear governance vision for Sefwi Bekwai.
              </p>
              <p>
                The movement is now formalising its governance: a Youth General
                Assembly modelled on the UK Cabinet, a Bekwai Youth Parliament
                mirroring the Parliament of Ghana, and a Community Intelligence
                Network rooted in all 32 communities — all aligned with the UN SDGs.
              </p>
              <p>
                Our mission is to harness the potential of all young people in Sefwi
                Bekwai and its 31 surrounding sub-communities through structured
                governance, community intelligence, volunteerism, and sustained
                leadership development.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="grid grid-cols-2 gap-4">
              {[
                "472766257_1643725496219109_5142496528883252813_n.jpg",
                "472658272_1643725659552426_3841496885343756339_n.jpg",
                "472537382_1644476426144016_8168085223803727278_n.jpg",
                "when we first started with an interview.jpg",
              ].map((img) => (
                <div key={img} className="relative aspect-square overflow-hidden rounded-2xl">
                  <Image
                    src={`/images/history/${img}`}
                    alt="Bekwai Youth Movement community activity"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <div id="timeline" className="scroll-mt-20">
        <JourneyTimeline />
      </div>

      {/* Principles */}
      <section id="principles" className="section scroll-mt-20 bg-paper">
        <div className="container-content">
          <Reveal>
            <SectionHeading
              eyebrow="What guides us"
              title="Core principles & code of conduct"
              centered
            />
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(([Icon, title, body], i) => (
              <Reveal key={title} delay={(i % 3) * 0.07}>
                <div className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                    <Icon size={20} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-canopy">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Traditional Authority */}
      <section id="tac" className="section scroll-mt-20">
        <div className="container-content">
          <Reveal>
            <SectionHeading
              eyebrow="Honorary oversight"
              title="The Traditional Advisory Council"
              description="The highest honorary body in the movement — it holds no executive power but commands moral authority, community trust, and cultural legitimacy, and guards BYM's non-political values."
            />
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {TAC.map(([name, role], i) => (
              <Reveal key={name} delay={(i % 2) * 0.07}>
                <div className="flex items-center gap-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-canopy text-gold-300">
                    <Landmark size={20} />
                  </span>
                  <div>
                    <p className="font-semibold text-canopy">{name}</p>
                    <p className="text-sm text-ink/55">{role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
