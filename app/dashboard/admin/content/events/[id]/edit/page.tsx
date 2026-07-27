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
<DashboardHeading
        backHref="/dashboard/admin/content/events"
        backLabel="Events" title="Edit event" subtitle={event.title} />
      <EventForm event={event} />
    </>
  )
}
