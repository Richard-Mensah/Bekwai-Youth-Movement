import { TrendingUp, TrendingDown, Wallet, ArrowRight, ScrollText, ShieldCheck } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import Counter from "@/components/ui/Counter"
import { getFinancialSummary } from "@/lib/data/transparency"

/** Decorative "money trend" visual — a rising cedi chart, inline & crisp. */
function MoneyTrend() {
  const pts = [
    [20, 168],
    [78, 150],
    [136, 158],
    [194, 118],
    [252, 104],
    [310, 66],
    [368, 44],
  ]
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]} ${p[1]}`).join(" ")
  const area = `${line} L368 196 L20 196 Z`
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-canopy p-7 text-white canopy-texture">
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-400/15 blur-2xl" />
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400 font-display text-2xl font-bold text-canopy">
            ₵
          </span>
          <div>
            <p className="text-sm font-semibold text-white">Community funds</p>
            <p className="text-xs text-white/60">Raised &amp; spent, in the open</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold text-gold-200 ring-1 ring-inset ring-white/15">
          <ShieldCheck size={13} /> Published
        </span>
      </div>

      <svg
        viewBox="0 0 388 210"
        className="mt-6 w-full"
        role="img"
        aria-label="Upward trend of published community finances"
      >
        <defs>
          <linearGradient id="ftFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a24b" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#c9a24b" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[66, 116, 166].map((y) => (
          <line key={y} x1="20" y1={y} x2="368" y2={y} stroke="#ffffff" strokeOpacity="0.08" />
        ))}
        <path d={area} fill="url(#ftFill)" />
        <path d={line} fill="none" stroke="#e7c977" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map((p) => (
          <circle key={p[0]} cx={p[0]} cy={p[1]} r="4" fill="#14342b" stroke="#e7c977" strokeWidth="2.5" />
        ))}
      </svg>
    </div>
  )
}

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

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_1.05fr]">
          <Reveal>
            <MoneyTrend />
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {CARDS.map(({ icon: Icon, label, value, tone }, i) => (
              <Reveal key={label} delay={(i % 3) * 0.07}>
                <div className="flex h-full items-center gap-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card dark:border-white/10 dark:bg-canopy-800 lg:p-6">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                    <Icon size={22} />
                  </span>
                  <div>
                    <p className={`font-display text-2xl font-semibold lg:text-3xl ${tone}`}>
                      <Counter to={Math.abs(value)} prefix="GHS " />
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-ink/65 dark:text-paper/65">
                      {label}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
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
