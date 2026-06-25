import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/auth"
import { ROLE_META } from "@/constants/roles"

export default async function DashboardIndex() {
  const session = await getSessionProfile()
  const target = ROLE_META[session.role].dashboard
  redirect(target === "/" ? "/dashboard/member" : target)
}
