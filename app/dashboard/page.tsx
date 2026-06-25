import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/auth"
import { ROLE_META } from "@/constants/roles"

// Redirect target depends on the signed-in user's role — resolve per request.
export const dynamic = "force-dynamic"

export default async function DashboardIndex() {
  const session = await getSessionProfile()
  const target = ROLE_META[session.role].dashboard
  redirect(target === "/" ? "/dashboard/member" : target)
}
