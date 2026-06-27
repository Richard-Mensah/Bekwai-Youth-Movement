import Link from "next/link"
import { Download } from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { getMembers } from "@/lib/data/admin"
import { emailEnabled } from "@/lib/email"
import { formatDate } from "@/lib/utils"
import MemberEmail from "./MemberEmail"
import MemberPublicToggle from "./MemberPublicToggle"

export const metadata = { title: "Members" }
export const dynamic = "force-dynamic"

const STATUS_TONE: Record<string, "green" | "amber" | "red" | "gray"> = {
  verified: "green",
  pending: "amber",
  rejected: "red",
}

export default async function MembersPage() {
  const members = await getMembers()
  const total = members.length
  const verified = members.filter((m) => m.status === "verified").length
  const pending = members.filter((m) => m.status === "pending").length

  return (
    <>
      <Link
        href="/dashboard/admin"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Administration
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <DashboardHeading
          title="Members directory"
          subtitle="Everyone who registered to join — export or email them directly"
        />
        <a
          href="/dashboard/admin/members/export"
          className="inline-flex items-center gap-2 rounded-full border border-canopy/25 bg-white px-4 py-2 text-sm font-semibold text-canopy hover:bg-canopy-50"
        >
          <Download size={16} /> Export CSV
        </a>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total members" value={total} />
        <StatCard label="Verified" value={verified} accent="gold" />
        <StatCard label="Pending" value={pending} accent="red" />
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
            <div className="overflow-x-auto rounded-2xl border border-canopy/10 bg-white shadow-card">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-canopy/10 text-xs uppercase tracking-wider text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Community</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Joined</th>
                    <th className="px-4 py-3 font-semibold">Wall</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-canopy/5">
                  {members.map((m) => (
                    <tr key={m.id} className="align-middle">
                      <td className="px-4 py-3 font-medium text-canopy">
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
                        <Badge tone={STATUS_TONE[m.status] ?? "gray"}>{m.status}</Badge>
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
