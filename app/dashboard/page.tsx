import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/auth"
import { ROLE_META } from "@/constants/roles"

// Redirect target depends on the signed-in user's role — resolve per request.
export const dynamic = "force-dynamic"

export default async function DashboardIndex() {
  const session = await getSessionProfile()

  // A member awaiting verification has nothing to do on their role dashboard —
  // it is the pending notice. Send them to the apply portal, which is open to
  // them, rather than landing them on a wall the moment they sign in.
  if (session.configured && session.verificationStatus !== "verified") {
    redirect("/dashboard/apply")
  }

  const target = ROLE_META[session.role].dashboard
  redirect(target === "/" ? "/dashboard/member" : target)
}
