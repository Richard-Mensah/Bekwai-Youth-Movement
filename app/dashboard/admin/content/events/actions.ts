"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage, deleteImage } from "@/lib/storage"
import { audit, slugify, NOT_READY, type ContentResult } from "@/lib/cms"

function parse(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  return {
    title,
    slug: String(formData.get("slug") ?? "").trim() || slugify(title),
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    startsAt: String(formData.get("startsAt") ?? "").trim() || null,
    endsAt: String(formData.get("endsAt") ?? "").trim() || null,
    isPublished: formData.get("isPublished") === "on",
  }
}

function revalidate() {
  revalidatePath("/dashboard/admin/content/events")
  revalidatePath("/events")
  revalidatePath("/")
}

export async function createEvent(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const d = parse(formData)
  if (d.title.length < 3) return { ok: false, error: "Enter an event title." }
  const supabase = await createClient()
  const cover = await uploadImage(formData.get("cover") as File | null, "events")
  if (cover.error) return { ok: false, error: cover.error }
  const { data: row, error } = await supabase
    .from("events")
    .insert({
      slug: d.slug,
      title: d.title,
      description: d.description,
      location: d.location,
      starts_at: d.startsAt,
      ends_at: d.endsAt,
      is_published: d.isPublished,
      cover_path: cover.path ?? null,
    })
    .select("id")
    .single()
  if (error) return { ok: false, error: error.message }
  await audit("event", row?.id ?? null, "create", d.title)
  revalidate()
  return { ok: true, id: row?.id }
}

export async function updateEvent(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const id = String(formData.get("id") ?? "")
  if (!id) return { ok: false, error: "Missing id." }
  const d = parse(formData)
  const supabase = await createClient()
  const patch: Record<string, unknown> = {
    slug: d.slug,
    title: d.title,
    description: d.description,
    location: d.location,
    starts_at: d.startsAt,
    ends_at: d.endsAt,
    is_published: d.isPublished,
  }
  const file = formData.get("cover") as File | null
  if (file && file.size > 0) {
    const cover = await uploadImage(file, "events")
    if (cover.error) return { ok: false, error: cover.error }
    patch.cover_path = cover.path
  }
  const { error } = await supabase.from("events").update(patch).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("event", id, "update", d.title)
  revalidate()
  return { ok: true, id }
}

export async function deleteEvent(id: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { data } = await supabase.from("events").select("cover_path").eq("id", id).single()
  await deleteImage(data?.cover_path)
  const { error } = await supabase.from("events").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("event", id, "delete")
  revalidate()
  return { ok: true }
}

export async function toggleEventPublish(
  id: string,
  next: boolean
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { error } = await supabase
    .from("events")
    .update({ is_published: next })
    .eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("event", id, next ? "publish" : "unpublish")
  revalidate()
  return { ok: true }
}
