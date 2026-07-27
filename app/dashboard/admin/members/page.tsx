import { Download, Hourglass, UserCheck, Users } from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import { getMembers } from "@/lib/data/admin"
import { emailEnabled } from "@/lib/email"
import { formatDate } from "@/lib/utils"
import MemberEmail from "./MemberEmail"
import MemberPublicToggle from "./MemberPublicToggle"
import MemberStatusActions from "./MemberStatusActions"

export const metadata = { title: "Members" }
export const dynamic = "force-dynamic"

export default async function MembersPage() {
  const members = await getMembers()
  const total = members.length
  const verified = members.filter((m) => m.status === "verified").length
  const pending = members.filter((m) => m.status === "pending").length

  return (
    <>
      <DashboardHeading
        backHref="/dashboard/admin"
        backLabel="Administration"
        title="Members directory"
        subtitle="Verify registrations, then export or email members directly"
        actions={
          <a
            href="/dashboard/admin/members/export"
            className="inline-flex items-center gap-2 rounded-full border border-canopy/25 bg-white px-4 py-2 text-sm font-semibold text-canopy transition-all hover:-translate-y-0.5 hover:bg-canopy-50 dark:border-white/15 dark:bg-transparent dark:text-paper dark:hover:bg-white/10"
          >
            <Download size={16} aria-hidden /> Export CSV
          </a>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total members" value={total} icon={Users} />
        <StatCard
          label="Verified"
          value={verified}
          accent="gold"
          icon={UserCheck}
          hint="Full dashboard access"
        />
        <StatCard
          label="Pending"
          value={pending}
          accent="red"
          icon={Hourglass}
          hint={pending > 0 ? "Awaiting your decision" : "Nothing waiting"}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <MemberEmail
          total={total}
          verified={verified}
          pending={pending}
          emailReady={emailEnabled()}
        />

        <div>
          <h3 className="mb-3 font-display text-base font-semibold text-canopy">
            All members
          </h3>
          {members.length === 0 ? (
            <Card>
              <p className="text-sm text-ink/55">
                No members yet. Once people register from the site, they appear
                here. (If you just applied migration 0014, refresh.)
              </p>
            </Card>
          ) : (
            <div className="surface overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-canopy/10 bg-paper/50 text-xs uppercase tracking-wider text-ink/50 dark:border-white/10 dark:bg-white/[0.03] dark:text-paper/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Community</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Wall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-canopy/5 dark:divide-white/5">
                  {members.map((m) => (
                    <tr
                      key={m.id}
                      className="align-middle transition-colors hover:bg-paper/60 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-4 py-3 font-medium text-canopy dark:text-paper">
                        {m.fullName || "—"}
                        {m.phone && (
                          <span className="block text-xs font-normal text-ink/45">
                            {m.phone}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {m.email ? (
                          <a
                            href={`mailto:${m.email}`}
                            className="text-canopy hover:underline"
                          >
                            {m.email}
                          </a>
                        ) : (
                          <span className="text-ink/40">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-ink/70">{m.communityName ?? "—"}</td>
                      <td className="px-4 py-3">
                        <MemberStatusActions
                          id={m.id}
                          name={m.fullName ?? ""}
                          status={m.status}
                        />
                      </td>
                      <td className="px-4 py-3 text-ink/55">{formatDate(m.createdAt)}</td>
                      <td className="px-4 py-3">
                        <MemberPublicToggle
                          id={m.id}
                          isPublic={m.isPublic}
                          disabled={m.status !== "verified"}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
