"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendEmail, emailEnabled, ADMIN_EMAIL } from "@/lib/email"
import { armForRole, OPEN_ROLE_TITLES } from "@/constants/openRoles"
import { officeBySlug, officeByTitle } from "@/constants/offices"
import {
  DOC_BUCKET,
  DOC_EXTENSIONS,
  DOC_MAX_BYTES,
  TOTAL_STEPS,
  VETTING_LABEL,
} from "@/constants/applications"
import { applicationSchema } from "@/lib/validations"

export type Result<T = undefined> =
  | ({ ok: true } & (T extends undefined ? object : { data: T }))
  | { ok: false; error: string }

const NOT_CONFIGURED = {
  ok: false as const,
  error: "Applications aren't available right now. Please try again later.",
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
}

/** The columns the wizard is allowed to write. Anything else is ignored. */
const DRAFT_FIELDS = [
  "full_name",
  "email",
  "phone",
  "community",
  "age",
  "gender",
  "role_applied",
  "role_slug",
  "role_arm",
  "alt_role",
  "alt_role_slug",
  "occupation",
  "qualifications",
  "experience",
  "motivation",
  "availability",
  "referee_name",
  "referee_contact",
  "vetting_pref",
  "consent",
  "current_step",
] as const

type DraftPatch = Partial<Record<(typeof DRAFT_FIELDS)[number], unknown>>

/**
 * Returns the caller's open draft, creating one (prefilled from their profile)
 * if they don't have one yet. `roleSlug` preselects the office.
 */
export async function startDraft(
  roleSlug?: string
): Promise<Result<{ id: string }>> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to apply." }

  const office = roleSlug ? officeBySlug(roleSlug) : undefined

  // Reuse an existing draft rather than piling up half-finished rows.
  const { data: existing } = await supabase
    .from("leadership_applications")
    .select("id, role_applied")
    .eq("user_id", user.id)
    .eq("status", "draft")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existing) {
    // A draft with no office yet adopts the one the applicant just clicked.
    if (office && !existing.role_applied) {
      await supabase
        .from("leadership_applications")
        .update({
          role_applied: office.title,
          role_slug: office.slug,
          role_arm: office.arm,
        })
        .eq("id", existing.id)
    }
    return { ok: true, data: { id: existing.id } }
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, email, phone, membership_id, communities(name)")
    .eq("id", user.id)
    .maybeSingle()

  const community = (profile?.communities as { name?: string } | null)?.name

  const { data, error } = await supabase
    .from("leadership_applications")
    .insert({
      user_id: user.id,
      membership_id: profile?.membership_id ?? null,
      full_name: profile?.full_name ?? "",
      email: profile?.email ?? user.email ?? "",
      phone: profile?.phone ?? null,
      community: community ?? null,
      role_applied: office?.title ?? "",
      role_slug: office?.slug ?? null,
      role_arm: office?.arm ?? null,
      motivation: "",
      status: "draft",
      current_step: 1,
      consent: false,
    })
    .select("id")
    .single()

  if (error || !data) {
    return { ok: false, error: "Could not start your application. Please try again." }
  }
  return { ok: true, data: { id: data.id } }
}

/**
 * Autosave. Accepts a partial patch and writes only whitelisted columns.
 * Deliberately permissive — a half-finished draft is a valid draft.
 */
export async function saveDraft(
  id: string,
  patch: Record<string, string | number | boolean | null>
): Promise<Result> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }

  const update: DraftPatch = {}
  for (const key of DRAFT_FIELDS) {
    if (key in patch) update[key] = patch[key]
  }

  // Keep the denormalised role columns consistent with each other.
  if (typeof update.role_applied === "string") {
    const office = officeByTitle(update.role_applied)
    update.role_slug = office?.slug ?? null
    update.role_arm = office?.arm ?? armForRole(update.role_applied) ?? null
  }
  if (typeof update.alt_role === "string") {
    update.alt_role_slug = officeByTitle(update.alt_role)?.slug ?? null
  }
  if (typeof update.current_step === "number") {
    update.current_step = Math.min(Math.max(update.current_step, 1), TOTAL_STEPS)
  }

  if (Object.keys(update).length === 0) return { ok: true }

  const { error } = await supabase
    .from("leadership_applications")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "draft")

  if (error) return { ok: false, error: "Could not save your changes." }
  return { ok: true }
}

