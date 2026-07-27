import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import EventForm from "../EventForm"

export const metadata = { title: "New event" }

export default function NewEventPage() {
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content/events"
        backLabel="Events" title="New event" subtitle="Add an event" />
      <EventForm />
    </>
  )
}
