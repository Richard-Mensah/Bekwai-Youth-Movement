import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type Accent = "green" | "red" | "blue" | "gold"

type Props = {
  label: string
  value: string | number
  hint?: string
  accent?: Accent
  /** Optional icon, shown in a tinted tile in the corner. */
  icon?: LucideIcon
  /** Short delta note, e.g. "+3 this week". Rendered beside the hint. */
  trend?: string
  className?: string
}

/**
 * Accent drives the number, the icon tile and a hairline top edge together, so
 * a card reads as one deliberate colour rather than a green number that happens
 * to sit above an unrelated border.
 */
const ACCENT: Record<Accent, { text: string; tile: string; edge: string }> = {
  green: {
    text: "text-canopy dark:text-paper",
    tile: "bg-canopy-50 text-canopy dark:bg-white/10 dark:text-paper",
    edge: "from-canopy-400/70",
  },
  red: {
    text: "text-brand-red dark:text-brand-red-100",
    tile: "bg-brand-red-50 text-brand-red dark:bg-brand-red/20 dark:text-brand-red-100",
    edge: "from-brand-red/70",
  },
  blue: {
    text: "text-brand-blue dark:text-brand-blue-100",
    tile: "bg-brand-blue-50 text-brand-blue dark:bg-brand-blue/20 dark:text-brand-blue-100",
    edge: "from-brand-blue/70",
  },
  gold: {
    text: "text-gold-600 dark:text-gold-200",
    tile: "bg-gold-50 text-gold-600 dark:bg-gold-400/15 dark:text-gold-200",
    edge: "from-gold-400/80",
  },
}

export default function StatCard({
  label,
  value,
  hint,
  accent = "green",
  icon: Icon,
  trend,
  className,
}: Props) {
  const a = ACCENT[accent]
  return (
    <div
      className={cn(
        "group surface relative overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-card-hover",
        className
      )}
    >
      {/* Fades out to the right so a row of cards doesn't look like a barcode. */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r to-transparent",
          a.edge
        )}
      />

      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-ink/55 dark:text-paper/55">
          {label}
        </p>
        {Icon && (
          <span
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105",
              a.tile
            )}
          >
            <Icon size={17} aria-hidden />
          </span>
        )}
      </div>

      {/* tabular-nums stops the digits jittering when a count changes. */}
      <p
        className={cn(
          "mt-1.5 font-display text-[2rem] font-semibold leading-none tracking-tight tabular-nums",
          a.text
        )}
      >
        {value}
      </p>

      {(hint || trend) && (
        <p className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-ink/45 dark:text-paper/45">
          {trend && (
            <span className="font-semibold text-canopy-400 dark:text-canopy-200">
              {trend}
            </span>
          )}
          {hint}
        </p>
      )}
    </div>
  )
}
