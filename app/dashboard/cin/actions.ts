"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { cinReportSchema } from "@/lib/validations"

export type ActionResult = { ok: boolean; error?: string }

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

  // Optional evidence image upload.
  const file = formData.get("evidence") as File | null
  if (file && file.size > 0 && report) {
    const path = `${user.id}/${report.id}-${file.name}`
    const { error: upErr } = await supabase.storage
      .from("cin-evidence")
      .upload(path, file, { upsert: false })
    if (!upErr) {
      await supabase
        .from("cin_report_images")
        .insert({ report_id: report.id, path })
    }
  }

  revalidatePath("/dashboard/cin")
  return { ok: true }
}
