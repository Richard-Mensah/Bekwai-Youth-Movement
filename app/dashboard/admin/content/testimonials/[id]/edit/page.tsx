import { notFound } from "next/navigation"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import TestimonialForm from "../../TestimonialForm"
import { getTestimonialById } from "@/lib/data/content"

export const metadata = { title: "Edit testimonial" }

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const item = await getTestimonialById(id)
  if (!item) notFound()

  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content/testimonials"
        backLabel="Member voices" title="Edit testimonial" subtitle={item.name} />
      <TestimonialForm item={item} />
    </>
  )
}
