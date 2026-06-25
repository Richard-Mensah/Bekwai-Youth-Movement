import { NOMINATION_FLOW, NOMINATION_META, SEAT_LABEL } from "@/constants/governance"
import NominationControls from "./NominationControls"
import type { NominationRow } from "@/lib/data/governance"

/** Kanban of nominations through the 5-step vetting pipeline. */
export default function NominationPipeline({ rows }: { rows: NominationRow[] }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3" style={{ minWidth: "920px" }}>
        {NOMINATION_FLOW.map((stage) => {
          const col = rows.filter((r) => r.stage === stage)
          return (
            <div key={stage} className="w-44 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-600">
                  {NOMINATION_META[stage].label}
                </p>
                <span className="rounded-full bg-gray-100 px-1.5 text-[11px] font-medium text-gray-500">
                  {col.length}
                </span>
              </div>
              <div className="space-y-2">
                {col.map((r) => (
                  <div key={r.id} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                    <p className="text-xs font-semibold text-gray-700">{r.fullName}</p>
                    <p className="text-[11px] text-gray-400">{r.communityName}</p>
                    <p className="mt-0.5 text-[10px] font-medium text-brand-blue">
                      {SEAT_LABEL[r.seatType]}
                    </p>
                    <NominationControls id={r.id} stage={r.stage} />
                  </div>
                ))}
                {col.length === 0 && (
                  <div className="rounded-lg border border-dashed border-gray-200 p-3 text-center text-[11px] text-gray-300">
                    Empty
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
