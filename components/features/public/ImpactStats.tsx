import StatCard from "@/components/ui/StatCard"
import { COMMUNITY_COUNT } from "@/constants/communities"

const STATS = [
  { label: "Communities served", value: COMMUNITY_COUNT, hint: "Sefwi Bekwai + 31 sub-communities" },
  { label: "Cabinet portfolios", value: 19, hint: "Executive Secretaries & officers", accent: "red" as const },
  { label: "SDGs aligned", value: 12, hint: "UN Agenda 2030", accent: "blue" as const },
  { label: "Representatives / community", value: 3, hint: "MP · Council Rep · CIN Officer" },
]

export default function ImpactStats() {
  return (
    <section className="bg-paper">
      <div className="container-content py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s) => (
            <StatCard
              key={s.label}
              label={s.label}
              value={s.value}
              hint={s.hint}
              accent={s.accent ?? "green"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
