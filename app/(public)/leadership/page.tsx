import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import OrgChart from "@/components/features/public/OrgChart"
import { UNITS } from "@/constants/units"

export const metadata: Metadata = {
  title: "Leadership & Structure",
  description:
    "The BYM Youth General Assembly leadership — a 19-member Civic Cabinet led by the Director-General, operating through 7 Units, with the Traditional Advisory Council in honorary oversight.",
}

const TAC = [
  "Paramount Chief of Sefwi Bekwai — Patron",
  "Sub-Chiefs of the 31 sub-communities — Community Patrons",
  "Queenmother of Sefwi Bekwai — Women's Patron",
  "Municipal Chief Executive — Government Liaison Patron",
]

export default function LeadershipPage() {
  return (
    <>
      <PageHeader
        eyebrow="Governance structure"
        title="Leadership of the Youth General Assembly"
        description="Modelled on the UK Cabinet system and Ghana's constitutional tradition — clear portfolio accountability under the Director-General."
      />

      <section className="container-content py-16">
        <SectionHeading
          eyebrow="The Executive"
          title="Cabinet org chart"
          description="The 19-member Civic Cabinet, top-down from the Director-General. Reporting lines reflect the official governance framework."
        />
        <div className="mt-10">
          <OrgChart />
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-content py-16">
          <SectionHeading
            eyebrow="Operational engine"
            title="The 7 Units"
            description="Each Unit has a defined mandate, a portfolio officer, and a direct SDG alignment."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {UNITS.map((u) => (
              <Card key={u.no}>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-brand-green-700">
                    {u.name}
                  </h3>
                  <span className="text-xs font-bold text-gray-300">
                    {String(u.no).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 text-sm text-gray-600">{u.mandate}</p>
                <p className="mt-3 text-xs font-medium text-gray-500">
                  Led by: {u.officer}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {u.sdg.map((g) => (
                    <Badge key={g} tone="blue">
                      SDG {g}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="container-content py-16">
        <SectionHeading
          eyebrow="Honorary oversight"
          title="Traditional Advisory Council"
          description="The highest honorary body — it holds no executive power but commands moral authority, community trust, and cultural legitimacy, and provides formal endorsement."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TAC.map((m) => (
            <div
              key={m}
              className="rounded-lg border border-gray-200 bg-white px-5 py-4 text-sm font-medium text-gray-700 shadow-sm"
            >
              {m}
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
