import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import RoleCatalogue from "@/components/features/apply/RoleCatalogue"
import { OFFICES } from "@/constants/offices"
import {
  getApplicationCountsByRole,
  getMyApplications,
} from "@/lib/data/applications"

export const metadata = { title: "Browse Offices" }

export default async function DashboardRolesPage() {
  const [mine, counts] = await Promise.all([
    getMyApplications(),
    getApplicationCountsByRole(),
  ])

  const applied = mine
    .filter((a) => a.status !== "draft" && a.status !== "withdrawn")
    .map((a) => a.roleApplied)

  return (
    <>
      <Link
        href="/dashboard/apply"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline dark:text-brand-green-100"
      >
        <ArrowLeft size={14} /> Back to my applications
      </Link>
      <DashboardHeading
        title="Every office open for application"
        subtitle={`${OFFICES.length} roles across the Cabinet, the Youth Parliament, the Community Intelligence Network and the 32 communities.`}
      />
      <RoleCatalogue
        basePath="/dashboard/apply/roles"
        appliedTitles={applied}
        applicantCounts={counts}
      />
    </>
  )
}
