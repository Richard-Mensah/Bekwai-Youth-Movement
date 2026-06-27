import Link from "next/link"
import { Plus } from "lucide-react"
import { getAllTestimonials } from "@/lib/data/content"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import TestimonialRowActions from "./TestimonialRowActions"

export const metadata = { title: "Testimonials" }

export default async function TestimonialsListPage() {
  const items = await getAllTestimonials()

  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <DashboardHeading
          title="Member voices"
          subtitle="Quotes shown in the testimonials band on the homepage"
        />
        <Button href="/dashboard/admin/content/testimonials/new">
          <Plus size={16} /> New testimonial
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <p className="text-sm text-ink/55">
            No testimonials yet. Click <strong>New testimonial</strong> to add a
            member quote. (Until you add some, a few starter quotes show on the
            homepage.)
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((t) => (
            <Card key={t.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-canopy">{t.name}</h3>
                    <Badge tone={t.isPublished ? "green" : "amber"}>
                      {t.isPublished ? "published" : "hidden"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink/50">
                    {t.role ? `${t.role} — ` : ""}“{t.quote}”
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/admin/content/testimonials/${t.id}/edit`}
                    className="text-xs font-semibold text-canopy hover:underline"
                  >
                    Edit
                  </Link>
                  <TestimonialRowActions id={t.id} published={t.isPublished} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
