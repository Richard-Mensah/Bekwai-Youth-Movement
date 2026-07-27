import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import CommunitiesEditor from "./CommunitiesEditor"
import { getCommunities } from "@/lib/data/content"

export const metadata = { title: "Communities" }

export default async function CommunitiesPage() {
  const communities = await getCommunities()
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content"
        backLabel="Content Studio"
        title="Communities"
        subtitle="Edit the names of the 33 communities BYM serves"
      />
      <CommunitiesEditor communities={communities} />
    </>
  )
}
