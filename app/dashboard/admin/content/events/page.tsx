import Link from "next/link"
import { Plus } from "lucide-react"
import { getAllEvents } from "@/lib/data/content"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import EventRowActions from "./EventRowActions"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "Events" }

export default async function EventsListPage() {
  const events = await getAllEvents()
  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <DashboardHeading title="Events" subtitle="Durbars, sittings, launches" />
        <Button href="/dashboard/admin/content/events/new">
          <Plus size={16} /> New event
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <p className="text-sm text-ink/55">No events yet. Add one to start.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {events.map((ev) => (
            <Card key={ev.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-canopy">{ev.title}</h3>
                    {!ev.isPublished && <Badge tone="gray">hidden</Badge>}
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">
                    {ev.startsAt ? formatDate(ev.startsAt) : "No date"}
                    {ev.location ? ` · ${ev.location}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/admin/content/events/${ev.id}/edit`}
                    className="text-xs font-semibold text-canopy hover:underline"
                  >
                    Edit
                  </Link>
                  <EventRowActions id={ev.id} published={ev.isPublished} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
