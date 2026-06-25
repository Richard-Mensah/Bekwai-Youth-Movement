import {
  getBills,
  getMotions,
  getSessions,
  getRecommendations,
  parliamentStats,
} from "@/lib/data/parliament"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import BillPipeline from "@/components/features/parliament/BillPipeline"
import BillForm from "@/components/features/parliament/BillForm"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"

export default async function MpDashboard() {
  const [bills, motions, sessions, recs] = await Promise.all([
    getBills(),
    getMotions(),
    getSessions(),
    getRecommendations(),
  ])
  const stats = parliamentStats(bills, motions)

  return (
    <>
      <DashboardHeading
        title="Bekwai Youth Parliament"
        subtitle="Bills, motions, voting, and Youth Recommendations"
      />

      <div className="grid gap-4 sm:grid-cols-4">
        <StatCard label="Active bills" value={stats.activeBills} hint="In the chamber" />
        <StatCard label="Passed" value={stats.passed} hint="Adopted bills" />
        <StatCard label="Open motions" value={stats.openMotions} accent="blue" />
        <StatCard label="Recommendations" value={recs.length} accent="red" hint="To Cabinet" />
      </div>

      <div className="mt-6" id="bills">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Bills pipeline</h3>
          <p className="mt-1 text-xs text-gray-500">
            Click a bill to open its readings, debate, and live vote.
          </p>
          <div className="mt-4">
            <BillPipeline bills={bills} />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Submit business</h3>
          <div className="mt-4">
            <BillForm />
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-bold text-brand-green-700">Motions</h3>
            <ul className="mt-3 space-y-2">
              {motions.map((m) => (
                <li key={m.id} className="rounded-lg border border-gray-100 p-3">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-gray-700">{m.title}</p>
                    <Badge tone="blue">{m.status}</Badge>
                  </div>
                  {m.body && <p className="mt-1 text-xs text-gray-500">{m.body}</p>}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="text-sm font-bold text-brand-green-700">
              Youth Recommendations
            </h3>
            <ul className="mt-3 space-y-2">
              {recs.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-lg border border-gray-100 p-3">
                  <p className="text-sm font-medium text-gray-700">{r.title}</p>
                  <Badge tone="green">{r.status}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Sessions</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {sessions.map((s) => (
              <div key={s.id} className="rounded-lg border border-gray-100 p-3 text-sm">
                <p className="font-medium text-gray-700">{s.name}</p>
                <p className="text-xs text-gray-500">
                  {s.opensOn ?? "—"} → {s.closesOn ?? "—"}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
