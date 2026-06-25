import Link from "next/link"
import {
  getReports,
  computeStats,
  communityScores,
  categoryCounts,
  severityCounts,
  monthlyTrend,
} from "@/lib/data/cin"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import CategoryBarChart from "@/components/features/cin/CategoryBarChart"
import SeverityDonut from "@/components/features/cin/SeverityDonut"
import TrendLine from "@/components/features/cin/TrendLine"
import CommunityHeatmap from "@/components/features/cin/CommunityHeatmap"

export default async function CinAnalyticsPage() {
  const rows = await getReports()
  const stats = computeStats(rows)
  const scores = communityScores(rows)
  const ranked = [...scores].sort((a, b) => b.score - a.score)
  const needAttention = [...scores].sort((a, b) => a.score - b.score).slice(0, 5)

  return (
    <>
      <DashboardHeading
        title="CIN Analytics"
        subtitle="Aggregate community intelligence across all 32 communities"
      />
      <Link
        href="/dashboard/cin"
        className="mb-4 inline-block text-sm text-brand-green hover:underline"
      >
        ← Back to my reports
      </Link>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total reports" value={stats.filed} hint="All communities" />
        <StatCard label="Open" value={stats.open} accent="red" />
        <StatCard label="Resolved" value={stats.resolved} />
        <StatCard label="Escalated" value={stats.escalated} accent="blue" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Reporting trend</h3>
          <p className="mt-1 text-xs text-gray-500">Reports submitted per month</p>
          <div className="mt-3">
            <TrendLine data={monthlyTrend(rows)} />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Severity mix</h3>
          <p className="mt-1 text-xs text-gray-500">All reports by severity</p>
          <div className="mt-3">
            <SeverityDonut data={severityCounts(rows)} />
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Issues by category</h3>
          <div className="mt-3">
            <CategoryBarChart data={categoryCounts(rows)} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            Community development heatmap
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Score per community (higher is better)
          </p>
          <div className="mt-4">
            <CommunityHeatmap scores={scores} />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            Communities needing attention
          </h3>
          <ul className="mt-3 space-y-2">
            {needAttention.map((c, i) => (
              <li
                key={c.communityId}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 text-sm"
              >
                <span className="font-medium text-gray-700">
                  {i + 1}. {c.communityName}
                </span>
                <span className="text-xs text-gray-500">
                  {c.open} open · score {c.score}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-green-700">
            Top communities
          </p>
          <ul className="mt-2 space-y-1 text-xs text-gray-500">
            {ranked.slice(0, 3).map((c) => (
              <li key={c.communityId}>
                {c.communityName} — score {c.score}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
