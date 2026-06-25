import Link from "next/link"
import { getSessionProfile } from "@/lib/auth"
import { getReports, computeStats } from "@/lib/data/cin"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ReportForm from "@/components/features/cin/ReportForm"
import ReportsTable from "@/components/features/cin/ReportsTable"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"

export default async function CinDashboard() {
  const session = await getSessionProfile()
  const rows = await getReports(session.userId ?? undefined)
  const stats = computeStats(rows)

  return (
    <>
      <DashboardHeading
        title="Community Intelligence"
        subtitle="Submit and track your monthly community reports"
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Reports filed" value={stats.filed} hint="All time" />
        <StatCard label="Open issues" value={stats.open} hint="Awaiting resolution" accent="red" />
        <StatCard label="Resolved" value={stats.resolved} hint="Closed issues" />
        <StatCard label="Escalated" value={stats.escalated} hint="Raised to Director" accent="blue" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]" id="reports">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            New monthly report
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Share a summary with your sub-chief before submission (monthly protocol).
          </p>
          <div className="mt-4">
            <ReportForm defaultCommunityId={session.role === "cin_officer" ? undefined : undefined} />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-green-700">
              {session.userId ? "My reports" : "Reports (sample)"}
            </h3>
            <Link
              href="/dashboard/cin/analytics"
              className="text-xs font-medium text-brand-green hover:underline"
            >
              View analytics →
            </Link>
          </div>
          <div className="mt-4">
            <ReportsTable rows={rows} />
          </div>
        </Card>
      </div>
    </>
  )
}
