"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, X, UserPlus, HeartHandshake, Mail, ArrowUp } from "lucide-react"

const LINKS = [
  { label: "Join the Movement", href: "/join", icon: UserPlus },
  { label: "Support us", href: "/transparency", icon: HeartHandshake },
  { label: "Contact", href: "/contact", icon: Mail },
]

/** Bottom-left floating dock: an expandable "Join" action cluster plus a
 * back-to-top button. Appears after the user scrolls past the hero.
 * Positioned bottom-left so it never collides with the WhatsApp FAB (bottom-right). */
export default function FloatingActions() {
  const [visible, setVisible] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" })

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-3 print:hidden"
        >
          <button
            type="button"
            onClick={scrollTop}
            aria-label="Back to top"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-canopy/15 bg-white/90 text-canopy shadow-card backdrop-blur transition-transform hover:-translate-y-0.5 dark:border-white/15 dark:bg-canopy-800/90 dark:text-paper"
          >
            <ArrowUp size={18} />
          </button>

          <div className="flex flex-col items-start gap-2">
            <AnimatePresence>
              {expanded &&
                LINKS.map(({ label, href, icon: Icon }, i) => (
                  <motion.div
                    key={href}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={href}
                      onClick={() => setExpanded(false)}
                      className="inline-flex items-center gap-2 rounded-full bg-white/95 py-2 pl-3 pr-4 text-sm font-semibold text-canopy shadow-card backdrop-blur transition-transform hover:-translate-y-0.5 dark:bg-canopy-800/95 dark:text-paper"
                    >
                      <Icon size={16} className="text-gold-500" />
                      {label}
                    </Link>
                  </motion.div>
                ))}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-label={expanded ? "Close quick actions" : "Open quick actions"}
              aria-expanded={expanded}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red py-3 pl-4 pr-5 text-sm font-semibold text-white shadow-lg transition-transform hover:-translate-y-0.5"
            >
              {expanded ? <X size={18} /> : <Plus size={18} />}
              {expanded ? "Close" : "Get involved"}
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
