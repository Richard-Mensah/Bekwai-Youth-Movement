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
    .from("contact_messages")
    .select("name, email, topic, message, status, created_at")
    .order("created_at", { ascending: false })

  const header = ["name", "email", "topic", "message", "status", "received_at"]
  const lines = [
    header.join(","),
    ...(data ?? []).map((r) =>
      [r.name, r.email, r.topic, r.message, r.status, r.created_at].map(cell).join(",")
    ),
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bym-contact-messages.csv"',
    },
  })
}
