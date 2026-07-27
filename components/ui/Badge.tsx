import { cn } from "@/lib/utils"

type Tone = "green" | "red" | "blue" | "gray" | "amber" | "gold" | "canopy"

type Props = {
  children: React.ReactNode
  tone?: Tone
  /** Leading status dot — use when the badge reports a live state. */
  dot?: boolean
  className?: string
}

/**
 * Tones carry a dark variant each. Previously only the light side was defined,
 * so in dark mode a badge was a pale chip glowing on a near-black surface —
 * and "gray" reached for stock Tailwind greys that belong to no palette here.
 */
const TONES: Record<Tone, string> = {
  green:
    "bg-brand-green-50 text-brand-green-700 ring-brand-green-100 dark:bg-brand-green/20 dark:text-brand-green-100 dark:ring-brand-green/30",
  red: "bg-brand-red-50 text-brand-red-700 ring-brand-red-100 dark:bg-brand-red/20 dark:text-brand-red-100 dark:ring-brand-red/30",
  blue: "bg-brand-blue-50 text-brand-blue-700 ring-brand-blue-100 dark:bg-brand-blue/20 dark:text-brand-blue-100 dark:ring-brand-blue/30",
  gray: "bg-canopy-50 text-canopy-700 ring-canopy-100 dark:bg-white/10 dark:text-paper/70 dark:ring-white/15",
  amber:
    "bg-gold-50 text-gold-700 ring-gold-200 dark:bg-gold-400/15 dark:text-gold-200 dark:ring-gold-400/30",
  gold: "bg-gold-50 text-gold-700 ring-gold-200 dark:bg-gold-400/15 dark:text-gold-200 dark:ring-gold-400/30",
  canopy:
    "bg-canopy-50 text-canopy-700 ring-canopy-100 dark:bg-white/10 dark:text-paper/80 dark:ring-white/15",
}

const DOT: Record<Tone, string> = {
  green: "bg-brand-green",
  red: "bg-brand-red",
  blue: "bg-brand-blue",
  gray: "bg-canopy-300",
  amber: "bg-gold-400",
  gold: "bg-gold-400",
  canopy: "bg-canopy-400",
}

export default function Badge({
  children,
  tone = "green",
  dot = false,
  className,
}: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset",
        TONES[tone],
        className
      )}
    >
      {dot && (
        <span
          aria-hidden
          className={cn("h-1.5 w-1.5 rounded-full", DOT[tone])}
        />
      )}
      {children}
    </span>
  )
}
