import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import EmptyState from "@/components/ui/EmptyState"

export default function ElderDashboard() {
  return (
    <>
      <DashboardHeading
        title="Traditional Advisory Council"
        subtitle="Read-only oversight & formal endorsements"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending endorsements" value={0} hint="Awaiting your review" accent="red" />
        <StatCard label="Communities" value={32} hint="Under advisory" accent="blue" />
        <StatCard label="Annual durbar" value="—" hint="Accountability report" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            Endorsement requests
          </h3>
          <div className="mt-4">
            <EmptyState
              title="Endorsement workflow arrives in Phase 6"
              description="Review and formally endorse nominations, projects, and policies. Your role is read-only across the platform, with endorsement actions."
              phase="Roadmap Phase 6"
            />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            Governance visibility
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            As a Council member you can view leadership, projects, and published
            reports across the Movement.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href="/leadership" size="sm" variant="outline">
              Leadership
            </Button>
            <Button href="/transparency" size="sm" variant="outline">
              Transparency
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}
