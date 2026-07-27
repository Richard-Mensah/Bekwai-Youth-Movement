import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import LeaderForm from "../LeaderForm"

export const metadata = { title: "Add person" }

export default function NewLeaderPage() {
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content/leaders"
        backLabel="Leadership" title="Add person" subtitle="Add a leader or team member" />
      <LeaderForm />
    </>
  )
}
