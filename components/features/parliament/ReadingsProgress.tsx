import { BILL_FLOW, BILL_STATUS_META } from "@/constants/parliament"
import type { BillStatus } from "@/types"
import { cn } from "@/lib/utils"

/** Horizontal stepper showing a bill's progress through the readings. */
export default function ReadingsProgress({ status }: { status: BillStatus }) {
  if (status === "rejected") {
    return (
      <p className="rounded-lg bg-brand-red-50 px-3 py-2 text-sm font-medium text-brand-red-700">
        This bill was rejected.
      </p>
    )
  }
  const currentIndex = BILL_FLOW.indexOf(status)

  return (
    <ol className="flex flex-wrap gap-2">
      {BILL_FLOW.map((stage, i) => {
        const done = i < currentIndex
        const active = i === currentIndex
        return (
          <li
            key={stage}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
              active && "bg-brand-green text-white",
              done && "bg-brand-green-50 text-brand-green-700",
              !active && !done && "bg-gray-100 text-gray-400"
            )}
          >
            <span
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded-full text-[10px]",
                active ? "bg-white text-brand-green" : "bg-white/60 text-current"
              )}
            >
              {i + 1}
            </span>
            {BILL_STATUS_META[stage].label}
          </li>
        )
      })}
    </ol>
  )
}
