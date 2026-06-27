import Link from "next/link"
import { notFound } from "next/navigation"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import EventForm from "../../EventForm"
import { getEventById } from "@/lib/data/content"

export const metadata = { title: "Edit event" }

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()
  return (
    <>
      <Link
        href="/dashboard/admin/content/events"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Events
      </Link>
      <DashboardHeading title="Edit event" subtitle={event.title} />
      <EventForm event={event} />
    </>
  )
}
