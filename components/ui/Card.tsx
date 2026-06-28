import { cn } from "@/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
  id?: string
  /** Adds a hover-lift interaction (for clickable/linked cards). */
  interactive?: boolean
  /** Adds a colored top accent edge. */
  accent?: "green" | "red" | "blue" | "gold" | "none"
}

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  green: "before:bg-brand-green",
  red: "before:bg-brand-red",
  blue: "before:bg-brand-blue",
  gold: "before:bg-gold-400",
  none: "",
}

export default function Card({
  children,
  className,
  id,
  interactive = false,
  accent = "none",
}: Props) {
  return (
    <div
      id={id}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800",
        accent !== "none" &&
          "before:absolute before:inset-x-0 before:top-0 before:h-1 before:content-['']",
        ACCENT[accent],
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-canopy/20 hover:shadow-card-hover",
        className
      )}
    >
      {children}
    </div>
  )
}
