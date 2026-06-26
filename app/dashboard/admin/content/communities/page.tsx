import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import CommunitiesEditor from "./CommunitiesEditor"
import { getCommunities } from "@/lib/data/content"

export const metadata = { title: "Communities" }

export default async function CommunitiesPage() {
  const communities = await getCommunities()
  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <DashboardHeading
        title="Communities"
        subtitle="Edit the names of the 32 communities BYM serves"
      />
      <CommunitiesEditor communities={communities} />
    </>
  )
}
