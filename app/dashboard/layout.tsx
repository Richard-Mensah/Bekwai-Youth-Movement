import { headers } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
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
    <div className="flex min-h-screen bg-paper">
      <Sidebar role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          fullName={session.fullName}
          roleLabel={ROLE_META[session.role].label}
          role={session.role}
          configured={session.configured}
        />
        {!session.configured && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs text-amber-800">
            Demo mode — Supabase is not connected. Showing dashboard shells with
            sample data.
          </div>
        )}
        <main className="flex-1 p-5 lg:p-8">
          {gated ? <PendingPanel /> : children}
        </main>
      </div>
    </div>
  )
}

function PendingPanel() {
  return (
    <div className="mx-auto max-w-lg rounded-xl border border-dashed border-amber-300 bg-amber-50 p-8 text-center">
      <h2 className="text-lg font-bold text-amber-800">
        Membership pending verification
      </h2>
      <p className="mt-2 text-sm text-amber-700">
        An administrator will verify your membership shortly. Your role-based
        dashboard unlocks once you are verified.
      </p>
      <p className="mt-4 text-sm font-medium text-amber-800">
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
          className="rounded-full border border-amber-300 px-4 py-2 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100"
        >
          My applications
        </Link>
      </div>
    </div>
  )
}
