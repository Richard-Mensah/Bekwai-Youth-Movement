import { TrendingUp, TrendingDown, Wallet, ArrowRight, ScrollText } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import Counter from "@/components/ui/Counter"
import { getFinancialSummary } from "@/lib/data/transparency"

/** Homepage finance trust band — totals from published budgets + a mini table. */
export default async function FinanceTransparencyBand() {
  const summary = await getFinancialSummary()
  if (summary.count === 0) return null

  const CARDS = [
    {
      icon: TrendingUp,
      label: "Total income published",
      value: summary.totalIncome,
      tone: "text-brand-green",
    },
    {
      icon: TrendingDown,
      label: "Total expenditure published",
      value: summary.totalExpenditure,
      tone: "text-canopy dark:text-paper",
    },
    {
      icon: Wallet,
      label: "Balance carried",
      value: summary.surplus,
      tone: summary.surplus >= 0 ? "text-brand-green" : "text-brand-red",
    },
  ]

  return (
    <section className="section">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Open by default"
            title="Every cedi, accounted for"
            description="We publish our budgets so the community can see exactly how resources are raised and spent. Trust is earned through transparency."
            centered
          />
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {CARDS.map(({ icon: Icon, label, value, tone }, i) => (
            <Reveal key={label} delay={(i % 3) * 0.07}>
              <div className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card dark:border-white/10 dark:bg-canopy-800">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                  <Icon size={22} />
                </span>
                <p className={`mt-4 font-display text-3xl font-semibold ${tone}`}>
                  <Counter to={Math.abs(value)} prefix="GHS " />
                </p>
                <p className="mt-1 text-sm font-medium text-ink/65 dark:text-paper/65">{label}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-8 overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card dark:border-white/10 dark:bg-canopy-800">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-canopy/10 text-xs uppercase tracking-wider text-ink/50 dark:border-white/10 dark:text-paper/50">
                <tr>
                  <th className="px-5 py-3 font-semibold">Period</th>
                  <th className="px-5 py-3 text-right font-semibold">Income (GHS)</th>
                  <th className="px-5 py-3 text-right font-semibold">Expenditure (GHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-canopy/5 dark:divide-white/5">
                {summary.recent.map((b) => (
                  <tr key={b.id}>
                    <td className="px-5 py-3 font-medium text-canopy dark:text-paper">{b.title}</td>
                    <td className="px-5 py-3 text-right text-ink/70 dark:text-paper/70">
                      {b.incomeGhs.toLocaleString()}
                    </td>
                    <td className="px-5 py-3 text-right text-ink/70 dark:text-paper/70">
                      {b.expenditureGhs.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 text-center">
          <a
            href="/transparency"
            className="inline-flex items-center gap-2 rounded-full bg-canopy px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
          >
            <ScrollText size={16} /> View our full transparency portal
            <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
