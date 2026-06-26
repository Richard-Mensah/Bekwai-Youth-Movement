import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import BroadcastForm from "./BroadcastForm"
import { getSubscribers, getBroadcasts } from "@/lib/data/admin"
import { emailEnabled } from "@/lib/email"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "Newsletter broadcast" }

export default async function BroadcastPage() {
  const [subscribers, broadcasts] = await Promise.all([
    getSubscribers(),
    getBroadcasts(),
  ])

  return (
    <>
      <Link
        href="/dashboard/admin/inbox"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Inbox
      </Link>
      <DashboardHeading
        title="Newsletter broadcast"
        subtitle="Send an update to everyone who subscribed from the site"
      />

      <BroadcastForm subscriberCount={subscribers.length} emailReady={emailEnabled()} />

      <div className="mt-8">
        <h3 className="mb-3 font-display text-base font-semibold text-canopy">
          Sent & drafts
        </h3>
        {broadcasts.length === 0 ? (
          <Card>
            <p className="text-sm text-ink/55">No broadcasts yet.</p>
          </Card>
        ) : (
          <div className="space-y-2">
            {broadcasts.map((b) => (
              <Card key={b.id}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-canopy">{b.subject}</p>
                    <p className="text-xs text-ink/50">
                      {b.recipientCount} recipient{b.recipientCount === 1 ? "" : "s"} ·{" "}
                      {formatDate(b.sentAt ?? b.createdAt)}
                    </p>
                  </div>
                  <Badge tone={b.status === "sent" ? "green" : "amber"}>{b.status}</Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
