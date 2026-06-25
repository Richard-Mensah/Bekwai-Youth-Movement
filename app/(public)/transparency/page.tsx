import type { Metadata } from "next"
import { FileText, Wallet, BarChart3, CalendarCheck } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Card from "@/components/ui/Card"
import EmptyState from "@/components/ui/EmptyState"

export const metadata: Metadata = {
  title: "Transparency Portal",
  description:
    "Public access to BYM's approved projects, published budgets, community scorecards, and annual performance and SDG reports — accountability by design.",
}

const ITEMS = [
  { icon: Wallet, title: "Published Budgets", desc: "Quarterly income and expenditure, signed off by the CFO and DG." },
  { icon: BarChart3, title: "Community Scorecards", desc: "Development indicators and rankings across all 32 communities." },
  { icon: FileText, title: "Public Reports", desc: "State of the Community Report and committee findings." },
  { icon: CalendarCheck, title: "Annual & SDG Reports", desc: "Yearly performance against the 12 aligned SDGs." },
]

export default function TransparencyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Accountability"
        title="Transparency Portal"
        description="BYM publishes its finances, community data, and project outcomes openly. All members and stakeholders can hold the Assembly to account."
      />

      <section className="container-content py-16">
        <SectionHeading eyebrow="What we publish" title="Open by default" centered />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-green-50 text-brand-green">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-brand-green-700">{title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <EmptyState
            title="Published records appear here"
            description="The Transparency Portal goes live with the relevant modules. Budgets, scorecards, and reports will be downloadable here as they are published."
            phase="Roadmap Phase 5"
          />
        </div>
      </section>
    </>
  )
}
