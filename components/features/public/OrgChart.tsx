import { CABINET_POSITIONS } from "@/constants/cabinet"
import type { CabinetPosition } from "@/types"

function PositionCard({ p, accent }: { p: CabinetPosition; accent?: boolean }) {
  return (
    <div
      className={
        accent
          ? "rounded-lg border-2 border-brand-green bg-brand-green text-white px-4 py-3 text-center shadow"
          : "rounded-lg border border-gray-200 bg-white px-4 py-3 text-center shadow-sm"
      }
    >
      <p className={accent ? "text-sm font-bold" : "text-sm font-semibold text-brand-green-700"}>
        {p.title}
      </p>
      {p.ukEquivalent && (
        <p className={accent ? "text-[11px] text-brand-blue-100" : "text-[11px] text-gray-500"}>
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
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
          Supreme authority
        </p>
        <div className="mx-auto max-w-xs rounded-lg border border-dashed border-gray-300 bg-paper px-4 py-2 text-center text-sm text-gray-600">
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
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
          Reports to the Director-General
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {directToDG.map((p) => (
            <PositionCard key={p.no} p={p} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
          Portfolio Secretaries & Officers
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {secretaries.map((p) => (
            <PositionCard key={p.no} p={p} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
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
