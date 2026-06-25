import { Construction } from "lucide-react"

type Props = {
  title: string
  description: string
  phase?: string
}

/** Placeholder shown where live data arrives in a later roadmap phase. */
export default function EmptyState({ title, description, phase }: Props) {
  return (
    <div className="rounded-xl border border-dashed border-gray-300 bg-paper px-6 py-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-green-50 text-brand-green">
        <Construction size={24} />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-green-700">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">{description}</p>
      {phase && (
        <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-brand-red">
          {phase}
        </p>
      )}
    </div>
  )
}
