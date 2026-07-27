"use client"

import { useMemo, useState } from "react"
import { Search, SlidersHorizontal, X } from "lucide-react"
import { motion, useReducedMotion } from "framer-motion"
import { ARM_META, OFFICES } from "@/constants/offices"
import type { Office, RoleArm } from "@/constants/offices"
import { UNITS } from "@/constants/units"
import RoleCard from "./RoleCard"
import { ARM_STYLE } from "./OfficeIcon"
import { cn } from "@/lib/utils"

type Props = {
  /** Base path for a role's detail page; the slug is appended. */
  basePath: string
  /** Titles the signed-in user has already applied for. */
  appliedTitles?: string[]
  /** Submitted-application counts keyed by office title. */
  applicantCounts?: Record<string, number>
}

const ARMS: RoleArm[] = ["cabinet", "parliament", "cin", "community"]

/**
 * Browsable, filterable catalogue of every office open for application.
 * Filtering is client-side over a ~30-item static list, so there is no need
 * for URL params or a server round-trip.
 */
export default function RoleCatalogue({
  basePath,
  appliedTitles = [],
  applicantCounts = {},
}: Props) {
  const [query, setQuery] = useState("")
  const [arm, setArm] = useState<RoleArm | "all">("all")
  const [unit, setUnit] = useState<string>("all")
  const reduce = useReducedMotion()
  const applied = useMemo(() => new Set(appliedTitles), [appliedTitles])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return OFFICES.filter((o) => {
      if (arm !== "all" && o.arm !== arm) return false
      if (unit !== "all" && o.unit !== unit) return false
      if (!q) return true
      return (
        o.title.toLowerCase().includes(q) ||
        o.summary.toLowerCase().includes(q) ||
        (o.constitutionalTitle ?? "").toLowerCase().includes(q) ||
        (o.ukEquivalent ?? "").toLowerCase().includes(q) ||
        o.responsibilities.some((r) => r.toLowerCase().includes(q))
      )
    })
  }, [query, arm, unit])

  const grouped = useMemo(() => {
    const map = new Map<RoleArm, Office[]>()
    for (const o of results) {
      const list = map.get(o.arm) ?? []
      list.push(o)
      map.set(o.arm, list)
    }
    return map
  }, [results])

  const filtered = arm !== "all" || unit !== "all" || query.trim() !== ""

  return (
    <div>
      {/* Controls */}
      <div className="sticky top-0 z-10 -mx-1 bg-paper/85 px-1 py-3 backdrop-blur-sm dark:bg-canopy-900/85">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 dark:text-paper/35"
            />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search offices — try “finance”, “schools”, “data”…"
              aria-label="Search offices"
              className="w-full rounded-full border border-canopy/15 bg-white py-2.5 pl-10 pr-4 text-sm text-ink shadow-sm placeholder:text-ink/35 focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-800 dark:text-paper dark:placeholder:text-paper/35"
            />
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="unit-filter" className="sr-only">
              Filter by unit
            </label>
            <span className="hidden text-ink/35 dark:text-paper/35 sm:block">
              <SlidersHorizontal size={16} />
            </span>
            <select
              id="unit-filter"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="rounded-full border border-canopy/15 bg-white px-4 py-2.5 text-sm text-ink shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-800 dark:text-paper"
            >
              <option value="all">All units</option>
              {UNITS.map((u) => (
                <option key={u.no} value={u.name}>
                  {u.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Arm pills */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <ArmPill active={arm === "all"} onClick={() => setArm("all")}>
            All offices
            <Count n={OFFICES.length} />
          </ArmPill>
          {ARMS.map((a) => (
            <ArmPill key={a} active={arm === a} onClick={() => setArm(a)} arm={a}>
              {ARM_META[a].short}
              <Count n={OFFICES.filter((o) => o.arm === a).length} />
            </ArmPill>
          ))}
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setQuery("")
                setArm("all")
                setUnit("all")
              }}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/50 hover:bg-canopy/5 hover:text-canopy dark:text-paper/50 dark:hover:bg-white/5 dark:hover:text-paper"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {results.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-canopy/20 bg-white/60 px-6 py-16 text-center dark:border-white/15 dark:bg-canopy-800/50">
          <p className="font-display text-lg font-semibold text-canopy dark:text-paper">
            No offices match that search
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-ink/55 dark:text-paper/55">
            Try a broader word, or clear the filters to see all{" "}
            {OFFICES.length} offices open for application.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          {ARMS.filter((a) => grouped.has(a)).map((a) => {
            const list = grouped.get(a) ?? []
            return (
              <section key={a}>
                <div className="flex items-baseline gap-3">
                  <span
                    className={cn("h-2 w-2 shrink-0 rounded-full", ARM_STYLE[a].dot)}
                  />
                  <h2 className="font-display text-lg font-semibold text-canopy dark:text-paper">
                    {ARM_META[a].label}
                  </h2>
                  <span className="text-xs tabular-nums text-ink/40 dark:text-paper/40">
                    {list.length}
                  </span>
                </div>
                <p className="ml-5 mt-1 max-w-2xl text-sm text-ink/55 dark:text-paper/55">
                  {ARM_META[a].description}
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((office, i) => (
                    <motion.div
                      key={office.slug}
                      initial={reduce ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(i * 0.04, 0.3),
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <RoleCard
                        office={office}
                        href={`${basePath}/${office.slug}`}
                        applied={applied.has(office.title)}
                        applicants={applicantCounts[office.title]}
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Count({ n }: { n: number }) {
  return (
    <span className="ml-1.5 tabular-nums text-[11px] opacity-60">{n}</span>
  )
}

function ArmPill({
  active,
  arm,
  onClick,
  children,
}: {
  active: boolean
  arm?: RoleArm
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors",
        active
          ? "bg-canopy text-white ring-canopy"
          : arm
            ? cn("hover:brightness-95", ARM_STYLE[arm].chip)
            : "bg-white text-ink/60 ring-canopy/15 hover:text-canopy dark:bg-canopy-800 dark:text-paper/60 dark:ring-white/10"
      )}
    >
      {children}
    </button>
  )
}
