import { notFound } from "next/navigation"
import { officeBySlug } from "@/constants/offices"
import OfficeDetail from "@/components/features/apply/OfficeDetail"
import { getMyApplications } from "@/lib/data/applications"

type Params = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Params) {
  const { slug } = await params
  const office = officeBySlug(slug)
  return { title: office?.title ?? "Office" }
}

export default async function DashboardOfficePage({ params }: Params) {
  const { slug } = await params
  const office = officeBySlug(slug)
  if (!office) notFound()

  const mine = await getMyApplications()
  const applied = mine.some(
    (a) =>
      a.roleApplied === office.title &&
      a.status !== "draft" &&
      a.status !== "withdrawn"
  )

  return (
    <div className="mx-auto max-w-5xl">
      <OfficeDetail
        office={office}
        backHref="/dashboard/apply/roles"
        backLabel="All offices"
        applyHref={`/dashboard/apply/new?role=${office.slug}`}
        applied={applied}
      />
    </div>
  )
}
