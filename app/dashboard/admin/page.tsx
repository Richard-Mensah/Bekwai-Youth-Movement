import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import GenderComplianceChart from "@/components/features/dashboard/GenderComplianceChart"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { COMMUNITY_COUNT } from "@/constants/communities"
import { getGenderCompliance } from "@/lib/data/governance"
import { getMemberStats } from "@/lib/data/admin"

const NEW_FEATURES: [string, string, string][] = [
  ["Nomination & Vetting Pipeline", "8-week, 5-step applicant tracking to Letters of Appointment.", "/dashboard/admin/vetting"],
  ['"No Community Left Without a Voice"', "Gap tracker for vacant seats + 3-tier interim protocol.", "/dashboard/admin/representation"],
  ["Traditional Authority Workflow", "Courtesy calls, endorsements, durbar accountability.", "/dashboard/elder"],
  ["Term-Limit & Tenure Registry", "Tenure tracking + printable appointment letters & ID cards.", "/dashboard/admin/tenure"],
  ["Transparency Publishing", "Control budgets, scorecards, and reports on the public portal.", "/dashboard/admin/transparency"],
  ["Inbox", "Read contact enquiries and newsletter subscribers from the public site.", "/dashboard/admin/inbox"],
]

export default async function AdminDashboard() {
  const [gender, members] = await Promise.all([
    getGenderCompliance(),
    getMemberStats(),
  ])

  return (
    <>
      <DashboardHeading
        title="Administration"
        subtitle="Members, vetting, compliance, and platform configuration"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total members"
          value={members.total}
          hint={members.configured ? "Registered" : "Connect Supabase for live count"}
        />
        <StatCard
          label="Pending verification"
          value={members.pending}
          hint="Awaiting review"
          accent="red"
        />
        <StatCard
          label="Verified members"
          value={members.verified}
          hint="Active on the platform"
          accent="gold"
        />
        <StatCard
          label="Communities"
          value={COMMUNITY_COUNT}
          hint="Sefwi Bekwai + 31"
          accent="blue"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]" id="compliance">
        <Card>
          <h3 className="font-display text-base font-semibold text-canopy">
            40% Gender-Equality Compliance
          </h3>
          <p className="mt-1 text-xs text-ink/55">
            Female representation by arm against the 40% constitutional floor.
          </p>
          <div className="mt-4">
            <GenderComplianceChart data={gender} />
          </div>
        </Card>
        <Card id="members">
          <h3 className="font-display text-base font-semibold text-canopy">
            Member verification
          </h3>
          <p className="mt-2 text-sm text-ink/65">
            New registrations land here as <Badge tone="amber">pending</Badge>.
            Verify to assign a role and unlock the member&apos;s dashboard.
          </p>
          <p className="mt-3 text-xs text-ink/45">
            {members.configured
              ? `${members.pending} member${members.pending === 1 ? "" : "s"} awaiting verification.`
              : "Live queue connects once Supabase is configured."}
          </p>
          <Link
            href="/dashboard/admin/transparency"
            className="mt-3 inline-block text-sm font-semibold text-canopy hover:underline"
          >
            Transparency publishing →
          </Link>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="mb-3 font-display text-base font-semibold text-canopy">
          Governance feature modules
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NEW_FEATURES.map(([title, desc, href]) => (
            <Link
              key={title}
              href={href}
              className="group block rounded-2xl border border-canopy/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <h4 className="font-display text-sm font-semibold text-canopy">{title}</h4>
              <p className="mt-2 text-sm text-ink/65">{desc}</p>
              <span className="mt-3 inline-block text-sm font-semibold text-gold-600">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
