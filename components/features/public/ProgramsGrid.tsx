import {
  Scale,
  GraduationCap,
  HeartPulse,
  Briefcase,
  Leaf,
  Database,
  Megaphone,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import Badge from "@/components/ui/Badge"
import { UNITS } from "@/constants/units"

const ICONS: Record<number, LucideIcon> = {
  1: Scale,
  2: GraduationCap,
  3: HeartPulse,
  4: Briefcase,
  5: Leaf,
  6: Database,
  7: Megaphone,
}

/** The 7 operational Units presented as BYM's programme areas. */
export default function ProgramsGrid() {
  return (
    <section className="section bg-paper">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Seven programme units, one shared agenda"
            description="Each unit carries a clear mandate, a portfolio officer, and a direct line to the UN Global Goals — turning youth energy into measurable community change."
            centered
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {UNITS.map((unit, i) => {
            const Icon = ICONS[unit.no] ?? Scale
            return (
              <Reveal key={unit.no} delay={(i % 3) * 0.07}>
                <div className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
                  <div className="flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-canopy-50 text-canopy">
                      <Icon size={20} />
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                      Unit {unit.no}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-canopy">
                    {unit.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                    {unit.mandate}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {unit.sdg.map((g) => (
                      <Badge key={g} tone="gold">
                        SDG {g}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
