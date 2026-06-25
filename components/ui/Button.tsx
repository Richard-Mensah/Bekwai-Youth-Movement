import Link from "next/link"
import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary" | "outline" | "ghost" | "gold" | "light"
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
  "aria-label"?: string
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-canopy text-white shadow-sm hover:bg-canopy-600 focus-visible:ring-canopy",
  secondary:
    "bg-brand-red text-white shadow-sm hover:bg-brand-red-600 focus-visible:ring-brand-red",
  gold: "bg-gold-400 text-canopy shadow-sm hover:bg-gold-300 focus-visible:ring-gold",
  outline:
    "border border-canopy/25 bg-white text-canopy hover:border-canopy/40 hover:bg-canopy-50 focus-visible:ring-canopy",
  light:
    "border border-white/40 text-white hover:bg-white/10 focus-visible:ring-white",
  ghost: "text-canopy hover:bg-canopy-50 focus-visible:ring-canopy",
}

const SIZES: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
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
  ...rest
}: Props) {
  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5",
    VARIANTS[variant],
    SIZES[size],
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...rest}
    >
      {children}
    </button>
  )
}
