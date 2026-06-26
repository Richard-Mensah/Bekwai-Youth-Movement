import Link from "next/link"
import { getTenure } from "@/lib/data/governance"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

export default async function TenurePage() {
  const rows = await getTenure()
  const expiring = rows.filter((r) => r.expiringSoon).length
  const expired = rows.filter((r) => r.expired).length

  return (
    <>
      <Link href="/dashboard/admin" className="mb-3 inline-block text-sm text-brand-green hover:underline">
        ← Back to Administration
      </Link>
      <DashboardHeading
        title="Term-Limit & Tenure Registry"
        subtitle="Tenure tracking with printable appointment letters & ID cards (Governance §9.6)"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Officers tracked" value={rows.length} />
        <StatCard label="Expiring soon" value={expiring} hint="Within 60 days" accent="blue" />
        <StatCard label="Term expired" value={expired} accent="red" />
      </div>

      <div className="mt-6">
        <Card>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-ink/45">
                  <th className="py-2 pr-4 font-medium">Officer</th>
                  <th className="py-2 pr-4 font-medium">Position</th>
                  <th className="py-2 pr-4 font-medium">Term</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 pr-4 font-medium">Documents</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-gray-100">
                    <td className="py-2.5 pr-4 font-medium text-gray-700">{r.fullName}</td>
                    <td className="py-2.5 pr-4 text-ink/65">{r.positionTitle}</td>
                    <td className="py-2.5 pr-4 text-xs text-ink/55">
                      {r.termStart ? formatDate(r.termStart) : "—"} →{" "}
                      {r.termEnd ? formatDate(r.termEnd) : "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                      {r.expired ? (
                        <Badge tone="red">Expired</Badge>
                      ) : r.expiringSoon ? (
                        <Badge tone="amber">Expiring</Badge>
                      ) : (
                        <Badge tone="green">Active</Badge>
                      )}
                    </td>
                    <td className="py-2.5 pr-4">
                      <div className="flex gap-2">
                        <Link href={`/print/appointment/${r.id}`} className="text-xs font-medium text-brand-green hover:underline">
                          Letter
                        </Link>
                        <Link href={`/print/id-card/${r.id}`} className="text-xs font-medium text-brand-blue hover:underline">
                          ID card
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: stacked cards */}
          <ul className="space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={r.id} className="rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-gray-700">{r.fullName}</p>
                    <p className="text-xs text-ink/65">{r.positionTitle}</p>
                  </div>
                  {r.expired ? (
                    <Badge tone="red">Expired</Badge>
                  ) : r.expiringSoon ? (
                    <Badge tone="amber">Expiring</Badge>
                  ) : (
                    <Badge tone="green">Active</Badge>
                  )}
                </div>
                <p className="mt-2 text-xs text-ink/55">
                  {r.termStart ? formatDate(r.termStart) : "—"} →{" "}
                  {r.termEnd ? formatDate(r.termEnd) : "—"}
                </p>
                <div className="mt-3 flex gap-4 border-t border-gray-100 pt-3">
                  <Link href={`/print/appointment/${r.id}`} className="text-xs font-medium text-brand-green hover:underline">
                    Letter
                  </Link>
                  <Link href={`/print/id-card/${r.id}`} className="text-xs font-medium text-brand-blue hover:underline">
                    ID card
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}
