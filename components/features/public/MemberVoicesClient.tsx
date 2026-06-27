"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Quote } from "lucide-react"
import type { Testimonial } from "@/lib/data/content"

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "BY"
}

/** Rotating member quotes. */
export default function MemberVoicesClient({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0)
  const count = items.length

  useEffect(() => {
    if (count <= 1) return
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 7000)
    return () => clearInterval(t)
  }, [count])

  if (count === 0) return null
  const t = items[index]

  return (
    <div className="mx-auto mt-12 max-w-3xl text-center">
      <Quote className="mx-auto text-gold-400" size={36} />
      <blockquote className="mt-5 font-display text-xl font-medium leading-relaxed text-canopy sm:text-2xl">
        “{t.quote}”
      </blockquote>
      <div className="mt-6 flex items-center justify-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-gold-400/40">
          {t.photoUrl ? (
            <Image
              src={t.photoUrl}
              alt={t.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-canopy font-display text-sm font-semibold text-gold-300">
              {initials(t.name)}
            </div>
          )}
        </div>
        <div className="text-left">
          <p className="text-sm font-semibold text-canopy">{t.name}</p>
          {t.role && <p className="text-xs text-ink/55">{t.role}</p>}
        </div>
      </div>

      {count > 1 && (
        <div className="mt-7 flex justify-center gap-1.5">
          {items.map((it, i) => (
            <button
              key={it.id}
              type="button"
              aria-label={`Quote ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-canopy" : "w-2 bg-canopy/20"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
