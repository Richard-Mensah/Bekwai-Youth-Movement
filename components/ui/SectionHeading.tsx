import { cn } from "@/lib/utils"

type Props = {
  eyebrow?: string
  title: string
  description?: string
  centered?: boolean
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
  className,
}: Props) {
  return (
    <div className={cn(centered && "mx-auto max-w-2xl text-center", className)}>
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-red">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-2xl font-bold sm:text-3xl">{title}</h2>
      <div className={cn("mt-3 rule-accent", centered && "mx-auto")} />
      {description && (
        <p className="mt-4 text-gray-600 leading-relaxed">{description}</p>
      )}
    </div>
  )
}
