import Link from "next/link"
import { BILL_FLOW, BILL_STATUS_META } from "@/constants/parliament"
import type { BillRow } from "@/lib/data/parliament"

/** Kanban of bills grouped by legislative stage. */
export default function BillPipeline({ bills }: { bills: BillRow[] }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3" style={{ minWidth: "900px" }}>
        {BILL_FLOW.map((stage) => {
          const col = bills.filter((b) => b.status === stage)
          return (
            <div key={stage} className="w-44 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-600">
                  {BILL_STATUS_META[stage].label}
                </p>
                <span className="rounded-full bg-gray-100 px-1.5 text-[11px] font-medium text-gray-500">
                  {col.length}
                </span>
              </div>
              <div className="space-y-2">
                {col.map((b) => (
                  <Link
                    key={b.id}
                    href={`/dashboard/mp/bills/${b.id}`}
                    className="block rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-brand-green"
                  >
                    <p className="text-[11px] font-semibold text-brand-blue">
                      {b.reference ?? "—"}
                    </p>
                    <p className="mt-0.5 text-xs font-medium leading-snug text-gray-700">
                      {b.title}
                    </p>
                  </Link>
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
