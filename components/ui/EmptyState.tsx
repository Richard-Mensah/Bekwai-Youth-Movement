import { Compass, type LucideIcon } from "lucide-react"

type Props = {
  title: string
  description: string
  phase?: string
  /** Override the default icon to suit the surface. */
  icon?: LucideIcon
  /** A way forward — a button or link. An empty state without one is a wall. */
  action?: React.ReactNode
}

/** Shown where there is nothing yet, or where live data arrives in a later phase. */
export default function EmptyState({
  title,
  description,
  phase,
  icon: Icon = Compass,
  action,
}: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-canopy/15 bg-paper/60 px-6 py-14 text-center dark:border-white/[0.12] dark:bg-white/[0.03]">
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full bg-gold-400/15 blur-lg"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-canopy text-gold-300 shadow-card">
          <Icon size={24} aria-hidden />
        </span>
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold text-canopy dark:text-paper">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/55 dark:text-paper/55">
        {description}
      </p>
      {phase && (
        <p className="eyebrow mt-4 justify-center">{phase}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
