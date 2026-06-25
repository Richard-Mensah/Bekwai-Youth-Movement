import Link from "next/link"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost"
type Size = "sm" | "md" | "lg"

type Props = {
  children: React.ReactNode
  href?: string
  type?: "button" | "submit"
  variant?: Variant
  size?: Size
  disabled?: boolean
  className?: string
  onClick?: () => void
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-brand-green text-white hover:bg-brand-green-600 focus-visible:ring-brand-green",
  secondary:
    "bg-brand-red text-white hover:bg-brand-red-600 focus-visible:ring-brand-red",
  outline:
    "border border-brand-green text-brand-green hover:bg-brand-green-50 focus-visible:ring-brand-green",
  ghost: "text-brand-green hover:bg-brand-green-50 focus-visible:ring-brand-green",
}

const SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3 text-base",
}

export default function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  size = "md",
  disabled = false,
  className,
  onClick,
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
    VARIANTS[variant],
    SIZES[size],
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  )
}