/** Attaches a supporting document to a draft. */
export async function uploadDocument(formData: FormData): Promise<Result> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const id = String(formData.get("applicationId") ?? "")
  const kind = String(formData.get("kind") ?? "other")
  const file = formData.get("file")

  if (!id) return { ok: false, error: "Missing application." }
  if (!(file instanceof File) || file.size === 0)
    return { ok: false, error: "Choose a file to upload." }
  if (file.size > DOC_MAX_BYTES)
    return { ok: false, error: "That file is larger than 5 MB. Please upload a smaller one." }

  const ext = (file.name.split(".").pop() || "").toLowerCase()
  if (!DOC_EXTENSIONS.includes(ext))
    return { ok: false, error: "Please upload a PDF, Word document or image." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }

  // Confirm the draft is the caller's before writing anything to storage.
  const { data: app } = await supabase
    .from("leadership_applications")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "draft")
    .maybeSingle()
  if (!app) return { ok: false, error: "That application can no longer be edited." }

  const key = `cv/${crypto.randomUUID()}.${ext}`
  const { error: upErr } = await supabase.storage
    .from(DOC_BUCKET)
    .upload(key, file, { upsert: false, contentType: file.type || undefined })
  if (upErr) return { ok: false, error: "Could not upload that file. Please try again." }

  const { error } = await supabase.from("application_documents").insert({
    application_id: id,
    kind,
    path: key,
    filename: file.name,
    size_bytes: file.size,
  })

  if (error) {
    // Don't leave an orphaned object behind.
    await supabase.storage.from(DOC_BUCKET).remove([key])
    return { ok: false, error: "Could not attach that file. Please try again." }
  }

  // Mirror the primary CV onto the legacy column the admin list reads.
  if (kind === "cv") {
    await supabase
      .from("leadership_applications")
      .update({ cv_path: key })
      .eq("id", id)
      .eq("user_id", user.id)
  }

  revalidatePath(`/dashboard/apply/new`)
  return { ok: true }
}

/** Detaches a document from a draft and deletes the stored object. */
export async function removeDocument(documentId: string): Promise<Result> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()

  const { data: doc } = await supabase
    .from("application_documents")
    .select("id, path, kind, application_id")
    .eq("id", documentId)
    .maybeSingle()
  if (!doc) return { ok: false, error: "That file is already gone." }

  // RLS restricts the delete to the owner of a draft; if it removes nothing,
  // the caller wasn't allowed to.
  const { error, count } = await supabase
    .from("application_documents")
    .delete({ count: "exact" })
    .eq("id", documentId)
  if (error || !count) return { ok: false, error: "Could not remove that file." }

  await supabase.storage.from(DOC_BUCKET).remove([doc.path])
  if (doc.kind === "cv") {
    await supabase
      .from("leadership_applications")
      .update({ cv_path: null })
      .eq("id", doc.application_id)
  }

  revalidatePath(`/dashboard/apply/new`)
  return { ok: true }
}

/** Final validation, submission, and notification. */
export async function submitDraft(id: string): Promise<Result> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to submit." }

  const { data: app } = await supabase
    .from("leadership_applications")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "draft")
    .maybeSingle()
  if (!app) return { ok: false, error: "That application has already been submitted." }

  const parsed = applicationSchema.safeParse({
    fullName: app.full_name,
    email: app.email,
    roleApplied: app.role_applied,
    motivation: app.motivation,
    age: app.age,
    consent: app.consent === true,
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Please complete the form." }
  }
  if (!OPEN_ROLE_TITLES.includes(app.role_applied)) {
    return { ok: false, error: "Please choose a valid office from the list." }
  }

  const { error } = await supabase
    .from("leadership_applications")
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      current_step: TOTAL_STEPS,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "draft")

  if (error) return { ok: false, error: "Could not submit your application. Please try again." }

  await supabase.from("application_events").insert({
    application_id: id,
    from_status: "draft",
    to_status: "submitted",
    note: "Application submitted",
    actor_id: user.id,
  })

  await notifySubmission(app)

  revalidatePath("/dashboard/apply")
  revalidatePath("/dashboard/admin/applications")
  return { ok: true }
}

/** Lets an applicant pull out of a live application. */
export async function withdrawApplication(id: string): Promise<Result> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }

  const { data: app } = await supabase
    .from("leadership_applications")
    .select("id, status")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle()
  if (!app) return { ok: false, error: "Application not found." }
  if (["appointed", "sworn_in", "withdrawn"].includes(app.status))
    return { ok: false, error: "This application can no longer be withdrawn." }

  const { error } = await supabase
    .from("leadership_applications")
    .update({ status: "withdrawn" })
    .eq("id", id)
    .eq("user_id", user.id)
  if (error) return { ok: false, error: "Could not withdraw your application." }

  await supabase.from("application_events").insert({
    application_id: id,
    from_status: app.status,
    to_status: "withdrawn",
    note: "Withdrawn by the applicant",
    actor_id: user.id,
  })

  revalidatePath("/dashboard/apply")
  revalidatePath(`/dashboard/apply/${id}`)
  return { ok: true }
}

