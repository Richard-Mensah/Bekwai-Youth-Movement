"use client"

import { useState } from "react"
import { Vote, Users, Radar, MapPin } from "lucide-react"
import type { CommunityItem } from "@/lib/data/content"

const REPS = [
  { icon: Vote, title: "Youth Parliament Member", note: "Legislative voice · ages 10–45" },
  { icon: Users, title: "Council Representative", note: "Executive voice · ages 18–45" },
  { icon: Radar, title: "Community Intelligence Officer", note: "Evidence voice · ages 18+" },
]

/** Clickable map of all communities; selecting one shows its 3-rep model. */
export default function CommunityMapInteractive({
  communities,
}: {
  communities: CommunityItem[]
}) {
  const [selectedId, setSelectedId] = useState<number>(
    communities.find((c) => c.isTown)?.id ?? communities[0]?.id ?? 0
  )
  const selected = communities.find((c) => c.id === selectedId) ?? communities[0]

  return (
    <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-start">
      {/* Detail panel */}
      <div className="rounded-3xl border border-canopy/10 bg-white p-7 shadow-card lg:sticky lg:top-24">
        <span className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-600">
          <MapPin size={14} />
          {selected?.isTown ? "Town · seat of the Assembly" : "Sub-community"}
        </span>
        <h3 className="mt-4 font-display text-2xl font-semibold text-canopy">
          {selected?.name}
        </h3>
        <p className="mt-2 text-sm text-ink/60">
          Every community is entitled to three dedicated representatives:
        </p>
        <div className="mt-5 space-y-3">
          {REPS.map(({ icon: Icon, title, note }) => (
            <div
              key={title}
              className="flex gap-3 rounded-2xl border border-canopy/10 bg-paper p-3.5"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canopy text-gold-300">
                <Icon size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-canopy">{title}</p>
                <p className="text-xs text-ink/55">{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node grid */}
      <div>
        <p className="mb-3 text-sm text-ink/55">
          Tap any community to see its representation.
        </p>
        <div className="flex flex-wrap gap-2">
          {communities.map((c) => {
            const active = c.id === selectedId
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelectedId(c.id)}
                aria-pressed={active}
                className={`rounded-xl px-3 py-2 text-xs font-medium transition-all ${
                  active
                    ? "bg-canopy text-white shadow-card"
                    : c.isTown
                      ? "bg-gold-400 text-canopy hover:-translate-y-0.5"
                      : "border border-canopy/15 bg-white text-ink/70 hover:-translate-y-0.5 hover:border-canopy/30"
                }`}
              >
                {c.name}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
