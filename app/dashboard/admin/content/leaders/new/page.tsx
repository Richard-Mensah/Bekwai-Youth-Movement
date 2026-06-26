import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import LeaderForm from "../LeaderForm"

export const metadata = { title: "Add person" }

export default function NewLeaderPage() {
  return (
    <>
      <Link
        href="/dashboard/admin/content/leaders"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Leadership
      </Link>
      <DashboardHeading title="Add person" subtitle="Add a leader or team member" />
      <LeaderForm />
    </>
  )
}
