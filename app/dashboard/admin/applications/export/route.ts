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
    .from("leadership_applications")
    .select(
      "full_name, email, phone, community, age, gender, role_arm, role_applied, alt_role, occupation, qualifications, experience, motivation, availability, vetting_pref, referee_name, referee_contact, cv_path, status, created_at"
    )
    .order("created_at", { ascending: false })

  const header = [
    "full_name",
    "email",
    "phone",
    "community",
    "age",
    "gender",
    "role_arm",
    "role_applied",
    "alt_role",
    "occupation",
    "qualifications",
    "experience",
    "motivation",
    "availability",
    "vetting_pref",
    "referee_name",
    "referee_contact",
    "has_cv",
    "status",
    "submitted_at",
  ]
  const lines = [
    header.join(","),
    ...(data ?? []).map((r) =>
      [
        r.full_name,
        r.email,
        r.phone,
        r.community,
        r.age,
        r.gender,
        r.role_arm,
        r.role_applied,
        r.alt_role,
        r.occupation,
        r.qualifications,
        r.experience,
        r.motivation,
        r.availability,
        r.vetting_pref,
        r.referee_name,
        r.referee_contact,
        r.cv_path ? "yes" : "no",
        r.status,
        r.created_at,
      ]
        .map(cell)
        .join(",")
    ),
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="bym-leadership-applications.csv"',
    },
  })
}
