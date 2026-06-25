import { cn } from "@/lib/utils"

type Props = {
  label: string
  value: string | number
  hint?: string
  accent?: "green" | "red" | "blue"
  className?: string
}

const ACCENT: Record<NonNullable<Props["accent"]>, string> = {
  green: "text-brand-green",
  red: "text-brand-red",
  blue: "text-brand-blue",
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
        "rounded-xl border border-gray-200 bg-white p-5 shadow-sm",
        className
      )}
    >
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className={cn("mt-1 text-3xl font-bold font-serif", ACCENT[accent])}>
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
    </div>
  )
}
