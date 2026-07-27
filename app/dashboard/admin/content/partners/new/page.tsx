import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import PartnerForm from "../PartnerForm"

export const metadata = { title: "Add partner" }

export default function NewPartnerPage() {
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content/partners"
        backLabel="Partners" title="Add partner" subtitle="Add a partner or sponsor" />
      <PartnerForm />
    </>
  )
}
