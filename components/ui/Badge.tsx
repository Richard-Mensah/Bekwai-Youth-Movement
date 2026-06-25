import { cn } from "@/lib/utils"

type Tone = "green" | "red" | "blue" | "gray" | "amber" | "gold" | "canopy"

type Props = {
  children: React.ReactNode
  tone?: Tone
  className?: string
}

const TONES: Record<Tone, string> = {
  green: "bg-brand-green-50 text-brand-green-700 ring-brand-green-100",
  red: "bg-brand-red-50 text-brand-red-700 ring-brand-red-100",
  blue: "bg-brand-blue-50 text-brand-blue-700 ring-brand-blue-100",
  gray: "bg-gray-100 text-gray-700 ring-gray-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
  gold: "bg-gold-50 text-gold-700 ring-gold-200",
  canopy: "bg-canopy-50 text-canopy-700 ring-canopy-100",
}

export default function Badge({ children, tone = "green", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
        TONES[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
