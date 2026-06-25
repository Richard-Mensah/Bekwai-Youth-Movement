import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ActivityFeed from "@/components/features/dashboard/ActivityFeed"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import EmptyState from "@/components/ui/EmptyState"

export default function MpDashboard() {
  return (
    <>
      <DashboardHeading
        title="Bekwai Youth Parliament"
        subtitle="Your legislative workspace"
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Active bills" value={0} hint="In the chamber" />
        <StatCard label="Open motions" value={0} hint="Awaiting debate" accent="blue" />
        <StatCard label="My attendance" value="—" hint="This session" />
        <StatCard label="Committees" value={0} hint="My memberships" accent="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Order paper</h3>
          <div className="mt-4">
            <EmptyState
              title="Live bills, motions & voting arrive in Phase 3"
              description="Track bills through three readings and committee stage, submit motions, and vote in real time during sittings."
              phase="Roadmap Phase 3"
            />
          </div>
        </Card>
        <ActivityFeed
          items={[
            { title: "Parliament module scheduled", meta: "Roadmap Phase 3" },
            { title: "Youth Recommendations tracker", meta: "Bridges to Cabinet" },
          ]}
        />
      </div>
    </>
  )
}
