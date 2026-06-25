import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/auth"

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

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar role={session.role} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          fullName={session.fullName}
          roleLabel={ROLE_META[session.role].label}
          configured={session.configured}
        />
        {!session.configured && (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-2 text-xs text-amber-800">
            Demo mode — Supabase is not connected. Showing dashboard shells with
            sample data.
          </div>
        )}
        <main className="flex-1 p-5 lg:p-8">
          {notVerified ? <PendingPanel /> : children}
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
    </div>
  )
}
