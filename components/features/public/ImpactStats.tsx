import Reveal from "@/components/ui/Reveal"
import Counter from "@/components/ui/Counter"
import { getSettings } from "@/lib/data/content"

/** Headline commitments, with count-up on scroll. Numbers come from Site Settings. */
export default async function ImpactStats() {
  const { stats } = await getSettings()
  const STATS = [
    { to: stats.communities, suffix: "", label: "Communities served", hint: "Sefwi Bekwai + 31 sub-communities" },
    { to: stats.cabinet, suffix: "", label: "Civic Cabinet portfolios", hint: "A full youth executive" },
    { to: stats.reps, suffix: "", label: "Representatives per community", hint: "MP · Council Rep · CIN Officer" },
    { to: stats.sdgs, suffix: "", label: "UN SDGs aligned", hint: "Mapped to the 2030 Agenda" },
    { to: stats.women, suffix: "%", label: "Minimum women's seats", hint: "Across every arm of governance" },
  ]

  return (
    <section className="border-y border-canopy/10 bg-paper dark:border-white/10 dark:bg-canopy-900">
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
              <p className="font-display text-4xl font-semibold text-canopy sm:text-5xl dark:text-paper">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-sm font-semibold text-ink/80 dark:text-paper/80">{s.label}</p>
              <p className="mt-0.5 text-xs text-ink/50 dark:text-paper/50">{s.hint}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
