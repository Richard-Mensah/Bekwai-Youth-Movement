"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion } from "framer-motion"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

export default function GalleryGrid({ photos }: { photos: string[] }) {
  const [active, setActive] = useState<number | null>(null)

  const close = () => setActive(null)
  const prev = () =>
    setActive((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))
  const next = () =>
    setActive((i) => (i === null ? i : (i + 1) % photos.length))

  useEffect(() => {
    if (active === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      if (e.key === "ArrowLeft") prev()
      if (e.key === "ArrowRight") next()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
        {photos.map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => setActive(i)}
            className="group relative block w-full overflow-hidden rounded-xl border border-canopy/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
          >
            <Image
              src={`/images/history/${img}`}
              alt="Bekwai Youth Movement activity"
              width={500}
              height={500}
              className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute inset-0 bg-canopy/0 transition-colors group-hover:bg-canopy/20" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-canopy-900/90 p-4"
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label="Image viewer"
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <X size={22} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                prev()
              }}
              aria-label="Previous"
              className="absolute left-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronLeft size={26} />
            </button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="relative max-h-[85vh] w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={`/images/history/${photos[active]}`}
                alt="Bekwai Youth Movement activity"
                width={1200}
                height={900}
                className="mx-auto max-h-[85vh] w-auto rounded-xl object-contain"
              />
            </motion.div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                next()
              }}
              aria-label="Next"
              className="absolute right-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            >
              <ChevronRight size={26} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
