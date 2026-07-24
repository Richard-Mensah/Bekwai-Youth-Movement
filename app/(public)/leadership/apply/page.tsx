import type { Metadata } from "next"
import { Users, ShieldCheck, CalendarClock } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import Reveal from "@/components/ui/Reveal"
import LeadershipApplicationForm from "@/components/features/public/LeadershipApplicationForm"

export const metadata: Metadata = {
  title: "Apply for a Leadership Role",
  description:
    "Enrolment is open. Apply to serve in the Bekwai Youth Movement, from Director-General to community-level seats. Open to all qualified young people across the 32 communities.",
}

const NOTES = [
  {
    icon: Users,
    title: "Open to all who qualify",
    body: "Every office, from Director-General to the Cabinet, Youth Parliament, CIN, and community seats, is open for application.",
  },
  {
    icon: ShieldCheck,
    title: "Merit & values first",
    body: "Selection follows the 5-step nomination & vetting process. BYM is non-partisan; leaders serve the community, not any party.",
  },
  {
    icon: CalendarClock,
    title: "What happens next",
    body: "The Secretariat reviews every application, then invites shortlisted applicants through residency check, vetting, and interview.",
  },
]

export default function LeadershipApplyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Enrolment is open"
        title="Apply to lead the movement"
        description="The Bekwai Youth Movement is calling on every qualified young person to step forward, from Director-General to the last role. Complete the form below to put your name forward."
      />

      <section className="section">
        <div className="container-content grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Info column */}
          <Reveal className="space-y-4">
            {NOTES.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canopy-50 text-canopy">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-canopy">{title}</h3>
                  <p className="mt-0.5 text-sm text-ink/65">{body}</p>
                </div>
              </div>
            ))}
          </Reveal>

          {/* Form column */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-canopy/10 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-canopy">
                Leadership application
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                All fields marked without “optional” are required. Your details go
                straight to the Secretariat.
              </p>
              <div className="mt-6">
                <LeadershipApplicationForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
