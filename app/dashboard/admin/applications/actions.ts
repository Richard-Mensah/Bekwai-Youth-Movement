"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { NOT_READY, type ContentResult } from "@/lib/cms"
import { sendEmail, emailEnabled } from "@/lib/email"
import { STATUS_META, statusMeta } from "@/constants/applications"
import type { ApplicationStatus } from "@/constants/applications"

/** Statuses the Secretariat may set. Drafts belong to the applicant alone. */
const SETTABLE: string[] = (Object.keys(STATUS_META) as ApplicationStatus[]).filter(
  (s) => s !== "draft"
)

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/**
 * Moves an application to a new stage, records the change in the event log,
 * and lets the applicant know. The event log is what the applicant's tracker
 * reads, so the two can never disagree.
 */
export async function setApplicationStatus(
  id: string,
  status: string,
  note?: string
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  if (!SETTABLE.includes(status)) return { ok: false, error: "Invalid status." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: before } = await supabase
    .from("leadership_applications")
    .select("status, full_name, email, role_applied")
    .eq("id", id)
    .maybeSingle()
  if (!before) return { ok: false, error: "Application not found." }
  if (before.status === status) return { ok: true }

  const decided = ["appointed", "sworn_in", "rejected"].includes(status)
  const { error } = await supabase
    .from("leadership_applications")
    .update({
      status,
      ...(decided
        ? { decided_at: new Date().toISOString(), decided_by: user?.id ?? null }
        : {}),
    })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }

  await supabase.from("application_events").insert({
    application_id: id,
    from_status: before.status,
    to_status: status,
    note: note?.trim() || null,
    actor_id: user?.id ?? null,
  })

  await notifyApplicant(before, status, note)

  revalidatePath("/dashboard/admin/applications")
  revalidatePath(`/dashboard/admin/applications/${id}`)
  revalidatePath("/dashboard/apply")
  revalidatePath(`/dashboard/apply/${id}`)
  return { ok: true }
}

/** Panel notes and score, saved from the candidate review page. */
export async function saveReview(
  id: string,
  reviewerNotes: string,
  score: number | null
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  if (score !== null && (score < 1 || score > 5))
    return { ok: false, error: "Score must be between 1 and 5." }

  const supabase = await createClient()
  const { error } = await supabase
    .from("leadership_applications")
    .update({ reviewer_notes: reviewerNotes.trim() || null, score })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }

  revalidatePath(`/dashboard/admin/applications/${id}`)
  return { ok: true }
}

async function notifyApplicant(app: any, status: string, note?: string) {
  // Housekeeping moves aren't worth an email.
  if (!emailEnabled()) return
  if (status === "archived" || status === "withdrawn") return
  if (!app.email) return

  const meta = statusMeta(status)
  await sendEmail({
    to: app.email,
    subject: `Update on your application — ${app.role_applied}`,
    text: [
      `Hello ${app.full_name},`,
      ``,
      `Your application for ${app.role_applied} is now at: ${meta.label}.`,
      meta.description,
      note?.trim() ? `\nNote from the Secretariat: ${note.trim()}` : "",
      ``,
      `You can see the full picture in your dashboard at any time.`,
      ``,
      `— The Secretariat, Bekwai Youth Movement`,
    ]
      .filter((l) => l !== "")
      .join("\n"),
    html: `
      <div style="font-family:sans-serif;max-width:560px;line-height:1.6">
        <h2 style="color:#14342B;margin-bottom:4px">Your application has moved forward</h2>
        <p style="color:#4b5563">Hello ${escapeHtml(app.full_name)},</p>
        <p style="background:#faf5e8;border-left:3px solid #C9A24B;padding:12px 16px;color:#111827">
          <strong>${escapeHtml(app.role_applied)}</strong><br/>
          <span style="font-size:14px">Now at: <strong>${escapeHtml(meta.label)}</strong></span><br/>
          <span style="font-size:13px;color:#6b7280">${escapeHtml(meta.description)}</span>
        </p>
        ${
          note?.trim()
            ? `<p style="color:#4b5563"><strong>Note from the Secretariat:</strong><br/>${escapeHtml(note.trim())}</p>`
            : ""
        }
        <p style="color:#4b5563">You can follow the full picture from your dashboard at any time.</p>
        <p style="color:#6b7280;font-size:13px">— The Secretariat, Bekwai Youth Movement</p>
      </div>`,
  })
}
