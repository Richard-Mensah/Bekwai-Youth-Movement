type Props = {
  title: string
  subtitle?: string
}

export default function DashboardHeading({ title, subtitle }: Props) {
  return (
    <div className="mb-6">
      <h1 className="font-serif text-2xl font-bold text-brand-green-700">
        {title}
      </h1>
      {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}
