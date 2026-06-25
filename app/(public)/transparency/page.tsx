import type { Metadata } from "next"
import { FileText } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Card from "@/components/ui/Card"
import EmptyState from "@/components/ui/EmptyState"
import SdgProgress from "@/components/features/transparency/SdgProgress"
import { scoreColor } from "@/constants/cin"
import { ghs } from "@/constants/projects"
import {
  getBudgets,
  getScorecards,
  getPublicReports,
  getAnnualReports,
  getSdgProgress,
} from "@/lib/data/transparency"

export const metadata: Metadata = {
  title: "Transparency Portal",
  description:
    "Public access to BYM's published budgets, community scorecards, annual and SDG reports — accountability by design.",
}

export default async function TransparencyPage() {
  const [budgets, scorecards, reports, annual, sdg] = await Promise.all([
    getBudgets(),
    getScorecards(),
    getPublicReports(),
    getAnnualReports(),
    getSdgProgress(),
  ])

  return (
    <>
      <PageHeader
        eyebrow="Accountability"
        title="Transparency Portal"
        description="BYM publishes its finances, community data, and project outcomes openly — so members and stakeholders can hold the Assembly to account."
      />

      <section className="container-content py-16">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionHeading title="Published budgets" />
            <div className="mt-4 overflow-x-auto">
              {budgets.length === 0 ? (
                <p className="text-sm text-gray-500">No budgets published yet.</p>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400">
                      <th className="py-2 pr-4 font-medium">Period</th>
                      <th className="py-2 pr-4 font-medium text-right">Income</th>
                      <th className="py-2 pr-4 font-medium text-right">Expenditure</th>
                    </tr>
                  </thead>
                  <tbody>
                    {budgets.map((b) => (
                      <tr key={b.id} className="border-b border-gray-100">
                        <td className="py-2 pr-4 font-medium text-gray-700">{b.title}</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{ghs(b.incomeGhs)}</td>
                        <td className="py-2 pr-4 text-right text-gray-600">{ghs(b.expenditureGhs)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <Card>
            <SectionHeading title="SDG progress" />
            <p className="mt-1 text-xs text-gray-500">Projects aligned to each goal</p>
            <div className="mt-4">
              <SdgProgress data={sdg} />
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <SectionHeading title="Community scorecards" />
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {scorecards.map((s) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-gray-100 p-4 text-center"
                >
                  <div
                    className="mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: scoreColor(s.score ?? 0) }}
                  >
                    {s.score ?? "—"}
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">{s.communityName}</p>
                  <p className="text-xs text-gray-400">{s.period}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <SectionHeading title="Public reports" />
            <ul className="mt-4 space-y-2">
              {reports.map((r) => (
                <li key={r.id} className="flex items-start gap-3 rounded-lg border border-gray-100 p-3">
                  <FileText size={18} className="mt-0.5 shrink-0 text-brand-green" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{r.title}</p>
                    {r.summary && <p className="text-xs text-gray-500">{r.summary}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <SectionHeading title="Annual & SDG reports" />
            <div className="mt-4">
              {annual.length === 0 ? (
                <EmptyState
                  title="Annual reports appear here"
                  description="The annual performance and SDG progress reports are published yearly."
                  phase="Published annually"
                />
              ) : (
                <ul className="space-y-2">
                  {annual.map((a) => (
                    <li key={a.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                      <p className="text-sm font-medium text-gray-700">{a.title}</p>
                      <span className="text-xs text-gray-400">{a.year}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        </div>
      </section>
    </>
  )
}
