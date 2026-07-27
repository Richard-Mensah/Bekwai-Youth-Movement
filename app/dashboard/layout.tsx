import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowUpRight, Hourglass } from "lucide-react"
import { getSessionProfile } from "@/lib/auth"
import { PATHNAME_HEADER, openWhilePending } from "@/lib/dashboard-access"

// Auth-gated, role-dependent — never statically prerender any dashboard route.
export const dynamic = "force-dynamic"
import { ROLE_META } from "@/constants/roles"
import Sidebar from "@/components/layout/Sidebar"
import DashboardTopbar from "@/components/layout/DashboardTopbar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionProfile()

  // Configured but signed out → middleware normally redirects; guard anyway.
  if (session.configured && !session.userId) redirect("/login")

  const notVerified =
    session.configured && session.verificationStatus !== "verified"

  // An unverified member keeps full use of the apply portal; the gate only
  // covers the areas that confer standing. A missing header (no middleware on
  // this request) falls through to gated, so the failure mode is closed.
  const pathname = (await headers()).get(PATHNAME_HEADER) ?? ""
  const gated = notVerified && !openWhilePending(pathname)

  return (
    <div className="console-bg flex min-h-screen">
      <Sidebar role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          fullName={session.fullName}
          roleLabel={ROLE_META[session.role].label}
          role={session.role}
          configured={session.configured}
        />
        {!session.configured && (
          <div className="flex items-center gap-2 border-b border-gold-200 bg-gold-50 px-5 py-2 text-xs font-medium text-gold-700 dark:border-gold-400/20 dark:bg-gold-400/10 dark:text-gold-200">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold-400" />
            Demo mode — Supabase is not connected. Showing dashboard shells with
            sample data.
          </div>
        )}
        {/* Capped so tables and card grids don't stretch to absurd line
            lengths on a wide monitor. */}
        <main className="mx-auto w-full max-w-[90rem] flex-1 p-5 lg:p-8">
          {gated ? <PendingPanel /> : children}
        </main>
      </div>
    </div>
  )
}

function PendingPanel() {
  return (
    <div className="surface relative mx-auto max-w-xl overflow-hidden p-8 text-center sm:p-10">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent"
      />
      <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden
          className="absolute inset-0 animate-pulse rounded-full bg-gold-400/20 blur-lg"
        />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-canopy text-gold-300 shadow-card">
          <Hourglass size={24} aria-hidden />
        </span>
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold text-canopy dark:text-paper">
        Membership pending verification
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60 dark:text-paper/60">
        An administrator will verify your membership shortly. Your role-based
        dashboard unlocks once you are verified.
      </p>
      <p className="mt-5 text-sm font-semibold text-canopy dark:text-paper">
        You do not have to wait to apply for office.
      </p>
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <Link
          href="/dashboard/apply/roles"
          className="inline-flex items-center gap-1.5 rounded-full bg-canopy px-4 py-2 text-xs font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
        >
          Browse offices <ArrowUpRight size={13} />
        </Link>
        <Link
          href="/dashboard/apply"
          className="rounded-full border border-canopy/20 px-4 py-2 text-xs font-semibold text-canopy transition-colors hover:bg-canopy-50 dark:border-white/15 dark:text-paper dark:hover:bg-white/10"
        >
          My applications
        </Link>
      </div>
    </div>
  )
}
