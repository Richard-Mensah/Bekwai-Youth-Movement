"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  Scale,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Leaf,
  Database,
  Megaphone,
  ChevronDown,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import Badge from "@/components/ui/Badge"
import type { Unit } from "@/types"

const ICONS: Record<number, LucideIcon> = {
  1: Scale,
  2: GraduationCap,
  3: HeartPulse,
  4: Briefcase,
  5: Leaf,
  6: Database,
  7: Megaphone,
}

function UnitCard({ unit }: { unit: Unit }) {
  const Icon = ICONS[unit.no] ?? Scale
  return (
    <div className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-canopy-50 text-canopy">
          <Icon size={20} />
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
          Unit {unit.no}
        </span>
      </div>
      <h3 className="mt-4 font-display text-lg font-semibold text-canopy">{unit.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">{unit.mandate}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {unit.sdg.map((g) => (
          <Badge key={g} tone="gold">
            SDG {g}
          </Badge>
        ))}
      </div>
    </div>
  )
}

/** Shows the first row of units; the rest expand on demand. */
export default function ProgramsGridClient({ units }: { units: Unit[] }) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  const firstRow = units.slice(0, 3)
  const rest = units.slice(3)

  return (
    <>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {firstRow.map((unit) => (
          <UnitCard key={unit.no} unit={unit} />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {open && rest.length > 0 && (
          <motion.div
            key="rest"
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((unit) => (
                <UnitCard key={unit.no} unit={unit} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {rest.length > 0 && (
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="inline-flex items-center gap-2 rounded-full border border-canopy/25 bg-white px-6 py-3 text-sm font-semibold text-canopy transition-all hover:-translate-y-0.5 hover:bg-canopy-50"
          >
            {open ? "Show less" : `Show all ${units.length} units`}
            <ChevronDown
              size={16}
              className={`transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      )}
    </>
  )
}
