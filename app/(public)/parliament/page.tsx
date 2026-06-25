import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Card from "@/components/ui/Card"

export const metadata: Metadata = {
  title: "Bekwai Youth Parliament",
  description:
    "The Bekwai Youth Parliament — a Speaker-led legislative chamber giving youth a voice through bills, motions, debates, committees, and Youth Recommendations.",
}

const BILL_STAGES = [
  "Draft",
  "First Reading",
  "Second Reading",
  "Committee Stage",
  "Third Reading",
  "Passed / Rejected",
]

const COMMITTEES = [
  "Education, Youth & Skills Development",
  "Health, Sanitation & Environment",
  "Agriculture, Trade & Economic Development",
  "Community Infrastructure & Housing",
  "Gender, Social Welfare & Inclusion",
  "Security, Peace & Conflict Resolution",
  "Rules, Privileges & Disciplinary Matters",
  "Finance & Resource Mobilisation",
]

const OFFICERS = [
  ["Speaker", "Presides over all sittings; certifies Youth Recommendations."],
  ["Deputy Speaker(s)", "Deputise the Speaker; oversee procedural compliance."],
  ["Majority & Minority Leaders", "Lead caucuses; balance debate."],
  ["Clerk", "Maintains Hansard, Minutes, and the Register of Members."],
  ["Serjeant-at-Arms", "Maintains order; carries the mace."],
  ["32 Community Members", "One per community; serve the legislative voice of youth."],
]

export default function ParliamentPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Legislative Arm"
        title="Bekwai Youth Parliament"
        description="Mirroring the Parliament of Ghana and governed by its own Standing Orders — the supreme deliberative voice of the Movement's youth."
      />

      <section className="container-content py-16">
        <SectionHeading
          eyebrow="How a bill becomes law"
          title="The legislative lifecycle"
          description="Every bill passes through three readings and a committee stage before adoption, signed by the Speaker and transmitted to the Assembly."
        />
        <ol className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BILL_STAGES.map((stage, i) => (
            <li
              key={stage}
              className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-green text-xs font-bold text-white">
                {i + 1}
              </span>
              <span className="text-sm font-medium text-gray-700">{stage}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-paper">
        <div className="container-content py-16">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <SectionHeading eyebrow="Officers" title="Who runs Parliament" />
              <div className="mt-6 space-y-3">
                {OFFICERS.map(([role, desc]) => (
                  <div key={role} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <p className="text-sm font-bold text-brand-green-700">{role}</p>
                    <p className="mt-1 text-sm text-gray-600">{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <SectionHeading eyebrow="Scrutiny" title="Standing Committees" />
              <div className="mt-6 grid gap-3">
                {COMMITTEES.map((c) => (
                  <Card key={c} className="py-4">
                    <p className="text-sm font-medium text-gray-700">{c}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
