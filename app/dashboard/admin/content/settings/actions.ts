"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"
import type { SiteSettings } from "@/lib/data/content"

function num(formData: FormData, key: string, fallback: number) {
  const v = parseInt(String(formData.get(key) ?? ""), 10)
  return Number.isNaN(v) ? fallback : v
}

export async function updateSettings(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY

  const value: SiteSettings = {
    heroEyebrow: String(formData.get("heroEyebrow") ?? "").trim(),
    heroTitle: String(formData.get("heroTitle") ?? "").trim(),
    heroSubtitle: String(formData.get("heroSubtitle") ?? "").trim(),
    foundingDate: String(formData.get("foundingDate") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    medium: String(formData.get("medium") ?? "").trim(),
    stats: {
      communities: num(formData, "statCommunities", 32),
      cabinet: num(formData, "statCabinet", 19),
      reps: num(formData, "statReps", 3),
      sdgs: num(formData, "statSdgs", 12),
      women: num(formData, "statWomen", 40),
    },
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from("site_settings")
    .upsert(
      { key: "site", value, updated_at: new Date().toISOString() },
      { onConflict: "key" }
    )
  if (error) return { ok: false, error: error.message }
  await audit("settings", "site", "update")
  revalidatePath("/dashboard/admin/content/settings")
  revalidatePath("/")
  return { ok: true }
}
