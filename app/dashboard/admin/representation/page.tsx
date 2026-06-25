import Link from "next/link"
import { getRepresentationGaps, gapStats } from "@/lib/data/governance"
import { INTERIM_TIERS } from "@/constants/governance"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"

function Seat({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      title={`${label}: ${ok ? "filled" : "vacant"}`}
      className={
        ok
          ? "inline-flex h-5 min-w-5 items-center justify-center rounded bg-brand-green-50 px-1 text-[9px] font-bold text-brand-green-700"
          : "inline-flex h-5 min-w-5 items-center justify-center rounded bg-brand-red-50 px-1 text-[9px] font-bold text-brand-red-700"
      }
    >
      {label}
    </span>
  )
}

export default async function RepresentationPage() {
  const gaps = await getRepresentationGaps()
  const stats = gapStats(gaps)
  const needing = gaps.filter(
    (g) => !g.hasMp || !g.hasCouncil || !g.hasCin
  )

  return (
    <>
      <Link href="/dashboard/admin" className="mb-3 inline-block text-sm text-brand-green hover:underline">
        ← Back to Administration
      </Link>
      <DashboardHeading
        title="No Community Left Without a Voice"
        subtitle="Representation gap tracker across all 32 communities (Governance §4.4)"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Fully represented" value={stats.fully} hint={`of ${stats.total} communities`} />
        <StatCard label="Vacant seats" value={stats.vacant} hint="MP · Council · CIN" accent="red" />
        <StatCard label="Need attention" value={needing.length} accent="blue" />
      </div>

      <div className="mt-6">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">Seat coverage</h3>
          <p className="mt-1 text-xs text-gray-500">
            Each community has 3 seats: <strong>MP</strong>, <strong>CR</strong> (Council Rep),
            <strong> CIN</strong>. Green = filled, red = vacant.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {gaps.map((g) => (
              <div
                key={g.communityId}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
              >
                <span className="truncate text-xs font-medium text-gray-700">
                  {g.communityName}
                </span>
                <span className="ml-2 flex shrink-0 gap-1">
                  <Seat ok={g.hasMp} label="MP" />
                  <Seat ok={g.hasCouncil} label="CR" />
                  <Seat ok={g.hasCin} label="CIN" />
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <h3 className="text-sm font-bold text-brand-green-700">
            Three-tier interim representation protocol
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Activated when a community produces no qualified candidate after two cycles.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {INTERIM_TIERS.map((t) => (
              <div key={t.tier} className="rounded-lg border border-gray-100 p-4">
                <span className="text-xs font-bold text-brand-red">TIER {t.tier}</span>
                <p className="mt-1 text-sm font-bold text-brand-green-700">{t.name}</p>
                <p className="mt-1 text-xs text-gray-600">{t.note}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
