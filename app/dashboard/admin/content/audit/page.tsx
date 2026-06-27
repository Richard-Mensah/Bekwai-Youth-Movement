import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { getAuditLog } from "@/lib/data/content"

export const metadata = { title: "Activity log" }

const ACTION_TONE: Record<
  string,
  "green" | "red" | "amber" | "canopy" | "gray" | "gold"
> = {
  create: "green",
  update: "canopy",
  delete: "red",
  publish: "green",
  unpublish: "amber",
  import: "gold",
  send: "canopy",
}

function ago(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default async function AuditPage() {
  const entries = await getAuditLog()
  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <DashboardHeading
        title="Activity log"
        subtitle="Recent content changes, who made them and when"
      />

      {entries.length === 0 ? (
        <Card>
          <p className="text-sm text-ink/55">No activity recorded yet.</p>
        </Card>
      ) : (
        <Card>
          <ul className="divide-y divide-gray-100">
            {entries.map((e) => (
              <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <div className="flex min-w-0 items-center gap-2">
                  <Badge tone={ACTION_TONE[e.action] ?? "gray"}>{e.action}</Badge>
                  <span className="text-sm text-ink/75">
                    <span className="font-medium capitalize text-canopy">{e.entity}</span>
                    {e.summary ? ` — ${e.summary}` : ""}
                  </span>
                </div>
                <span className="text-xs text-ink/45">
                  {e.actor} · {ago(e.createdAt)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  )
}
