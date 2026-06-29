"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

type Props = {
  images: string[]
  /** Auto-advance interval in ms. */
  interval?: number
}

/**
 * Sliding image carousel used in the homepage hero (in place of the old logo
 * seal). Images slide in from the right and auto-advance. Respects reduced
 * motion (static first image, no auto-advance).
 */
export default function HeroCarousel({ images, interval = 4500 }: Props) {
  const reduce = useReducedMotion()
  const [[index, dir], setState] = useState<[number, number]>([0, 1])
  const count = images.length

  const go = (next: number, direction: number) =>
    setState([(next + count) % count, direction])

  useEffect(() => {
    if (reduce || count < 2) return
    const id = setInterval(() => {
      setState(([i]) => [(i + 1) % count, 1])
    }, interval)
    return () => clearInterval(id)
  }, [reduce, count, interval])

  if (count === 0) return null

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0 }),
  }

  return (
    <div className="w-full max-w-sm">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-gold-400/40 ring-offset-4 ring-offset-canopy shadow-2xl">
        <AnimatePresence initial={false} custom={dir} mode="popLayout">
          <motion.div
            key={index}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={images[index]}
              alt=""
              fill
              priority={index === 0}
              sizes="(max-width: 768px) 90vw, 24rem"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-canopy/40 to-transparent" />
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => go(i, i > index ? 1 : -1)}
              className={
                i === index
                  ? "h-2 w-6 rounded-full bg-gold-400 transition-all"
                  : "h-2 w-2 rounded-full bg-white/30 transition-all hover:bg-white/60"
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
