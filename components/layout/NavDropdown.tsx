"use client"

import { useEffect, useId, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import type { NavLink } from "@/constants/nav"
import { cn } from "@/lib/utils"

type Props = {
  label: string
  items: NavLink[]
}

/**
 * Accessible desktop dropdown tab. Opens on hover and on click/focus; closes
 * on Escape, blur-out, and click-outside. Driven entirely by nav data.
 */
export default function NavDropdown({ label, items }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const menuId = useId()

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }
  const scheduleClose = () => {
    cancelClose()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => {
        cancelClose()
        setOpen(true)
      }}
      onMouseLeave={scheduleClose}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget as Node)) setOpen(false)
      }}
    >
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open ? "true" : "false"}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "group inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          open ? "text-canopy dark:text-paper" : "text-ink/70 hover:text-canopy dark:text-paper/70 dark:hover:text-paper"
        )}
      >
        {label}
        <ChevronDown
          size={15}
          className={cn(
            "transition-transform duration-200",
            open && "rotate-180 text-gold-500"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 top-full z-50 w-80 pt-3"
          >
            <div className="overflow-hidden rounded-2xl border border-canopy/10 bg-white p-2 shadow-card-hover dark:border-white/10 dark:bg-canopy-800">
              {items.map((item) => (
                <Link
                  key={item.href + item.label}
                  href={item.href}
                  role="menuitem"
                  onClick={() => setOpen(false)}
                  className="group/item block rounded-xl px-3 py-2.5 transition-colors hover:bg-paper dark:hover:bg-white/5"
                >
                  <span className="flex items-center text-sm font-semibold text-canopy dark:text-paper">
                    {item.label}
                    <span className="ml-2 h-px w-0 bg-gold-400 transition-all duration-200 group-hover/item:w-5" />
                  </span>
                  {item.description && (
                    <span className="mt-0.5 block text-xs text-ink/55 dark:text-paper/55">
                      {item.description}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
