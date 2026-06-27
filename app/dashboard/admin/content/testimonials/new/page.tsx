import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import TestimonialForm from "../TestimonialForm"

export const metadata = { title: "New testimonial" }

export default function NewTestimonialPage() {
  return (
    <>
      <Link
        href="/dashboard/admin/content/testimonials"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Member voices
      </Link>
      <DashboardHeading title="New testimonial" subtitle="Add a member quote" />
      <TestimonialForm />
    </>
  )
}
