import { ShieldCheck, Landmark, ScrollText, HandHeart } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Strictly non-political",
    body: "No member uses their BYM position to advance any party or candidate. Service to community comes before self.",
  },
  {
    icon: Landmark,
    title: "Rooted in traditional authority",
    body: "A Traditional Advisory Council — the Paramount Chief, sub-chiefs, and Queenmother — guards our values and legitimacy.",
  },
  {
    icon: ScrollText,
    title: "Transparent and accountable",
    body: "Budgets, community reports, and project outcomes are published in quarterly and annual reports for everyone to see.",
  },
  {
    icon: HandHeart,
    title: "Inclusive by design",
    body: "At least 40% of every arm is reserved for women, and no community is treated as less important than another.",
  },
]

/** Why BYM is trustworthy — principles & traditional authority. */
export default function CredibilityBand() {
  return (
    <section className="section bg-paper dark:bg-canopy-900">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Why we're trusted"
            title="Built on principle, accountable by design"
            description="Credibility isn't claimed — it's structured into how the movement operates."
            centered
          />
        </Reveal>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={(i % 4) * 0.07}>
              <div className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <Icon size={22} />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-canopy">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65 dark:text-paper/65">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
