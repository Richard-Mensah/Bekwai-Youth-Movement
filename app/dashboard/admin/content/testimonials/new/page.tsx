import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import TestimonialForm from "../TestimonialForm"

export const metadata = { title: "New testimonial" }

export default function NewTestimonialPage() {
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content/testimonials"
        backLabel="Member voices" title="New testimonial" subtitle="Add a member quote" />
      <TestimonialForm />
    </>
  )
}
