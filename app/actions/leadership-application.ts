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

/** Stores a leadership-role application. Public — no auth required. */
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
  const consent = formData.get("consent") === "on" || formData.get("consent") === "true"

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
    consent,
  })

  if (error) {
    return {
      ok: false,
      error: "Could not submit your application. Please try again.",
    }
  }

  // Best-effort admin notification (only if Resend is configured).
  if (emailEnabled()) {
    const rows: [string, string][] = [
      ["Role", roleApplied],
      ["2nd choice", altRole || "—"],
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
      ["Referee", refereeName ? `${refereeName} (${refereeContact || "—"})` : "—"],
      ["Motivation", motivation],
    ]
    await sendEmail({
      to: ADMIN_EMAIL,
      replyTo: email,
      subject: `New leadership application — ${roleApplied} — ${fullName}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: `<h2>New leadership application</h2><table cellpadding="6" style="border-collapse:collapse">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="vertical-align:top"><strong>${escapeHtml(
              k
            )}</strong></td><td>${escapeHtml(v).replace(/\n/g, "<br/>")}</td></tr>`
        )
        .join("")}</table>`,
    })
  }

  return { ok: true }
}
