"use client"

import { useCallback, useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react"
import Badge from "@/components/ui/Badge"

export type Story = {
  id: string
  name: string
  description: string | null
  communityName: string
  unitName: string | null
  status: string
  sdg: number[]
}

const STATUS_LABEL: Record<string, string> = {
  proposed: "Proposed",
  approved: "Approved",
  in_progress: "In progress",
  completed: "Completed",
  suspended: "On hold",
}

/** Auto-advancing carousel of project highlights. */
export default function ImpactStoriesClient({ stories }: { stories: Story[] }) {
  const [index, setIndex] = useState(0)
  const count = stories.length

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  )

  useEffect(() => {
    if (count <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(t)
  }, [count])

  if (count === 0) return null
  const story = stories[index]

  return (
    <div className="mt-12">
      <div className="relative overflow-hidden rounded-3xl border border-canopy/10 bg-white p-8 shadow-card sm:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="green">{STATUS_LABEL[story.status] ?? story.status}</Badge>
          {story.unitName && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
              {story.unitName}
            </span>
          )}
        </div>
        <h3 className="mt-4 font-display text-2xl font-semibold text-canopy sm:text-3xl">
          {story.name}
        </h3>
        {story.description && (
          <p className="mt-3 max-w-2xl leading-relaxed text-ink/65">{story.description}</p>
        )}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-sm text-ink/55">
            <MapPin size={15} className="text-gold-500" />
            {story.communityName}
          </span>
          {story.sdg.map((g) => (
            <Badge key={g} tone="gold">
              SDG {g}
            </Badge>
          ))}
        </div>

        {count > 1 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="flex gap-1.5">
              {stories.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  aria-label={`Go to story ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-6 bg-canopy" : "w-2 bg-canopy/20"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label="Previous story"
                onClick={() => go(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-canopy/20 text-canopy hover:bg-canopy-50"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Next story"
                onClick={() => go(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-canopy/20 text-canopy hover:bg-canopy-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
