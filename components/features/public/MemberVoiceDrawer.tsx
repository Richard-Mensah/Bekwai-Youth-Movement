"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { Quote, X, ChevronLeft, ChevronRight } from "lucide-react"
import type { Testimonial } from "@/lib/data/content"

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "BY"
}

type Props = {
  items: Testimonial[]
  index: number | null
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

/** Right slide-out drawer showing a single member voice in full, with
 * prev/next navigation across all voices. Mirrors the GalleryGrid overlay
 * pattern (Esc/arrow keys, body-scroll lock, backdrop close). */
export default function MemberVoiceDrawer({
  items,
  index,
  onClose,
  onPrev,
  onNext,
}: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null
  const t = open ? items[index] : null

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowLeft") onPrev()
      if (e.key === "ArrowRight") onNext()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    const id = window.setTimeout(() => closeRef.current?.focus(), 60)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      window.clearTimeout(id)
    }
  }, [open, onClose, onPrev, onNext])

  return (
    <AnimatePresence>
      {open && t && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-canopy-900/80 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Member voice"
        >
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-card-hover dark:bg-canopy-800"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-canopy/10 px-6 py-4 dark:border-white/10">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-gold-600">
                Voices · {index + 1} of {items.length}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-full p-2 text-ink/60 transition-colors hover:bg-canopy-50 dark:text-paper/60 dark:hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-1 flex-col px-6 py-8"
            >
              <Quote className="text-gold-400" size={40} />
              <blockquote className="mt-4 flex-1 font-display text-xl leading-relaxed text-ink/85 dark:text-paper/85">
                “{t.quote}”
              </blockquote>

              <figcaption className="mt-8 flex items-center gap-4 border-t border-canopy/10 pt-6 dark:border-white/10">
                <span className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-gold-400/40">
                  {t.photoUrl ? (
                    <Image
                      src={t.photoUrl}
                      alt={t.name}
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-canopy font-display text-lg font-semibold text-gold-300">
                      {initials(t.name)}
                    </span>
                  )}
                </span>
                <span>
                  <span className="block font-display text-lg font-semibold text-canopy dark:text-paper">
                    {t.name}
                  </span>
                  {t.role && (
                    <span className="block text-sm text-ink/55 dark:text-paper/55">{t.role}</span>
                  )}
                </span>
              </figcaption>
            </motion.div>

            <div className="flex items-center justify-between border-t border-canopy/10 px-6 py-4 dark:border-white/10">
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50 dark:text-paper dark:hover:bg-white/10"
              >
                <ChevronLeft size={18} /> Previous
              </button>
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50 dark:text-paper dark:hover:bg-white/10"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
