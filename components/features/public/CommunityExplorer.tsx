"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { MapPin, X, ArrowRight, Vote, Users, Radar } from "lucide-react"
import type { CommunityItem } from "@/lib/data/content"

const REPS = [
  { icon: Vote, label: "Youth Parliament Member" },
  { icon: Users, label: "Council Representative" },
  { icon: Radar, label: "Community Intelligence Officer" },
]

/** Clickable community chips → popup with quick info + link to the full page. */
export default function CommunityExplorer({
  communities,
}: {
  communities: CommunityItem[]
}) {
  const [selected, setSelected] = useState<CommunityItem | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setSelected(null)
    }
    if (selected) {
      document.addEventListener("keydown", onKey)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [selected])

  return (
    <div className="rounded-3xl bg-canopy p-8 text-white canopy-texture">
      <p className="font-display text-5xl font-semibold text-gold-300">
        {communities.length}
      </p>
      <p className="mt-1 text-sm text-white/70">
        communities — tap any to explore its representation
      </p>
      <div className="mt-6 flex flex-wrap gap-1.5">
        {communities.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c)}
            className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all hover:-translate-y-0.5 ${
              c.isTown
                ? "bg-gold-400 text-canopy hover:bg-gold-300"
                : "bg-white/10 text-white/85 hover:bg-white/20"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSelected(null)}
            className="absolute inset-0 bg-canopy/70 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-7 text-left text-ink shadow-card-hover">
            <button
              type="button"
              aria-label="Close"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 text-ink/40 hover:text-canopy"
            >
              <X size={20} />
            </button>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-3 py-1 text-xs font-semibold text-gold-600">
              <MapPin size={14} />
              {selected.isTown ? "Town · seat of the Assembly" : "Sub-community of Sefwi Bekwai"}
            </span>
            <h3 className="mt-4 font-display text-2xl font-semibold text-canopy">
              {selected.name}
            </h3>
            <p className="mt-2 text-sm text-ink/60">
              Entitled to three dedicated BYM representatives:
            </p>
            <ul className="mt-4 space-y-2">
              {REPS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-ink/75">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-canopy-50 text-canopy">
                    <Icon size={16} />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
            <Link
              href={`/communities/${selected.slug}`}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-canopy px-5 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
            >
              Open community page <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
