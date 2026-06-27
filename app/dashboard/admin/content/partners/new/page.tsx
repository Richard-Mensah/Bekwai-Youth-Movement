import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import PartnerForm from "../PartnerForm"

export const metadata = { title: "Add partner" }

export default function NewPartnerPage() {
  return (
    <>
      <Link
        href="/dashboard/admin/content/partners"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Partners
      </Link>
      <DashboardHeading title="Add partner" subtitle="Add a partner or sponsor" />
      <PartnerForm />
    </>
  )
}
