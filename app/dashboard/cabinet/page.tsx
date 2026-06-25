import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ActivityFeed from "@/components/features/dashboard/ActivityFeed"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import EmptyState from "@/components/ui/EmptyState"

export default function CabinetDashboard() {
  return (
    <>
      <DashboardHeading
        title="Executive Cabinet"
        subtitle="Portfolio projects, budgets, and KPIs"
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Active projects" value={0} hint="In my portfolio" />
        <StatCard label="Budget (GHS)" value="—" hint="Allocated this year" accent="blue" />
        <StatCard label="Pending approvals" value={0} hint="Awaiting sign-off" accent="red" />
        <StatCard label="Completed" value={0} hint="Delivered projects" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            Project portfolio
          </h3>
          <div className="mt-4">
            <EmptyState
              title="Project & budget management arrives in Phase 4"
              description="Manage your Unit's projects across the lifecycle, track budgets and expenditure, and monitor KPIs against SDG targets."
              phase="Roadmap Phase 4"
            />
          </div>
        </Card>
        <ActivityFeed
          items={[
            { title: "Cabinet module scheduled", meta: "Roadmap Phase 4" },
            { title: "Monthly Cabinet meeting", meta: "Collective accountability" },
          ]}
        />
      </div>
    </>
  )
}