/** Deletes an abandoned draft and everything hanging off it. */
export async function discardDraft(id: string): Promise<Result> {
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "Please sign in to continue." }

  const { data: docs } = await supabase
    .from("application_documents")
    .select("path")
    .eq("application_id", id)

  const { error } = await supabase
    .from("leadership_applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id)
    .eq("status", "draft")
  if (error) return { ok: false, error: "Could not discard that draft." }

  const paths = (docs ?? []).map((d) => d.path).filter(Boolean)
  if (paths.length > 0) await supabase.storage.from(DOC_BUCKET).remove(paths)

  revalidatePath("/dashboard/apply")
  return { ok: true }
}

/* ------------------------------------------------------------------ */
/* Notifications — best effort, never block a submission               */
/* ------------------------------------------------------------------ */

async function notifySubmission(app: any) {
  if (!emailEnabled()) return
  const office = officeByTitle(app.role_applied)

  const rows: [string, string][] = [
    ["Office", app.role_applied],
    ["2nd choice", app.alt_role || "—"],
    ["BYM ID", app.membership_id ?? "—"],
    ["Name", app.full_name],
    ["Email", app.email],
    ["Phone", app.phone || "—"],
    ["Community", app.community || "—"],
    ["Age", app.age != null ? String(app.age) : "—"],
    ["Gender", app.gender || "—"],
    ["Occupation", app.occupation || "—"],
    ["Qualifications", app.qualifications || "—"],
    ["Experience", app.experience || "—"],
    ["Availability", app.availability || "—"],
    ["Vetting preference", VETTING_LABEL[app.vetting_pref] ?? "—"],
    [
      "Referee",
      app.referee_name
        ? `${app.referee_name} (${app.referee_contact || "—"})`
        : "—",
    ],
    ["Motivation", app.motivation],
  ]

  const cell = (k: string, v: string) =>
    `<tr><td style="vertical-align:top;padding:4px 10px 4px 0"><strong>${escapeHtml(
      k
    )}</strong></td><td style="padding:4px 0">${escapeHtml(v).replace(
      /\n/g,
      "<br/>"
    )}</td></tr>`

  // Secretariat
  await sendEmail({
    to: ADMIN_EMAIL,
    replyTo: app.email,
    subject: `New application — ${app.role_applied} — ${app.full_name}`,
    text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
    html: `<h2 style="font-family:sans-serif">New leadership application</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows
      .map(([k, v]) => cell(k, v))
      .join("")}</table><p style="font-family:sans-serif;font-size:13px">Review it in the Secretariat console.</p>`,
  })

  // Applicant
  await sendEmail({
    to: app.email,
    subject: `We've received your application — ${app.role_applied}`,
    text: [
      `Hello ${app.full_name},`,
      ``,
      `Thank you for stepping forward to serve the Bekwai Youth Movement.`,
      `We have received your application for ${app.role_applied}.`,
      ``,
      `What happens next: the Secretariat reviews every application, then`,
      `qualified nominees go before the Vetting Panel — in person in Sefwi`,
      `Bekwai or online, whichever you chose. You can follow your progress`,
      `at any time from your dashboard.`,
      ``,
      `— The Secretariat, Bekwai Youth Movement`,
    ].join("\n"),
    html: `
      <div style="font-family:sans-serif;max-width:560px;line-height:1.6">
        <h2 style="color:#14342B;margin-bottom:4px">Your application has been received</h2>
        <p style="color:#4b5563">Hello ${escapeHtml(app.full_name)}, thank you for stepping forward to serve.</p>
        <p style="background:#faf5e8;border-left:3px solid #C9A24B;padding:12px 16px;color:#111827">
          <strong>${escapeHtml(app.role_applied)}</strong>${
            office?.constitutionalTitle
              ? `<br/><span style="font-size:13px;color:#6b7280">${escapeHtml(office.constitutionalTitle)}</span>`
              : ""
          }
        </p>
        <p style="color:#4b5563">
          The Secretariat reviews every application. Qualified nominees then go
          before the Vetting Panel — in person in Sefwi Bekwai, or online if you
          are away from home. You can follow your progress at any time from your
          dashboard.
        </p>
        <p style="color:#6b7280;font-size:13px">— The Secretariat, Bekwai Youth Movement</p>
      </div>`,
  })
}
