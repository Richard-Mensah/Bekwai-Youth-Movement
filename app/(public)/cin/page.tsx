import type { Metadata } from "next"
import { HeartPulse, GraduationCap, Briefcase, Building2, Droplets, ShieldAlert } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Card from "@/components/ui/Card"
import { COMMUNITY_COUNT } from "@/constants/communities"

export const metadata: Metadata = {
  title: "Community Intelligence Network",
  description:
    "The Community Intelligence Network (CIN) — 32 officers gathering monthly evidence on health, education, employment, sanitation, and infrastructure to drive data-led governance.",
}

const CATEGORIES = [
  { icon: Briefcase, label: "Employment", desc: "Joblessness, apprenticeships, enterprise gaps." },
  { icon: HeartPulse, label: "Health", desc: "Clinics, disease outbreaks, mental health." },
  { icon: Droplets, label: "Sanitation", desc: "Water, waste, hygiene, toilet facilities." },
  { icon: GraduationCap, label: "Education", desc: "School access, literacy, dropout rates." },
  { icon: Building2, label: "Infrastructure", desc: "Roads, electricity, public facilities." },
  { icon: ShieldAlert, label: "Grievances", desc: "Community concerns and urgent issues." },
]

const FLOW = [
  ["Collect", "Officers gather standardised monthly data in their community."],
  ["Verify", "Data Quality Officer audits every submission for accuracy."],
  ["Share with chief", "Sub-chiefs are the first to know about local issues."],
  ["Analyse", "The Director compiles aggregate community reports & scores."],
  ["Act", "Findings feed policy, projects, and Parliament debates."],
]

export default function CinPage() {
  return (
    <>
      <PageHeader
        eyebrow="The Intelligence Arm"
        title="Community Intelligence Network"
        description={`The grassroots evidence base of BYM — ${COMMUNITY_COUNT} Community Intelligence Officers, one per community, reporting monthly.`}
      />

      <section className="container-content py-16">
        <SectionHeading
          eyebrow="What we measure"
          title="Six pillars of community evidence"
          centered
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map(({ icon: Icon, label, desc }) => (
            <Card key={label}>
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-blue-50 text-brand-blue">
                <Icon size={22} />
              </div>
              <h3 className="mt-4 text-base font-bold text-canopy">{label}</h3>
              <p className="mt-1 text-sm text-ink/65">{desc}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-paper">
        <div className="container-content py-16">
          <SectionHeading
            eyebrow="From data to decisions"
            title="The monthly intelligence cycle"
          />
          <div className="mt-10 grid gap-3 md:grid-cols-5">
            {FLOW.map(([title, desc], i) => (
              <div key={title} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                <span className="text-xs font-bold text-brand-red">STEP {i + 1}</span>
                <p className="mt-1 text-sm font-bold text-canopy">{title}</p>
                <p className="mt-1 text-xs text-ink/65">{desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm text-ink/55">
            Live community heatmaps, trend charts, and development scores arrive with
            the CIN module (Phase 2). All published data is anonymised and aggregate,
            in line with Ghana&apos;s Data Protection Act, 2012.
          </p>
        </div>
      </section>
    </>
  )
}
