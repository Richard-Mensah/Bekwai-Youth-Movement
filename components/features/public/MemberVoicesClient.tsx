"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Quote, ArrowRight } from "lucide-react"
import type { Testimonial } from "@/lib/data/content"
import MemberVoiceDrawer from "@/components/features/public/MemberVoiceDrawer"

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "BY"
}

function Card({ t, onOpen }: { t: Testimonial; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Read ${t.name}'s story`}
      className="group flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 dark:border-white/10 dark:bg-canopy-800"
    >
      <Quote className="text-gold-400" size={28} />
      <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink/75 dark:text-paper/75 line-clamp-5">
        “{t.quote}”
      </blockquote>
      <span className="mt-5 flex items-center gap-3 border-t border-canopy/10 pt-4 dark:border-white/10">
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
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold text-canopy dark:text-paper">{t.name}</span>
          {t.role && (
            <span className="block truncate text-xs text-ink/55 dark:text-paper/55">{t.role}</span>
          )}
        </span>
        <span className="inline-flex items-center gap-1 text-xs font-semibold text-gold-600 opacity-0 transition-opacity group-hover:opacity-100">
          Read <ArrowRight size={13} />
        </span>
      </span>
    </button>
  )
}

const WINDOW = 3

/** Shows WINDOW testimonial cards at a time, auto-rotating the window.
 * Clicking a card opens a slide-out drawer with the full story. */
export default function MemberVoicesClient({ items }: { items: Testimonial[] }) {
  const [start, setStart] = useState(0)
  const [active, setActive] = useState<number | null>(null)
  const count = items.length

  // Auto-rotate the visible window, paused while the drawer is open.
  useEffect(() => {
    if (count <= WINDOW || active !== null) return
    const id = setInterval(() => setStart((s) => (s + 1) % count), 6000)
    return () => clearInterval(id)
  }, [count, active])

  const visible = useMemo(() => {
    if (count <= WINDOW) return items.map((t, i) => ({ t, index: i }))
    return Array.from({ length: WINDOW }, (_, i) => {
      const index = (start + i) % count
      return { t: items[index], index }
    })
  }, [items, start, count])

  const close = useCallback(() => setActive(null), [])
  const prev = useCallback(
    () => setActive((i) => (i === null ? i : (i - 1 + count) % count)),
    [count]
  )
  const next = useCallback(
    () => setActive((i) => (i === null ? i : (i + 1) % count)),
    [count]
  )

  return (
    <div className="mt-12">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map(({ t, index }) => (
          <Card key={`${t.id}-${index}`} t={t} onOpen={() => setActive(index)} />
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
                i === start ? "w-6 bg-canopy dark:bg-gold-400" : "w-2 bg-canopy/20 dark:bg-white/20"
              }`}
            />
          ))}
        </div>
      )}

      <MemberVoiceDrawer
        items={items}
        index={active}
        onClose={close}
        onPrev={prev}
        onNext={next}
      />
    </div>
  )
}
