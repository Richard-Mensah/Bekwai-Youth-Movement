import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import { SDG_GOALS } from "@/constants/sdgs"

export const metadata: Metadata = {
  title: "SDG Alignment Framework",
  description:
    "BYM formally aligns every Unit, programme, and governance activity with 12 UN Sustainable Development Goals, contributing to Ghana's national SDG reporting.",
}

export default function SdgsPage() {
  return (
    <>
      <PageHeader
        eyebrow="UN Agenda 2030"
        title="SDG Alignment Framework"
        description="BYM aligns all its work with the United Nations Sustainable Development Goals, making it globally recognised and fundable by development partners."
      />

      <section className="container-content py-16">
        <SectionHeading
          eyebrow="Our commitment"
          title="12 goals BYM contributes to"
          description="BYM produces an annual SDG Progress Report, published alongside the State of the Community Report and presented to the Traditional Advisory Council at the annual durbar."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SDG_GOALS.map((sdg) => (
            <div
              key={sdg.goal}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            >
              <div
                className="flex items-center gap-3 px-5 py-4 text-white"
                style={{ backgroundColor: sdg.color }}
              >
                <span className="font-serif text-2xl font-bold">{sdg.goal}</span>
                <span className="text-sm font-semibold leading-tight">
                  {sdg.title}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
