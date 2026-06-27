import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import EventForm from "../EventForm"

export const metadata = { title: "New event" }

export default function NewEventPage() {
  return (
    <>
      <Link
        href="/dashboard/admin/content/events"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Events
      </Link>
      <DashboardHeading title="New event" subtitle="Add an event" />
      <EventForm />
    </>
  )
}
