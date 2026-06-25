import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ActivityFeed from "@/components/features/dashboard/ActivityFeed"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import EmptyState from "@/components/ui/EmptyState"

export default function CinDashboard() {
  return (
    <>
      <DashboardHeading
        title="Community Intelligence"
        subtitle="Monthly reporting for your community"
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Reports filed" value={0} hint="This year" />
        <StatCard label="Open issues" value={0} hint="Awaiting resolution" accent="red" />
        <StatCard label="Resolved" value={0} hint="Closed issues" />
        <StatCard label="This month" value="Pending" hint="Submit by month-end" accent="blue" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-brand-green-700">
              Monthly Community Report
            </h3>
            <Button size="sm" disabled>
              New report
            </Button>
          </div>
          <div className="mt-4">
            <EmptyState
              title="Reporting form arrives in Phase 2"
              description="Submit standardised monthly reports with categories, severity, evidence photos, and GPS — then track them to resolution."
              phase="Roadmap Phase 2"
            />
          </div>
        </Card>
        <ActivityFeed
          items={[
            { title: "CIN module scheduled", meta: "Roadmap Phase 2" },
            { title: "Share summaries with your sub-chief", meta: "Monthly protocol" },
          ]}
        />
      </div>
    </>
  )
}
