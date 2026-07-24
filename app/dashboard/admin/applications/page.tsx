import Link from "next/link"
import { Mail, Download } from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import ApplicationStatusActions from "./ApplicationStatusActions"
import { getLeadershipApplications } from "@/lib/data/admin"
import { formatDate } from "@/lib/utils"

const STATUS_TONE: Record<string, "amber" | "green" | "blue" | "red" | "gray"> = {
  new: "amber",
  shortlisted: "blue",
  interview: "blue",
  accepted: "green",
  rejected: "red",
  archived: "gray",
}

export const metadata = { title: "Leadership Applications" }

function Field({ label, value }: { label: string; value: string | null }) {
  if (!value) return null
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-wider text-ink/40">{label}</dt>
      <dd className="whitespace-pre-wrap text-sm text-ink/75">{value}</dd>
    </div>
  )
}

export default async function ApplicationsPage() {
  const apps = await getLeadershipApplications()
  const newCount = apps.filter((a) => a.status === "new").length
  const shortlisted = apps.filter(
    (a) => a.status === "shortlisted" || a.status === "interview"
  ).length

  return (
    <>
      <Link
        href="/dashboard/admin"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Back to Administration
      </Link>
      <DashboardHeading
        title="Leadership Applications"
        subtitle="Enrolment submissions from the public 'Apply for a role' form"
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total applications" value={apps.length} hint="Most recent first" />
        <StatCard label="New / unreviewed" value={newCount} hint="Awaiting review" accent="red" />
        <StatCard label="In pipeline" value={shortlisted} hint="Shortlisted or interview" accent="gold" />
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-canopy">
            Applications
          </h3>
          {apps.length > 0 && (
            <a
              href="/dashboard/admin/applications/export"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-canopy hover:underline"
            >
              <Download size={14} /> Export CSV
            </a>
          )}
        </div>

        {apps.length === 0 ? (
          <Card>
            <p className="text-sm text-ink/55">
              No applications yet. Submissions from the{" "}
              <Link href="/leadership/apply" className="text-brand-blue hover:underline">
                Apply for a role
              </Link>{" "}
              form appear here.
            </p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {apps.map((a) => (
              <li key={a.id}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-canopy">{a.fullName}</p>
                      <a
                        href={`mailto:${a.email}`}
                        className="text-sm text-brand-blue hover:underline"
                      >
                        {a.email}
                      </a>
                      {a.phone && (
                        <span className="ml-3 text-sm text-ink/55">{a.phone}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={STATUS_TONE[a.status] ?? "gray"}>{a.status}</Badge>
                      <span className="text-xs text-ink/45">
                        {formatDate(a.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
                    <Badge tone="canopy">{a.roleApplied}</Badge>
                    {a.altRole && (
                      <span className="text-xs text-ink/50">2nd choice: {a.altRole}</span>
                    )}
                  </div>

                  <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                    <Field label="Community" value={a.community} />
                    <Field label="Age / Gender" value={[a.age, a.gender].filter(Boolean).join(" · ") || null} />
                    <Field label="Occupation" value={a.occupation} />
                    <Field label="Availability" value={a.availability} />
                    <Field label="Qualifications" value={a.qualifications} />
                    <Field label="Experience" value={a.experience} />
                    <Field
                      label="Referee"
                      value={
                        a.refereeName
                          ? `${a.refereeName}${a.refereeContact ? ` — ${a.refereeContact}` : ""}`
                          : null
                      }
                    />
                  </dl>

                  <div className="mt-3">
                    <dt className="text-[11px] uppercase tracking-wider text-ink/40">
                      Motivation
                    </dt>
                    <p className="mt-0.5 whitespace-pre-wrap text-sm leading-relaxed text-ink/70">
                      {a.motivation}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <a
                      href={`mailto:${a.email}?subject=Your BYM leadership application — ${a.roleApplied}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy hover:underline"
                    >
                      <Mail size={15} /> Reply
                    </a>
                    <ApplicationStatusActions id={a.id} status={a.status} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
