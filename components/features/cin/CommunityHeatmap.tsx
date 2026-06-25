import { scoreColor } from "@/constants/cin"
import type { CommunityScore } from "@/lib/data/cin"

/**
 * Categorical community heatmap — one cell per community, coloured by its
 * development score. A geographic map (Leaflet) can be layered on later using
 * the gps_lat/gps_lng columns already in the schema.
 */
export default function CommunityHeatmap({ scores }: { scores: CommunityScore[] }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6 lg:grid-cols-8">
        {scores.map((s) => (
          <div
            key={s.communityId}
            title={`${s.communityName} — score ${s.score}, ${s.open} open issue(s)`}
            className="flex aspect-square flex-col items-center justify-center rounded-md p-1 text-center text-white"
            style={{ backgroundColor: scoreColor(s.score) }}
          >
            <span className="text-[10px] font-bold leading-none">{s.score}</span>
            <span className="mt-0.5 truncate text-[8px] leading-tight opacity-90">
              {s.communityName.replace("Sub-Community ", "C")}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
        <Legend color="#1F4D3F" label="80+ strong" />
        <Legend color="#4C9F38" label="65–79" />
        <Legend color="#FD9D24" label="50–64" />
        <Legend color="#E5243B" label="35–49" />
        <Legend color="#8E1B1B" label="<35 critical" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
      {label}
    </span>
  )
}
