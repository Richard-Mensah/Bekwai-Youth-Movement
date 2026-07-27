import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { OFFICES, officeBySlug } from "@/constants/offices"
import OfficeDetail from "@/components/features/apply/OfficeDetail"

type Params = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return OFFICES.map((o) => ({ slug: o.slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const office = officeBySlug(slug)
  if (!office) return { title: "Office not found" }
  return {
    title: office.title,
    description: `${office.summary} Duties, eligibility${
      office.ageRange ? `, age ${office.ageRange[0]}–${office.ageRange[1]}` : ""
    } and term for the ${office.title} of the Bekwai Youth Movement.`,
  }
}

export default async function PublicOfficePage({ params }: Params) {
  const { slug } = await params
  const office = officeBySlug(slug)
  if (!office) notFound()

  return (
    <section className="section bg-paper">
      <div className="container-content max-w-5xl">
        <OfficeDetail
          office={office}
          backHref="/leadership/roles"
          backLabel="All open roles"
          applyHref={`/dashboard/apply/new?role=${office.slug}`}
        />
      </div>
    </section>
  )
}
