"use server"

import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { sendEmail, emailEnabled, ADMIN_EMAIL } from "@/lib/email"
import { OPEN_ROLE_TITLES, armForRole } from "@/constants/openRoles"

export type ApplicationResult = { ok: boolean; error?: string }

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const CV_BUCKET = "applications"
const CV_MAX_BYTES = 5 * 1024 * 1024 // 5 MB
const CV_EXT = ["pdf", "doc", "docx", "odt", "rtf", "jpg", "jpeg", "png"]

const VETTING_LABEL: Record<string, string> = {
  in_person: "In-person (Sefwi Bekwai)",
  virtual: "Virtual (online)",
  either: "Either / not sure yet",
}

/** Stores a leadership-role application (+ optional CV). Public — no auth. */
export async function submitApplication(
  formData: FormData
): Promise<ApplicationResult> {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const phone = String(formData.get("phone") ?? "").trim()
  const community = String(formData.get("community") ?? "").trim()
  const ageRaw = String(formData.get("age") ?? "").trim()
  const gender = String(formData.get("gender") ?? "").trim()
  const roleApplied = String(formData.get("roleApplied") ?? "").trim()
  const altRole = String(formData.get("altRole") ?? "").trim()
  const occupation = String(formData.get("occupation") ?? "").trim()
  const qualifications = String(formData.get("qualifications") ?? "").trim()
  const experience = String(formData.get("experience") ?? "").trim()
  const motivation = String(formData.get("motivation") ?? "").trim()
  const availability = String(formData.get("availability") ?? "").trim()
  const refereeName = String(formData.get("refereeName") ?? "").trim()
  const refereeContact = String(formData.get("refereeContact") ?? "").trim()
  const vettingPref = String(formData.get("vettingPref") ?? "").trim()
  const consent = formData.get("consent") === "on" || formData.get("consent") === "true"
  const cv = formData.get("cv")

  if (!fullName) return { ok: false, error: "Please enter your full name." }
  if (!EMAIL_RE.test(email))
    return { ok: false, error: "Please enter a valid email address." }
  if (!roleApplied || !OPEN_ROLE_TITLES.includes(roleApplied))
    return { ok: false, error: "Please select the role you are applying for." }
  if (motivation.length < 20)
    return {
      ok: false,
      error: "Please tell us in a sentence or two why you want to serve.",
    }
  if (!consent)
    return {
      ok: false,
      error: "Please confirm the declaration to submit your application.",
    }

  const age = ageRaw ? Number.parseInt(ageRaw, 10) : null
  if (age !== null && (Number.isNaN(age) || age < 10 || age > 120))
    return { ok: false, error: "Please enter a valid age." }

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Applications aren't available right now." }
  }

  const supabase = await createClient()

  // Applying requires an account (which carries the unique membership ID).
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return {
      ok: false,
      error: "Please sign in to your account before submitting your application.",
    }
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("membership_id")
    .eq("id", user.id)
    .single()

  // Optional CV upload → private "applications" bucket.
  let cvPath: string | null = null
  if (cv instanceof File && cv.size > 0) {
    if (cv.size > CV_MAX_BYTES)
      return { ok: false, error: "Your CV is larger than 5 MB. Please upload a smaller file." }
    const ext = (cv.name.split(".").pop() || "").toLowerCase()
    if (!CV_EXT.includes(ext))
      return { ok: false, error: "Please upload a PDF, Word, or image file." }
    const key = `cv/${crypto.randomUUID()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from(CV_BUCKET)
      .upload(key, cv, { upsert: false, contentType: cv.type || undefined })
    if (upErr) return { ok: false, error: "Could not upload your CV. Please try again." }
    cvPath = key
  }

  const { error } = await supabase.from("leadership_applications").insert({
    full_name: fullName,
    email,
    phone: phone || null,
    community: community || null,
    age,
    gender: gender || null,
    role_arm: armForRole(roleApplied) ?? null,
    role_applied: roleApplied,
    alt_role: altRole || null,
    occupation: occupation || null,
    qualifications: qualifications || null,
    experience: experience || null,
    motivation,
    availability: availability || null,
    referee_name: refereeName || null,
    referee_contact: refereeContact || null,
    vetting_pref: vettingPref || null,
    cv_path: cvPath,
    user_id: user.id,
    membership_id: profile?.membership_id ?? null,
    consent,
  })

  if (error) {
    // Roll back the orphaned CV so storage doesn't accumulate junk.
    if (cvPath) await supabase.storage.from(CV_BUCKET).remove([cvPath])
    return {
      ok: false,
      error: "Could not submit your application. Please try again.",
    }
  }

  // Best-effort admin notification (only if Resend is configured).
  if (emailEnabled()) {
    let cvLink = "—"
    if (cvPath) {
      const { data: signed } = await supabase.storage
        .from(CV_BUCKET)
        .createSignedUrl(cvPath, 60 * 60 * 24 * 14) // 14-day link
      if (signed?.signedUrl) cvLink = signed.signedUrl
    }
    const rows: [string, string][] = [
      ["Role", roleApplied],
      ["2nd choice", altRole || "—"],
      ["BYM ID", profile?.membership_id ?? "—"],
      ["Name", fullName],
      ["Email", email],
      ["Phone", phone || "—"],
      ["Community", community || "—"],
      ["Age", age !== null ? String(age) : "—"],
      ["Gender", gender || "—"],
      ["Occupation", occupation || "—"],
      ["Qualifications", qualifications || "—"],
      ["Experience", experience || "—"],
      ["Availability", availability || "—"],
      ["Vetting preference", VETTING_LABEL[vettingPref] ?? "—"],
      ["Referee", refereeName ? `${refereeName} (${refereeContact || "—"})` : "—"],
      ["CV", cvLink],
      ["Motivation", motivation],
    ]
    const htmlCell = (k: string, v: string) => {
      const val =
        k === "CV" && v.startsWith("http")
          ? `<a href="${v}">Download CV</a>`
          : escapeHtml(v).replace(/\n/g, "<br/>")
      return `<tr><td style="vertical-align:top;padding:4px 10px 4px 0"><strong>${escapeHtml(
        k
      )}</strong></td><td style="padding:4px 0">${val}</td></tr>`
    }
    await sendEmail({
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New leadership application — ${roleApplied} — ${fullName}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<h2 style="font-family:sans-serif">New leadership application</h2><table style="font-family:sans-serif;border-collapse:collapse">${rows
        .map(([k, v]) => htmlCell(k, v))
        .join("")}</table>`,
    })
  }

  return { ok: true }
}
