import type { Metadata } from "next"
import { Suspense } from "react"
import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/auth"
import CompleteProfileForm from "@/components/features/auth/CompleteProfileForm"

export const metadata: Metadata = {
  title: "Complete your profile",
  // Reached only with a session, and it is a form about one person. Keeping it
  // out of the index costs nothing and is consistent with /dashboard in robots.ts.
  robots: { index: false, follow: false },
}

// Decided from the signed-in profile, so it must never be prerendered.
export const dynamic = "force-dynamic"

export default async function CompleteProfilePage() {
  const session = await getSessionProfile()

  // Signed out — nothing to complete. Sent back here afterwards so an
  // interrupted OAuth sign-in resumes where it stopped.
  if (session.configured && !session.userId) {
    redirect("/login?next=%2Fcomplete-profile")
  }

  // Already complete. Without this the page is a dead end reachable from the
  // URL bar: the form would save the same values again and the dashboard gate
  // would have let them straight through anyway.
  if (!session.needsProfile) redirect("/dashboard")

  return (
    <Suspense>
      <CompleteProfileForm fullName={session.fullName} />
    </Suspense>
  )
}
