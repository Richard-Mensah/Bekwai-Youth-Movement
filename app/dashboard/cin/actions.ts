"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { cinReportSchema } from "@/lib/validations"

export type ActionResult = { ok: boolean; error?: string }

/**
 * Evidence upload rules. The applications portal already works this way
 * (constants/applications.ts); incident evidence had none of it — the raw
 * `file.name` went straight into the object key with no size, type or
 * character check, which is both a traversal attempt waiting to happen and an
 * unbounded upload into a private bucket.
 */
const EVIDENCE_MAX_BYTES = 5 * 1024 * 1024
const EVIDENCE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "heic", "pdf"]

/** Creates a CIN report for the signed-in officer, with optional evidence. */
export async function createCinReport(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Connect Supabase to submit reports." }
  }

  const parsed = cinReportSchema.safeParse({
    category: formData.get("category"),
    severity: formData.get("severity"),
    description: formData.get("description"),
    communityId: formData.get("communityId"),
    gpsLat: formData.get("gpsLat") || undefined,
    gpsLng: formData.get("gpsLng") || undefined,
  })
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" }
  }

  // Vet the attachment before the report row exists, so a rejected file fails
  // the whole submission instead of leaving a saved report with silently
  // missing evidence.
  const file = formData.get("evidence") as File | null
  const hasFile = Boolean(file && file.size > 0)
  let ext = ""
  if (hasFile && file) {
    if (file.size > EVIDENCE_MAX_BYTES) {
      return { ok: false, error: "That file is larger than 5 MB. Please attach a smaller photo." }
    }
    ext = (file.name.split(".").pop() || "").toLowerCase()
    if (!EVIDENCE_EXTENSIONS.includes(ext)) {
      return { ok: false, error: "Please attach a photo (JPG, PNG, WEBP, HEIC) or a PDF." }
    }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: "You must be signed in." }

  const { data: report, error } = await supabase
    .from("cin_reports")
    .insert({
      officer_id: user.id,
      community_id: parsed.data.communityId,
      category: parsed.data.category,
      severity: parsed.data.severity,
      description: parsed.data.description,
      gps_lat: parsed.data.gpsLat ?? null,
      gps_lng: parsed.data.gpsLng ?? null,
    })
    .select("id")
    .single()

  if (error) return { ok: false, error: error.message }

  // Optional evidence upload. The key is generated, never taken from the
  // filename — the officer's id stays the leading segment because the read
  // policy in 0023 matches on it.
  if (hasFile && file && report) {
    const path = `${user.id}/${report.id}/${crypto.randomUUID()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from("cin-evidence")
      .upload(path, file, { upsert: false, contentType: file.type || undefined })
    if (upErr) {
      // The report itself is saved, so this is a partial success rather than a
      // failure — but it must not vanish the way it used to.
      console.error(`[cin] evidence upload failed for report ${report.id}: ${upErr.message}`)
    } else {
      const { error: imgErr } = await supabase
        .from("cin_report_images")
        .insert({ report_id: report.id, path })
      if (imgErr) {
        console.error(`[cin] evidence row failed for report ${report.id}: ${imgErr.message}`)
      }
    }
  }

  revalidatePath("/dashboard/cin")
  return { ok: true }
}
