import Link from "next/link"
import {
  getBudgets,
  getScorecards,
  getPublicReports,
  getAnnualReports,
} from "@/lib/data/transparency"
import { ghs } from "@/constants/projects"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import TransparencyForm from "@/components/features/transparency/TransparencyForm"
import PublishToggle from "@/components/features/transparency/PublishToggle"
import Card from "@/components/ui/Card"

export default async function AdminTransparencyPage() {
  const [budgets, scorecards, reports, annual] = await Promise.all([
    getBudgets({ includeUnpublished: true }),
    getScorecards({ includeUnpublished: true }),
    getPublicReports({ includeUnpublished: true }),
    getAnnualReports({ includeUnpublished: true }),
  ])

  return (
    <>
      <Link
        href="/dashboard/admin"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Back to Administration
      </Link>
      <DashboardHeading
        title="Transparency publishing"
        subtitle="Control what appears on the public Transparency Portal"
      />

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-canopy">Budgets</h3>
            <ul className="mt-3 space-y-2">
              {budgets.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{b.title}</p>
                    <p className="text-xs text-ink/45">
                      Income {ghs(b.incomeGhs)} · Spend {ghs(b.expenditureGhs)}
                    </p>
                  </div>
                  <PublishToggle table="published_budgets" id={b.id} isPublished={b.isPublished} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-canopy">Public reports</h3>
            <ul className="mt-3 space-y-2">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-gray-700">{r.title}</p>
                  <PublishToggle table="public_reports" id={r.id} isPublished={r.isPublished} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-canopy">Annual & SDG reports</h3>
            <ul className="mt-3 space-y-2">
              {annual.map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-gray-700">{a.title} · {a.year}</p>
                  <PublishToggle table="annual_reports" id={a.id} isPublished={a.isPublished} />
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-canopy">Community scorecards</h3>
            <ul className="mt-3 space-y-2">
              {scorecards.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-gray-700">
                    {s.communityName} · {s.period} · {s.score ?? "—"}
                  </p>
                  <PublishToggle table="community_scorecards" id={s.id} isPublished={s.isPublished} />
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card>
          <h3 className="text-sm font-bold text-canopy">Create record</h3>
          <p className="mt-1 text-xs text-ink/55">New records start as drafts.</p>
          <div className="mt-4">
            <TransparencyForm />
          </div>
        </Card>
      </div>
    </>
  )
}
