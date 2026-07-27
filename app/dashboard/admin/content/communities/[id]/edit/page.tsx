import { notFound } from "next/navigation"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import CommunityDetailsForm from "../../CommunityDetailsForm"
import { getCommunityDetailById } from "@/lib/data/content"

export const metadata = { title: "Edit community" }

export default async function EditCommunityPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const community = await getCommunityDetailById(Number(id))
  if (!community) notFound()

  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content/communities"
        backLabel="Communities"
        title={`Edit ${community.name}`}
        subtitle="About, chief, and elders shown on the public community page"
      />
      <CommunityDetailsForm community={community} />
    </>
  )
}
