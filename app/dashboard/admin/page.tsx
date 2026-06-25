import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import GenderComplianceChart from "@/components/features/dashboard/GenderComplianceChart"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { COMMUNITY_COUNT } from "@/constants/communities"

const NEW_FEATURES = [
  ["Nomination & Vetting Pipeline", "8-week, 5-step applicant tracking to Letters of Appointment.", "Phase 6"],
  ['"No Community Left Without a Voice"', "Gap tracker for vacant seats + 3-tier interim protocol.", "Phase 6"],
  ["Gender-Equality Monitor", "Live 40% female-representation compliance.", "Phase 1"],
  ["Traditional Authority Workflow", "Courtesy calls, endorsements, durbar accountability.", "Phase 6"],
  ["Term-Limit & Tenure Registry", "Tenure tracking + PDF appointment letters & ID cards.", "Phase 6"],
]

export default function AdminDashboard() {
  return (
    <>
      <DashboardHeading
        title="Administration"
        subtitle="Members, vetting, compliance, and platform configuration"
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Total members" value={0} hint="Registered" />
        <StatCard label="Pending verification" value={0} hint="Awaiting review" accent="red" />
        <StatCard label="Communities" value={COMMUNITY_COUNT} hint="Seeded" accent="blue" />
        <StatCard label="Cabinet positions" value={19} hint="Defined" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]" id="compliance">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            40% Gender-Equality Compliance
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Female representation by arm against the 40% constitutional floor
            (sample data).
          </p>
          <div className="mt-4">
            <GenderComplianceChart />
          </div>
        </Card>
        <Card id="members">
          <h3 className="text-sm font-bold text-brand-green-700">
            Member verification
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            New registrations land here as <Badge tone="amber">pending</Badge>.
            Verify to assign a role and unlock the member&apos;s dashboard.
          </p>
          <p className="mt-3 text-xs text-gray-400">
            Live queue connects once Supabase is configured.
          </p>
          <Link
            href="/dashboard/admin/transparency"
            className="mt-3 inline-block text-sm font-medium text-brand-green hover:underline"
          >
            Transparency publishing →
          </Link>
        </Card>
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-bold text-brand-green-700">
          Governance feature modules
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEW_FEATURES.map(([title, desc, phase]) => (
            <Card key={title}>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-sm font-bold text-brand-green-700">{title}</h4>
                <Badge tone={phase === "Phase 1" ? "green" : "gray"}>{phase}</Badge>
              </div>
              <p className="mt-2 text-sm text-gray-600">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
