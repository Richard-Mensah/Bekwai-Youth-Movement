import Link from "next/link"
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
      <Link
        href="/dashboard/admin/content/testimonials"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Member voices
      </Link>
      <DashboardHeading title="Edit testimonial" subtitle={item.name} />
      <TestimonialForm item={item} />
    </>
  )
}
