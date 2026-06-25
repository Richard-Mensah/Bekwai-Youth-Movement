import Card from "@/components/ui/Card"

type Item = { title: string; meta: string }

type Props = { items: Item[] }

/** Static activity feed shell — wired to realtime data in later phases. */
export default function ActivityFeed({ items }: Props) {
  return (
    <Card>
      <h3 className="text-sm font-bold text-brand-green-700">Recent activity</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item, i) => (
          <li key={i} className="flex gap-3">
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-brand-green" />
            <div>
              <p className="text-sm text-gray-700">{item.title}</p>
              <p className="text-xs text-gray-400">{item.meta}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
