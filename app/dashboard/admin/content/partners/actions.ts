"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage, deleteImage } from "@/lib/storage"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"

function parse(formData: FormData) {
  return {
    name: String(formData.get("name") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim() || null,
    tier: String(formData.get("tier") ?? "partner").trim(),
    sortOrder: parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0,
    isPublished: formData.get("isPublished") === "on",
  }
}

function revalidate() {
  revalidatePath("/dashboard/admin/content/partners")
  revalidatePath("/")
  revalidatePath("/about")
}

export async function createPartner(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const d = parse(formData)
  if (d.name.length < 2) return { ok: false, error: "Enter a partner name." }
  const supabase = await createClient()
  const logo = await uploadImage(formData.get("logo") as File | null, "partners")
  if (logo.error) return { ok: false, error: logo.error }
  const { data: row, error } = await supabase
    .from("partners")
    .insert({
      name: d.name,
      url: d.url,
      tier: d.tier,
      sort_order: d.sortOrder,
      is_published: d.isPublished,
      logo_path: logo.path ?? null,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  await audit("partner", row?.id ?? null, "create", d.name)
  revalidate()
  return { ok: true, id: row?.id }
}

export async function updatePartner(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const id = String(formData.get("id") ?? "")
  if (!id) return { ok: false, error: "Missing id." }
  const d = parse(formData)
  const supabase = await createClient()
  const patch: Record<string, unknown> = {
    name: d.name,
    url: d.url,
    tier: d.tier,
    sort_order: d.sortOrder,
    is_published: d.isPublished,
  }
  const file = formData.get("logo") as File | null
  if (file && file.size > 0) {
    const logo = await uploadImage(file, "partners")
    if (logo.error) return { ok: false, error: logo.error }
    patch.logo_path = logo.path
  }
  const { error } = await supabase.from("partners").update(patch).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("partner", id, "update", d.name)
  revalidate()
  return { ok: true, id }
}

export async function deletePartner(id: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { data } = await supabase.from("partners").select("logo_path").eq("id", id).single()
  await deleteImage(data?.logo_path)
  const { error } = await supabase.from("partners").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("partner", id, "delete")
  revalidate()
  return { ok: true }
}

export async function togglePartnerPublish(
  id: string,
  next: boolean
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { error } = await supabase
    .from("partners")
    .update({ is_published: next })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("partner", id, next ? "publish" : "unpublish")
  revalidate()
  return { ok: true }
}
