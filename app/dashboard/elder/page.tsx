import { getEndorsements, getTacEngagements } from "@/lib/data/governance"
import { humanize, formatDate } from "@/lib/utils"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import EndorsementActions from "@/components/features/governance/EndorsementActions"
import TacEngagementForm from "@/components/features/governance/TacEngagementForm"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"

export default async function ElderDashboard() {
  const [endorsements, engagements] = await Promise.all([
    getEndorsements(),
    getTacEngagements(),
  ])
  const pending = endorsements.filter((e) => e.decision === "pending")

  return (
    <>
      <DashboardHeading
        title="Traditional Advisory Council"
        subtitle="Read-only oversight, endorsements, and engagement log"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending endorsements" value={pending.length} accent="red" />
        <StatCard label="Communities" value={32} hint="Under advisory" accent="blue" />
        <StatCard label="Engagements logged" value={engagements.length} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-bold text-canopy">Endorsement requests</h3>
          {pending.length === 0 ? (
            <p className="mt-3 text-sm text-ink/55">No pending endorsements.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {pending.map((e) => (
                <li key={e.id} className="rounded-lg border border-gray-100 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wider text-brand-red">
                    {humanize(e.subjectType)}
                  </p>
                  <p className="mt-0.5 text-sm font-medium text-gray-700">{e.subjectLabel}</p>
                  <div className="mt-2">
                    <EndorsementActions id={e.id} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h3 className="text-sm font-bold text-canopy">Log an engagement</h3>
          <p className="mt-1 text-xs text-ink/55">
            Courtesy calls, sensitisation, durbar accountability, dispute mediation.
          </p>
          <div className="mt-4">
            <TacEngagementForm />
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <h3 className="text-sm font-bold text-canopy">Recent engagements</h3>
          <ul className="mt-3 space-y-2">
            {engagements.map((g) => (
              <li key={g.id} className="flex items-start justify-between gap-3 rounded-lg border border-gray-100 p-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">{humanize(g.kind)}</p>
                  <p className="text-xs text-ink/55">{g.communityName}{g.summary ? ` — ${g.summary}` : ""}</p>
                </div>
                <span className="shrink-0 text-xs text-ink/45">{formatDate(g.occurredOn)}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h3 className="text-sm font-bold text-canopy">Governance visibility</h3>
          <p className="mt-2 text-sm text-ink/65">
            As a Council member you can view leadership, projects, and published
            reports across the Movement.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button href="/leadership" size="sm" variant="outline">Leadership</Button>
            <Button href="/transparency" size="sm" variant="outline">Transparency</Button>
            <Button href="/projects" size="sm" variant="outline">Projects</Button>
          </div>
        </Card>
      </div>
    </>
  )
}
