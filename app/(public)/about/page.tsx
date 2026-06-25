import Image from "next/image"
import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Card from "@/components/ui/Card"

export const metadata: Metadata = {
  title: "About & History",
  description:
    "The story of the Bekwai Youth Movement — from its grassroots beginnings in 2021 to a structured youth governance institution serving 32 communities.",
}

const PRINCIPLES = [
  ["Non-political", "Strictly non-partisan. No member uses their position for any political party or candidate."],
  ["Service over self", "Members serve the community, never personal or sectional interests."],
  ["Inclusion & equality", "At least 40% of all positions are held by women; every community matters equally."],
  ["Accountability", "All finances, reports, and project outcomes are published and open to scrutiny."],
  ["Traditional authority", "BYM acts only with the blessing and permission of the relevant sub-chief."],
]

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Who we are"
        title="About the Bekwai Youth Movement"
        description="A non-political youth governance institution in Sefwi Bekwai, Western North Region, Ghana — built to harness the potential of every young person."
      />

      <section className="container-content py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our journey" title="From 2021 to today" />
            <div className="mt-5 space-y-4 text-gray-600 leading-relaxed">
              <p>
                What began as a small group of volunteers in 2021 has grown into a
                structured movement with an interim executive, advising partners,
                and a clear governance vision.
              </p>
              <p>
                In 2026, BYM formalised its governance framework: a Youth General
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
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              "472766257_1643725496219109_5142496528883252813_n.jpg",
              "472658272_1643725659552426_3841496885343756339_n.jpg",
              "472537382_1644476426144016_8168085223803727278_n.jpg",
              "when we first started with an interview.jpg",
            ].map((img) => (
              <div key={img} className="relative aspect-square overflow-hidden rounded-xl">
                <Image
                  src={`/images/history/${img}`}
                  alt="Bekwai Youth Movement community activity, 2021–2024"
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-content py-16">
          <SectionHeading
            eyebrow="What guides us"
            title="Core principles & code of conduct"
            centered
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map(([title, body]) => (
              <Card key={title}>
                <h3 className="text-base font-bold text-brand-green-700">{title}</h3>
                <p className="mt-2 text-sm text-gray-600">{body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
