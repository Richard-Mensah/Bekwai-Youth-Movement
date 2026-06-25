import Link from "next/link"
import { getNominations } from "@/lib/data/governance"
import { NOMINATION_FLOW } from "@/constants/governance"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import NominationPipeline from "@/components/features/governance/NominationPipeline"
import NominationForm from "@/components/features/governance/NominationForm"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"

export default async function VettingPage() {
  const rows = await getNominations()
  const appointed = rows.filter((r) => r.stage === "appointed").length
  const inPipeline = rows.filter(
    (r) => r.stage !== "appointed" && r.stage !== "rejected"
  ).length

  return (
    <>
      <Link href="/dashboard/admin" className="mb-3 inline-block text-sm text-brand-green hover:underline">
        ← Back to Administration
      </Link>
      <DashboardHeading
        title="Nomination & Vetting Pipeline"
        subtitle="The 8-week, 5-step selection process (Governance §4.3)"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="In pipeline" value={inPipeline} hint="Awaiting decision" accent="blue" />
        <StatCard label="Appointed" value={appointed} hint="Letters issued" />
        <StatCard label="Total nominations" value={rows.length} accent="red" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <h3 className="text-sm font-bold text-canopy">Pipeline</h3>
          <p className="mt-1 text-xs text-ink/55">
            {NOMINATION_FLOW.length} stages — nominated → residency → vetting → interview → appointed.
          </p>
          <div className="mt-4">
            <NominationPipeline rows={rows} />
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-canopy">Add nomination</h3>
          <div className="mt-4">
            <NominationForm />
          </div>
        </Card>
      </div>
    </>
  )
}
