import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import ApplicationsConsole from "./ApplicationsConsole"
import CoveragePanel from "./CoveragePanel"
import { getLeadershipApplications } from "@/lib/data/admin"
import type { LeadershipApplication } from "@/lib/data/admin"

export const metadata = { title: "Leadership Applications" }

/** Median days from submission to a final decision, for decided applications. */
function medianDaysToDecision(apps: LeadershipApplication[]): string {
  const decided = apps.filter((a) =>
    ["appointed", "sworn_in", "rejected"].includes(a.status)
  )
  if (decided.length === 0) return "—"
  const days = decided
    .map((a) => {
      const from = new Date(a.submittedAt ?? a.createdAt).getTime()
      return (Date.now() - from) / 86_400_000
    })
    .sort((x, y) => x - y)
  const mid = Math.floor(days.length / 2)
  const median =
    days.length % 2 === 0 ? (days[mid - 1] + days[mid]) / 2 : days[mid]
  return `${Math.round(median)}d`
}

export default async function ApplicationsPage() {
  const apps = await getLeadershipApplications()

  const awaiting = apps.filter((a) => a.status === "submitted").length
  const inVetting = apps.filter((a) =>
    ["received", "vetting", "recommended"].includes(a.status)
  ).length
  const appointed = apps.filter((a) =>
    ["appointed", "sworn_in"].includes(a.status)
  ).length

  const counts: Record<string, number> = {}
  for (const a of apps) {
    counts[a.roleApplied] = (counts[a.roleApplied] ?? 0) + 1
  }

  return (
    <>
      <Link
        href="/dashboard/admin"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline dark:text-brand-green-100"
      >
        <ArrowLeft size={14} /> Back to Administration
      </Link>
      <DashboardHeading
        title="Applications pipeline"
        subtitle="Every submission, moving through the appointment stages of Article 30.2."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total applications"
          value={apps.length}
          hint="Drafts excluded"
        />
        <StatCard
          label="Awaiting first review"
          value={awaiting}
          hint="Submitted, not yet acknowledged"
          accent="red"
        />
        <StatCard
          label="In the pipeline"
          value={inVetting}
          hint="Received, vetting or recommended"
          accent="gold"
        />
        <StatCard
          label="Appointed"
          value={appointed}
          hint={`Median time to decision · ${medianDaysToDecision(apps)}`}
        />
      </div>

      <div className="mt-8">
        <ApplicationsConsole applications={apps} />
      </div>

      <div className="mt-8">
        <CoveragePanel counts={counts} />
      </div>
    </>
  )
}
