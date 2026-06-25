import { getSessionProfile } from "@/lib/auth"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ActivityFeed from "@/components/features/dashboard/ActivityFeed"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"

export default async function MemberDashboard() {
  const session = await getSessionProfile()

  return (
    <>
      <DashboardHeading
        title={`Welcome, ${session.fullName.split(" ")[0]}`}
        subtitle="Your BYM membership overview"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Membership status" value="Verified" hint="Active member" />
        <StatCard label="My community" value="—" hint="Set on your profile" accent="blue" />
        <StatCard label="Volunteer teams" value={0} hint="Join an Action Team" accent="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Get involved</h3>
          <p className="mt-2 text-sm text-gray-600">
            Stand for your community as a Parliament Member, Council
            Representative, or Community Intelligence Officer — or join a
            Volunteer Action Team.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href="/cin" size="sm" variant="outline">
              About the CIN
            </Button>
            <Button href="/parliament" size="sm" variant="outline">
              About Parliament
            </Button>
          </div>
        </Card>
        <ActivityFeed
          items={[
            { title: "Your account was created", meta: "Just now" },
            { title: "Membership pending verification", meta: "Awaiting admin" },
          ]}
        />
      </div>
    </>
  )
}
