import Badge from "@/components/ui/Badge"
import { STATUS_TONE } from "@/constants/cin"
import { formatDate, humanize } from "@/lib/utils"
import type { CinReportRow } from "@/lib/data/cin"

export default function ReportsTable({ rows }: { rows: CinReportRow[] }) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-gray-300 bg-paper p-6 text-center text-sm text-gray-500">
        No reports yet. Submit your first monthly community report.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-400">
            <th className="py-2 pr-4 font-medium">Category</th>
            <th className="py-2 pr-4 font-medium">Community</th>
            <th className="py-2 pr-4 font-medium">Severity</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2 pr-4 font-medium">Reported</th>
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, 25).map((r) => (
            <tr key={r.id} className="border-b border-gray-100">
              <td className="py-2.5 pr-4 font-medium text-gray-700">{r.category}</td>
              <td className="py-2.5 pr-4 text-gray-600">{r.communityName}</td>
              <td className="py-2.5 pr-4 text-gray-600">{humanize(r.severity)}</td>
              <td className="py-2.5 pr-4">
                <Badge tone={STATUS_TONE[r.status]}>{humanize(r.status)}</Badge>
              </td>
              <td className="py-2.5 pr-4 text-gray-500">
                {r.reportedAt ? formatDate(r.reportedAt) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
