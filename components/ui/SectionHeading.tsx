import { cn } from "@/lib/utils"

type Props = {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
  /** Use on dark (canopy) backgrounds. */
  invert?: boolean
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  invert = false,
  className,
}: Props) {
  return (
    <div className={cn(centered && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <p className={invert ? "eyebrow-light" : "eyebrow"}>
          <span className="h-px w-5 bg-current opacity-60" aria-hidden />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "mt-3 text-3xl font-semibold sm:text-4xl text-balance",
          invert && "text-white"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 leading-relaxed text-pretty",
            invert ? "text-white/75" : "text-ink/70"
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
