"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage, deleteImage } from "@/lib/storage"
import { audit, NOT_READY, type ContentResult } from "@/lib/cms"

function parse(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const role = String(formData.get("role") ?? "").trim() || null
  const quote = String(formData.get("quote") ?? "").trim()
  const sortOrder = parseInt(String(formData.get("sortOrder") ?? "0"), 10) || 0
  const isPublished = formData.get("isPublished") === "on"
  return { name, role, quote, sortOrder, isPublished }
}

function revalidate() {
  revalidatePath("/dashboard/admin/content/testimonials")
  revalidatePath("/")
}

export async function createTestimonial(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const data = parse(formData)
  if (data.name.length < 2) return { ok: false, error: "Enter a name." }
  if (data.quote.length < 8) return { ok: false, error: "Enter a longer quote." }

  const supabase = await createClient()
  const photo = await uploadImage(formData.get("photo") as File | null, "testimonials")
  if (photo.error) return { ok: false, error: photo.error }

  const { data: row, error } = await supabase
    .from("testimonials")
    .insert({
      name: data.name,
      role: data.role,
      quote: data.quote,
      sort_order: data.sortOrder,
      is_published: data.isPublished,
      photo_path: photo.path ?? null,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  await audit("testimonial", row?.id ?? null, "create", data.name)
  revalidate()
  return { ok: true, id: row?.id }
}

export async function updateTestimonial(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const id = String(formData.get("id") ?? "")
  if (!id) return { ok: false, error: "Missing id." }
  const data = parse(formData)
  if (data.name.length < 2) return { ok: false, error: "Enter a name." }
  if (data.quote.length < 8) return { ok: false, error: "Enter a longer quote." }

  const supabase = await createClient()
  const patch: Record<string, unknown> = {
    name: data.name,
    role: data.role,
    quote: data.quote,
    sort_order: data.sortOrder,
    is_published: data.isPublished,
  }
  const file = formData.get("photo") as File | null
  if (file && file.size > 0) {
    const photo = await uploadImage(file, "testimonials")
    if (photo.error) return { ok: false, error: photo.error }
    patch.photo_path = photo.path
  }
  const { error } = await supabase.from("testimonials").update(patch).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("testimonial", id, "update", data.name)
  revalidate()
  return { ok: true, id }
}

export async function toggleTestimonialPublish(
  id: string,
  next: boolean
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { error } = await supabase
    .from("testimonials")
    .update({ is_published: next })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("testimonial", id, next ? "publish" : "unpublish")
  revalidate()
  return { ok: true }
}

export async function deleteTestimonial(id: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { data: row } = await supabase
    .from("testimonials")
    .select("photo_path")
    .eq("id", id)
    .single()
  await deleteImage(row?.photo_path)
  const { error } = await supabase.from("testimonials").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("testimonial", id, "delete")
  revalidate()
  return { ok: true }
}
