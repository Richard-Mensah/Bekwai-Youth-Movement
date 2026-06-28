"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"
import type { Testimonial } from "@/lib/data/content"

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "BY"
}

function Card({ t }: { t: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card">
      <Quote className="text-gold-400" size={28} />
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/75">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3 border-t border-canopy/10 pt-4">
        <span className="h-11 w-11 overflow-hidden rounded-full ring-2 ring-gold-400/40">
          {t.photoUrl ? (
            <Image
              src={t.photoUrl}
              alt={t.name}
              width={44}
              height={44}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center bg-canopy font-display text-sm font-semibold text-gold-300">
              {initials(t.name)}
            </span>
          )}
        </span>
        <span>
          <span className="block text-sm font-semibold text-canopy">{t.name}</span>
          {t.role && <span className="block text-xs text-ink/55">{t.role}</span>}
        </span>
      </figcaption>
    </figure>
  )
}

const WINDOW = 3

/** Shows WINDOW testimonial cards at a time, auto-rotating the window. */
export default function MemberVoicesClient({ items }: { items: Testimonial[] }) {
  const [start, setStart] = useState(0)
  const count = items.length

  useEffect(() => {
    if (count <= WINDOW) return
    const id = setInterval(() => setStart((s) => (s + 1) % count), 6000)
    return () => clearInterval(id)
  }, [count])

  const visible = useMemo(() => {
    if (count <= WINDOW) return items
    return Array.from({ length: WINDOW }, (_, i) => items[(start + i) % count])
  }, [items, start, count])

  return (
    <div className="mt-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((t, i) => (
          <Card key={`${t.id}-${i}`} t={t} />
        ))}
      </div>

      {count > WINDOW && (
        <div className="mt-8 flex justify-center gap-1.5">
          {items.map((t, i) => (
            <button
              key={t.id}
              type="button"
              aria-label={`Show testimonials from position ${i + 1}`}
              onClick={() => setStart(i)}
              className={`h-2 rounded-full transition-all ${
                i === start ? "w-6 bg-canopy" : "w-2 bg-canopy/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
