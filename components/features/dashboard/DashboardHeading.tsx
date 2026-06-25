type Props = {
  title: string
  subtitle?: string
}

export default function DashboardHeading({ title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <h1 className="font-display text-2xl font-semibold text-canopy">{title}</h1>
      {subtitle && <p className="mt-1 text-sm text-ink/55">{subtitle}</p>}
    </div>
  )
}
