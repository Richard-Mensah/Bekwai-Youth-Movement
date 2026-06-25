import Reveal from "@/components/ui/Reveal"
import Counter from "@/components/ui/Counter"
import { COMMUNITY_COUNT } from "@/constants/communities"

const STATS = [
  { to: COMMUNITY_COUNT, suffix: "", label: "Communities served", hint: "Sefwi Bekwai + 31 sub-communities" },
  { to: 19, suffix: "", label: "Civic Cabinet portfolios", hint: "A full youth executive" },
  { to: 3, suffix: "", label: "Representatives per community", hint: "MP · Council Rep · CIN Officer" },
  { to: 12, suffix: "", label: "UN SDGs aligned", hint: "Mapped to the 2030 Agenda" },
  { to: 40, suffix: "%", label: "Minimum women's seats", hint: "Across every arm of governance" },
]

/** Headline commitments, with count-up on scroll. */
export default function ImpactStats() {
  return (
    <section className="border-y border-canopy/10 bg-paper">
      <div className="container-content py-14">
        <Reveal className="text-center">
          <p className="eyebrow justify-center">
            <span className="h-px w-5 bg-gold-400" />
            Our commitment, by the numbers
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06} className="text-center">
              <p className="font-display text-4xl font-semibold text-canopy sm:text-5xl">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold text-ink/80">{s.label}</p>
              <p className="mt-0.5 text-xs text-ink/50">{s.hint}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
