type Datum = { goal: number; title: string; color: string; projects: number }

/** Bars showing how many projects are aligned to each SDG. */
export default function SdgProgress({ data }: { data: Datum[] }) {
  const max = Math.max(1, ...data.map((d) => d.projects))
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.goal} className="flex items-center gap-3">
          <span
            className="flex h-7 w-9 shrink-0 items-center justify-center rounded text-xs font-bold text-white"
            style={{ backgroundColor: d.color }}
          >
            {d.goal}
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="truncate text-xs text-gray-600">{d.title}</span>
              <span className="ml-2 shrink-0 text-xs font-medium text-gray-500">
                {d.projects}
              </span>
            </div>
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(d.projects / max) * 100}%`,
                  backgroundColor: d.color,
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
