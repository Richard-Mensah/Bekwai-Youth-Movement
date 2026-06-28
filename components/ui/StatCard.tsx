import { cn } from "@/lib/utils"

type Props = {
  label: string
  value: string | number
  hint?: string
  accent?: "green" | "red" | "blue" | "gold"
  className?: string
}

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  green: "text-brand-green",
  red: "text-brand-red",
  blue: "text-brand-blue",
  gold: "text-gold-600",
}

export default function StatCard({
  label,
  value,
  hint,
  accent = "green",
  className,
}: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-canopy/10 bg-white p-5 shadow-card dark:border-white/10 dark:bg-canopy-800",
        className
      )}
    >
      <p className="text-sm font-medium text-ink/55 dark:text-paper/55">{label}</p>
      <p className={cn("mt-1 font-display text-3xl font-semibold", ACCENT[accent])}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-ink/45 dark:text-paper/45">{hint}</p>}
    </div>
  )
}
