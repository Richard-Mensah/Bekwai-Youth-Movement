import { getSessionProfile } from "@/lib/auth"
import { canManageContent } from "@/lib/cms"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

function cell(v: unknown) {
  const s = String(v ?? "")
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

export async function GET() {
  const session = await getSessionProfile()
  if (!canManageContent(session.role)) return new Response("Forbidden", { status: 403 })
  if (!isSupabaseConfigured()) return new Response("Not configured", { status: 400 })

  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select(
      "full_name, email, phone, membership_id, verification_status, created_at, communities(name)"
    )
    .order("created_at", { ascending: false })

  const header = ["name", "email", "phone", "membership_id", "community", "status", "joined"]
  const lines = [
    header.join(","),
    ...(data ?? []).map((r: Record<string, unknown>) =>
      [
        r.full_name,
        r.email,
        r.phone,
        r.membership_id,
        (r.communities as { name?: string } | null)?.name ?? "",
        r.verification_status,
        r.created_at,
      ]
        .map(cell)
        .join(",")
    ),
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bym-members.csv"',
    },
  })
}
