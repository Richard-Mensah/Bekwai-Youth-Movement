import { CABINET_POSITIONS } from "@/constants/cabinet"
import type { CabinetPosition } from "@/types"

function PositionCard({ p, accent }: { p: CabinetPosition; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? "rounded-xl border border-canopy bg-canopy px-4 py-3 text-center text-white shadow-card"
          : "rounded-xl border border-canopy/10 bg-white px-4 py-3 text-center shadow-card"
      }
    >
      <p className={accent ? "text-sm font-bold" : "text-sm font-semibold text-canopy"}>
        {p.title}
      </p>
      {p.ukEquivalent && (
        <p className={accent ? "text-[11px] text-gold-300" : "text-[11px] text-ink/45"}>
          {p.ukEquivalent}
        </p>
      )}
    </div>
  )
}

const byTitle = (t: string) => CABINET_POSITIONS.find((p) => p.title === t)!
const directToDG = CABINET_POSITIONS.filter(
  (p) => p.reportsTo === "Director-General (DG)"
)
const secretaries = CABINET_POSITIONS.filter(
  (p) => p.reportsTo === "1st Deputy Director-General"
)
const otherDeputies = CABINET_POSITIONS.filter((p) =>
  ["Secretary-General", "Chief Financial Officer", "Civic Organiser", "Home Secretary"].includes(
    p.reportsTo ?? ""
  )
)

/** Renders the 19-member Cabinet as a tiered org chart from the DG down. */
export default function OrgChart() {
  return (
    <div className="space-y-8">
      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gold-600">
          Supreme authority
        </p>
        <div className="mx-auto max-w-xs rounded-xl border border-dashed border-canopy/25 bg-paper px-4 py-2 text-center text-sm text-ink/60">
          BYM Founding Leadership
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-brand-red">
          Head of the Assembly
        </p>
        <div className="mx-auto max-w-xs">
          <PositionCard p={byTitle("Director-General (DG)")} accent />
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-ink/45">
          Reports to the Director-General
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {directToDG.map((p) => (
            <PositionCard key={p.no} p={p} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-ink/45">
          Portfolio Secretaries & Officers
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {secretaries.map((p) => (
            <PositionCard key={p.no} p={p} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-ink/45">
          Deputies & support
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {otherDeputies.map((p) => (
            <PositionCard key={p.no} p={p} />
          ))}
        </div>
      </div>
    </div>
  )
}
