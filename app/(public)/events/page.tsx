import type { Metadata } from "next"
import Image from "next/image"
import { CalendarDays, MapPin } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import Card from "@/components/ui/Card"
import { getPublishedEvents } from "@/lib/data/content"

export const metadata: Metadata = {
  title: "Events",
  description:
    "Upcoming and past events from the Bekwai Youth Movement — durbars, parliamentary sittings, launches, and community programmes.",
}

function fmt(iso: string | null) {
  if (!iso) return "Date to be announced"
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function EventsPage() {
  const events = await getPublishedEvents()
  const now = Date.now()
  const upcoming = events.filter((e) => !e.startsAt || new Date(e.startsAt).getTime() >= now)
  const past = events.filter((e) => e.startsAt && new Date(e.startsAt).getTime() < now)

  return (
    <>
      <PageHeader
        eyebrow="What's on"
        title="Events"
        description="Durbars, parliamentary sittings, launches, and community programmes across Sefwi Bekwai."
      />

      <section className="section">
        <div className="container-content space-y-12">
          {upcoming.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-semibold text-canopy">Upcoming</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {upcoming.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-semibold text-canopy">Past events</h2>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                {past.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            </div>
          )}

          {events.length === 0 && (
            <Card>
              <p className="text-sm text-ink/55">No events published yet — check back soon.</p>
            </Card>
          )}
        </div>
      </section>
    </>
  )
}

function EventCard({
  ev,
}: {
  ev: Awaited<ReturnType<typeof getPublishedEvents>>[number]
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card">
      {ev.coverUrl && (
        <div className="relative aspect-[16/9]">
          <Image src={ev.coverUrl} alt={ev.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-6">
        <h3 className="font-display text-lg font-semibold text-canopy">{ev.title}</h3>
        <div className="mt-2 space-y-1 text-sm text-ink/60">
          <p className="flex items-center gap-2">
            <CalendarDays size={15} className="text-gold-500" /> {fmt(ev.startsAt)}
          </p>
          {ev.location && (
            <p className="flex items-center gap-2">
              <MapPin size={15} className="text-gold-500" /> {ev.location}
            </p>
          )}
        </div>
        {ev.description && (
          <p className="mt-3 text-sm leading-relaxed text-ink/65">{ev.description}</p>
        )}
      </div>
    </div>
  )
}
