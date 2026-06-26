import Link from "next/link"
import { Mail, Download, Send } from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import MessageStatusActions from "./MessageStatusActions"
import { getContactMessages, getSubscribers } from "@/lib/data/admin"
import { formatDate } from "@/lib/utils"

const STATUS_TONE: Record<string, "amber" | "green" | "gray"> = {
  new: "amber",
  read: "green",
  archived: "gray",
}

export const metadata = { title: "Inbox" }

export default async function InboxPage() {
  const [messages, subscribers] = await Promise.all([
    getContactMessages(),
    getSubscribers(),
  ])

  return (
    <>
      <Link
        href="/dashboard/admin"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Back to Administration
      </Link>
      <DashboardHeading
        title="Inbox"
        subtitle="Contact enquiries and newsletter subscribers from the public site"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard label="Contact messages" value={messages.length} hint="Most recent first" />
        <StatCard
          label="Newsletter subscribers"
          value={subscribers.length}
          hint="Footer signups"
          accent="gold"
        />
      </div>

      {/* Contact messages */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-base font-semibold text-canopy">
            Contact messages
          </h3>
          {messages.length > 0 && (
            <a
              href="/dashboard/admin/inbox/messages"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-canopy hover:underline"
            >
              <Download size={14} /> Export CSV
            </a>
          )}
        </div>
        {messages.length === 0 ? (
          <Card>
            <p className="text-sm text-ink/55">
              No messages yet. New enquiries from the Contact page appear here.
            </p>
          </Card>
        ) : (
          <ul className="space-y-3">
            {messages.map((m) => (
              <li key={m.id}>
                <Card>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-canopy">{m.name}</p>
                      <a
                        href={`mailto:${m.email}`}
                        className="text-sm text-brand-blue hover:underline"
                      >
                        {m.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone={STATUS_TONE[m.status] ?? "gray"}>{m.status}</Badge>
                      {m.topic && <Badge tone="canopy">{m.topic}</Badge>}
                      <span className="text-xs text-ink/45">
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap border-t border-gray-100 pt-3 text-sm leading-relaxed text-ink/70">
                    {m.message}
                  </p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                    <a
                      href={`mailto:${m.email}?subject=Re: your message to Bekwai Youth Movement`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy hover:underline"
                    >
                      <Mail size={15} /> Reply
                    </a>
                    <MessageStatusActions id={m.id} status={m.status} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Subscribers */}
      <div className="mt-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-canopy">
            Newsletter subscribers
          </h3>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/inbox/broadcast"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-canopy hover:underline"
            >
              <Send size={14} /> Compose broadcast
            </Link>
            {subscribers.length > 0 && (
              <a
                href="/dashboard/admin/inbox/subscribers"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-canopy hover:underline"
              >
                <Download size={14} /> Export CSV
              </a>
            )}
          </div>
        </div>
        <Card>
          {subscribers.length === 0 ? (
            <p className="text-sm text-ink/55">
              No subscribers yet. Footer signups appear here.
            </p>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-ink/45">
                      <th className="py-2 pr-4 font-medium">Email</th>
                      <th className="py-2 pr-4 font-medium">Source</th>
                      <th className="py-2 pr-4 font-medium">Subscribed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers.map((s) => (
                      <tr key={s.id} className="border-b border-gray-100">
                        <td className="py-2.5 pr-4">
                          <a
                            href={`mailto:${s.email}`}
                            className="font-medium text-brand-blue hover:underline"
                          >
                            {s.email}
                          </a>
                        </td>
                        <td className="py-2.5 pr-4 text-ink/55">{s.source}</td>
                        <td className="py-2.5 pr-4 text-xs text-ink/55">
                          {formatDate(s.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <ul className="space-y-2 md:hidden">
                {subscribers.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-3 border-b border-gray-100 pb-2 last:border-0"
                  >
                    <a
                      href={`mailto:${s.email}`}
                      className="min-w-0 truncate text-sm font-medium text-brand-blue"
                    >
                      {s.email}
                    </a>
                    <span className="shrink-0 text-[11px] text-ink/45">
                      {formatDate(s.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>
    </>
  )
}
