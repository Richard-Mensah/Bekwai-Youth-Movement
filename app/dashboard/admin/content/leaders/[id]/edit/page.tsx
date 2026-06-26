import Link from "next/link"
import { notFound } from "next/navigation"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import LeaderForm from "../../LeaderForm"
import { getLeaderById } from "@/lib/data/content"

export const metadata = { title: "Edit person" }

export default async function EditLeaderPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const leader = await getLeaderById(id)
  if (!leader) notFound()

  return (
    <>
      <Link
        href="/dashboard/admin/content/leaders"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Leadership
      </Link>
      <DashboardHeading title="Edit person" subtitle={leader.name ?? leader.title} />
      <LeaderForm leader={leader} />
    </>
  )
}
