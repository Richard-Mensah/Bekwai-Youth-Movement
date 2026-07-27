"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Columns3,
  Download,
  Loader2,
  Rows3,
  Search,
  Star,
  X,
} from "lucide-react"
import Badge from "@/components/ui/Badge"
import { ARM_META } from "@/constants/offices"
import type { RoleArm } from "@/constants/offices"
import {
  ADMIN_PIPELINE,
  CLOSED_STATUSES,
  statusMeta,
  VETTING_LABEL,
} from "@/constants/applications"
import type { LeadershipApplication } from "@/lib/data/admin"
import { setApplicationStatus } from "./actions"
import { ARM_STYLE } from "@/components/features/apply/OfficeIcon"
import { formatDate, cn } from "@/lib/utils"

type Props = { applications: LeadershipApplication[] }

const ARMS: (RoleArm | "all")[] = ["all", "cabinet", "parliament", "cin", "community"]

export default function ApplicationsConsole({ applications }: Props) {
  const [query, setQuery] = useState("")
  const [arm, setArm] = useState<RoleArm | "all">("all")
  const [status, setStatus] = useState<string>("all")
  const [view, setView] = useState<"board" | "table">("board")
  const [busy, setBusy] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return applications.filter((a) => {
      if (arm !== "all" && a.roleArm !== arm) return false
      if (status !== "all" && a.status !== status) return false
      if (!q) return true
      return (
        a.fullName.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        (a.membershipId ?? "").toLowerCase().includes(q) ||
        (a.community ?? "").toLowerCase().includes(q) ||
        a.roleApplied.toLowerCase().includes(q)
      )
    })
  }, [applications, query, arm, status])

  const columns = useMemo(() => {
    const map = new Map<string, LeadershipApplication[]>()
    for (const s of ADMIN_PIPELINE) map.set(s, [])
    for (const a of results) {
      if (map.has(a.status)) map.get(a.status)!.push(a)
    }
    return map
  }, [results])

  const closedCount = results.filter((a) =>
    CLOSED_STATUSES.includes(a.status as never)
  ).length

  function move(id: string, next: string) {
    setBusy(id)
    start(async () => {
      await setApplicationStatus(id, next)
      router.refresh()
      setBusy(null)
    })
  }

  const filtered = query.trim() !== "" || arm !== "all" || status !== "all"

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/35 dark:text-paper/35"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, BYM ID, community or office…"
            aria-label="Search applications"
            className="w-full rounded-full border border-canopy/15 bg-white py-2.5 pl-10 pr-4 text-sm shadow-sm placeholder:text-ink/35 focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-800 dark:text-paper"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="status-filter" className="sr-only">
            Filter by stage
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-full border border-canopy/15 bg-white px-4 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-800 dark:text-paper"
          >
            <option value="all">All stages</option>
            {[...ADMIN_PIPELINE, ...CLOSED_STATUSES].map((s) => (
              <option key={s} value={s}>
                {statusMeta(s).label}
              </option>
            ))}
          </select>

          <div className="inline-flex rounded-full border border-canopy/15 bg-white p-0.5 dark:border-white/10 dark:bg-canopy-800">
            <ViewButton
              active={view === "board"}
              onClick={() => setView("board")}
              icon={Columns3}
              label="Board"
            />
            <ViewButton
              active={view === "table"}
              onClick={() => setView("table")}
              icon={Rows3}
              label="Table"
            />
          </div>

          {/* A route handler streaming a CSV — a plain anchor is what triggers
              the download; next/link would client-navigate instead. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/dashboard/admin/applications/export"
            download
            className="inline-flex items-center gap-1.5 rounded-full border border-canopy/15 bg-white px-4 py-2.5 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50 dark:border-white/10 dark:bg-canopy-800 dark:text-paper dark:hover:bg-white/10"
          >
            <Download size={14} /> CSV
          </a>
        </div>
      </div>

      {/* Arm pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {ARMS.map((a) => (
          <button
            key={a}
            type="button"
            onClick={() => setArm(a)}
            aria-pressed={arm === a}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors",
              arm === a
                ? "bg-canopy text-white ring-canopy"
                : a === "all"
                  ? "bg-white text-ink/60 ring-canopy/15 hover:text-canopy dark:bg-canopy-800 dark:text-paper/60 dark:ring-white/10"
                  : ARM_STYLE[a].chip
            )}
          >
            {a === "all" ? "All arms" : ARM_META[a].short}
            <span className="tabular-nums opacity-60">
              {a === "all"
                ? applications.length
                : applications.filter((x) => x.roleArm === a).length}
            </span>
          </button>
        ))}
        {filtered && (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              setArm("all")
              setStatus("all")
            }}
            className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/50 hover:bg-canopy/5 hover:text-canopy dark:text-paper/50 dark:hover:bg-white/5"
          >
            <X size={13} /> Clear
          </button>
        )}
        <span className="ml-auto text-xs tabular-nums text-ink/45 dark:text-paper/45">
          Showing {results.length} of {applications.length}
        </span>
      </div>

      {results.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-canopy/20 bg-white/60 px-6 py-14 text-center dark:border-white/15 dark:bg-canopy-800/50">
          <p className="font-display text-base font-semibold text-canopy dark:text-paper">
            Nothing matches those filters
          </p>
          <p className="mt-1 text-sm text-ink/55 dark:text-paper/55">
            {applications.length === 0
              ? "No applications have been submitted yet."
              : "Try clearing the search or picking a different stage."}
          </p>
        </div>
      ) : view === "board" ? (
        <div className="mt-6 -mx-1 overflow-x-auto px-1 pb-3">
          <div className="flex min-w-max gap-4">
            {ADMIN_PIPELINE.map((stage) => {
              const list = columns.get(stage) ?? []
              return (
                <section key={stage} className="w-[290px] shrink-0">
                  <header className="flex items-center justify-between gap-2 rounded-t-xl border border-b-0 border-canopy/10 bg-white px-3.5 py-2.5 dark:border-white/10 dark:bg-canopy-800">
                    <h3 className="text-sm font-semibold text-canopy dark:text-paper">
                      {statusMeta(stage).label}
                    </h3>
                    <span className="rounded-full bg-canopy-50 px-2 py-0.5 text-[11px] font-bold tabular-nums text-canopy dark:bg-white/10 dark:text-paper">
                      {list.length}
                    </span>
                  </header>
                  <div className="min-h-[120px] space-y-2.5 rounded-b-xl border border-canopy/10 bg-paper/60 p-2.5 dark:border-white/10 dark:bg-white/5">
                    {list.length === 0 && (
                      <p className="px-1 py-6 text-center text-xs text-ink/35 dark:text-paper/35">
                        Nothing here
                      </p>
                    )}
                    {list.map((a) => (
                      <BoardCard
                        key={a.id}
                        app={a}
                        busy={busy === a.id && pending}
                        onMove={(s) => move(a.id, s)}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      ) : (
        <TableView
          applications={results}
          busyId={busy}
          pending={pending}
          onMove={move}
        />
      )}

      {closedCount > 0 && status === "all" && view === "board" && (
        <p className="mt-4 text-xs text-ink/45 dark:text-paper/45">
          {closedCount} closed{" "}
          {closedCount === 1 ? "application is" : "applications are"} hidden from
          the board — filter by stage to see them.
        </p>
      )}
    </div>
  )
}

function ViewButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ElementType
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold transition-colors",
        active
          ? "bg-canopy text-white"
          : "text-ink/55 hover:text-canopy dark:text-paper/55 dark:hover:text-paper"
      )}
    >
      <Icon size={14} /> {label}
    </button>
  )
}

function StageSelect({
  value,
  busy,
  onChange,
  className,
}: {
  value: string
  busy: boolean
  onChange: (s: string) => void
  className?: string
}) {
  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <select
        value={value}
        disabled={busy}
        aria-label="Move to stage"
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-canopy/20 bg-white py-1.5 pl-2 pr-7 text-xs font-semibold text-canopy focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy disabled:opacity-50 dark:border-white/10 dark:bg-canopy-700 dark:text-paper"
      >
        {[...ADMIN_PIPELINE, ...CLOSED_STATUSES].map((s) => (
          <option key={s} value={s}>
            {statusMeta(s).label}
          </option>
        ))}
      </select>
      {busy && (
        <Loader2
          size={12}
          className="pointer-events-none absolute right-2 animate-spin text-canopy dark:text-paper"
        />
      )}
    </span>
  )
}

function BoardCard({
  app,
  busy,
  onMove,
}: {
  app: LeadershipApplication
  busy: boolean
  onMove: (s: string) => void
}) {
  const style = app.roleArm
    ? ARM_STYLE[app.roleArm as RoleArm] ?? ARM_STYLE.cabinet
    : ARM_STYLE.cabinet

  return (
    <article className="rounded-xl border border-canopy/10 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-card dark:border-white/10 dark:bg-canopy-800">
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/dashboard/admin/applications/${app.id}`}
          className="min-w-0 font-semibold text-canopy hover:underline dark:text-paper"
        >
          <span className="block truncate text-sm">{app.fullName}</span>
        </Link>
        {app.score != null && (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-gold-50 px-1.5 py-0.5 text-[11px] font-bold text-gold-700 dark:bg-gold-400/15 dark:text-gold-200">
            <Star size={10} className="fill-current" />
            {app.score}
          </span>
        )}
      </div>

      <p className="mt-1.5 flex items-center gap-1.5">
        <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", style.dot)} />
        <span className="truncate text-xs text-ink/65 dark:text-paper/60">
          {app.roleApplied}
        </span>
      </p>

      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-ink/45 dark:text-paper/45">
        {app.membershipId && <span className="font-mono">{app.membershipId}</span>}
        {app.community && <span>{app.community}</span>}
        <span>{formatDate(app.submittedAt ?? app.createdAt)}</span>
      </p>

      <StageSelect
        value={app.status}
        busy={busy}
        onChange={onMove}
        className="mt-3 w-full"
      />
    </article>
  )
}

function TableView({
  applications,
  busyId,
  pending,
  onMove,
}: {
  applications: LeadershipApplication[]
  busyId: string | null
  pending: boolean
  onMove: (id: string, s: string) => void
}) {
  return (
    <div className="mt-6 overflow-x-auto rounded-2xl border border-canopy/10 bg-white shadow-card dark:border-white/10 dark:bg-canopy-800">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-canopy/10 text-[11px] uppercase tracking-wider text-ink/45 dark:border-white/10 dark:text-paper/45">
          <tr>
            <th className="px-4 py-3 font-medium">Applicant</th>
            <th className="px-4 py-3 font-medium">Office</th>
            <th className="px-4 py-3 font-medium">Community</th>
            <th className="px-4 py-3 font-medium">Vetting</th>
            <th className="px-4 py-3 font-medium">Submitted</th>
            <th className="px-4 py-3 font-medium">Stage</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-canopy/[0.08] dark:divide-white/10">
          {applications.map((a) => (
            <tr
              key={a.id}
              className="transition-colors hover:bg-paper/60 dark:hover:bg-white/5"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/dashboard/admin/applications/${a.id}`}
                  className="font-semibold text-canopy hover:underline dark:text-paper"
                >
                  {a.fullName}
                </Link>
                <span className="block text-xs text-ink/45 dark:text-paper/45">
                  {a.membershipId ?? a.email}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="text-ink/75 dark:text-paper/70">
                  {a.roleApplied}
                </span>
                {a.altRole && (
                  <span className="block text-xs text-ink/40 dark:text-paper/40">
                    2nd: {a.altRole}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-ink/65 dark:text-paper/60">
                {a.community ?? "—"}
              </td>
              <td className="px-4 py-3 text-xs text-ink/60 dark:text-paper/55">
                {a.vettingPref ? (VETTING_LABEL[a.vettingPref] ?? "—") : "—"}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-xs tabular-nums text-ink/55 dark:text-paper/50">
                {formatDate(a.submittedAt ?? a.createdAt)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Badge tone={statusMeta(a.status).tone}>
                    {statusMeta(a.status).label}
                  </Badge>
                  <StageSelect
                    value={a.status}
                    busy={busyId === a.id && pending}
                    onChange={(s) => onMove(a.id, s)}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
