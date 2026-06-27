"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import { createEvent, updateEvent } from "./actions"
import type { EventItem } from "@/lib/data/content"

function toLocal(iso: string | null) {
  return iso ? iso.slice(0, 16) : ""
}

export default function EventForm({ event }: { event?: EventItem }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = event ? await updateEvent(fd) : await createEvent(fd)
      if (res.ok) {
        router.push("/dashboard/admin/content/events")
        router.refresh()
      } else setError(res.error ?? "Something went wrong.")
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {event && <input type="hidden" name="id" value={event.id} />}
      <Input name="title" label="Event title" defaultValue={event?.title} required />
      <Input
        name="slug"
        label="URL slug (optional)"
        defaultValue={event?.slug}
        placeholder="founding-day"
      />
      <Input name="location" label="Location" defaultValue={event?.location ?? ""} />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-ink/75">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={event?.description ?? ""}
          className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="startsAt" label="Starts" type="datetime-local" defaultValue={toLocal(event?.startsAt ?? null)} />
        <Input name="endsAt" label="Ends (optional)" type="datetime-local" defaultValue={toLocal(event?.endsAt ?? null)} />
      </div>
      <ImageUploadField name="cover" label="Cover image" currentUrl={event?.coverUrl} />
      <label className="flex items-center gap-2 text-sm font-medium text-ink/75">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={event ? event.isPublished : true}
          className="h-4 w-4 rounded border-canopy/30 text-canopy focus:ring-canopy"
        />
        Show on the public events page
      </label>
      {error && <p className="text-sm text-brand-red">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : event ? "Save changes" : "Create event"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/content/events")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
