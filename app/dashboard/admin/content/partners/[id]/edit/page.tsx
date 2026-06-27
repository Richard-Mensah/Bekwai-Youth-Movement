import Link from "next/link"
import { notFound } from "next/navigation"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import PartnerForm from "../../PartnerForm"
import { getPartnerById } from "@/lib/data/content"

export const metadata = { title: "Edit partner" }

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const partner = await getPartnerById(id)
  if (!partner) notFound()
  return (
    <>
      <Link
        href="/dashboard/admin/content/partners"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Partners
      </Link>
      <DashboardHeading title="Edit partner" subtitle={partner.name} />
      <PartnerForm partner={partner} />
    </>
  )
}
