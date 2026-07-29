import { redirect } from "next/navigation"
import { getSessionProfile } from "@/lib/auth"
import { canManageContent } from "@/lib/cms"

/**
 * Role gate for the whole Secretariat console.
 *
 * Middleware only ever asked "is this person signed in?" — it never asked who
 * they were. Every page under /dashboard/admin was therefore reachable by any
 * member who typed the URL. RLS meant the tables came back empty rather than
 * leaking, but that left row-level policy as the only thing between a member
 * and the console: one over-permissive policy anywhere and it becomes real.
 * The four export routes already check this; the pages did not.
 *
 * One layout covers every admin page, including any added later — which is the
 * point, since a per-page check is a thing you forget on the page you add in a
 * hurry.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSessionProfile()

  // Back to the dashboard root rather than /login: they are legitimately
  // signed in, just not Secretariat.
  if (!canManageContent(session.role)) redirect("/dashboard")

  return <>{children}</>
}
