import Link from "next/link"
import { PROJECT_STATUS_META, ghs } from "@/constants/projects"
import type { ProjectStatus } from "@/types"
import type { ProjectRow } from "@/lib/data/projects"

const COLUMNS: ProjectStatus[] = [
  "proposed",
  "approved",
  "in_progress",
  "completed",
  "suspended",
]

/** Kanban of projects grouped by lifecycle status. */
export default function ProjectBoard({ projects }: { projects: ProjectRow[] }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3" style={{ minWidth: "1000px" }}>
        {COLUMNS.map((status) => {
          const col = projects.filter((p) => p.status === status)
          return (
            <div key={status} className="w-48 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-600">
                  {PROJECT_STATUS_META[status].label}
                </p>
                <span className="rounded-full bg-gray-100 px-1.5 text-[11px] font-medium text-gray-500">
                  {col.length}
                </span>
              </div>
              <div className="space-y-2">
                {col.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/cabinet/projects/${p.id}`}
                    className="block rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition hover:border-brand-green"
                  >
                    <p className="text-xs font-medium leading-snug text-gray-700">
                      {p.name}
                    </p>
                    <p className="mt-1 text-[11px] text-gray-400">{p.communityName}</p>
                    <p className="mt-1 text-[11px] font-semibold text-brand-blue">
                      {ghs(p.budgetGhs)}
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
