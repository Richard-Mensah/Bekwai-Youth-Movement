"use server"

import { revalidatePath } from "next/cache"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"
import { uploadImage, deleteImage } from "@/lib/storage"
import { audit, slugify, NOT_READY, type ContentResult } from "@/lib/cms"

function parse(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim()
  const slug =
    String(formData.get("slug") ?? "").trim() || slugify(title)
  const excerpt = String(formData.get("excerpt") ?? "").trim() || null
  const body = String(formData.get("body") ?? "").trim() || null
  const externalUrl = String(formData.get("externalUrl") ?? "").trim() || null
  const tags = String(formData.get("tags") ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
  const status = formData.get("status") === "published" ? "published" : "draft"
  return { title, slug, excerpt, body, externalUrl, tags, status }
}

function revalidate(slug?: string) {
  revalidatePath("/dashboard/admin/content/posts")
  revalidatePath("/news")
  revalidatePath("/")
  if (slug) revalidatePath(`/news/${slug}`)
}

export async function createPost(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const data = parse(formData)
  if (data.title.length < 4) return { ok: false, error: "Enter a post title." }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const cover = await uploadImage(formData.get("cover") as File | null, "posts")
  if (cover.error) return { ok: false, error: cover.error }

  const { data: row, error } = await supabase
    .from("posts")
    .insert({
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      body: data.body,
      external_url: data.externalUrl,
      tags: data.tags,
      status: data.status,
      published_at: data.status === "published" ? new Date().toISOString() : null,
      cover_path: cover.path ?? null,
      author_id: user?.id ?? null,
    })
    .select("id")
    .single()

  if (error) return { ok: false, error: error.message }
  await audit("post", row?.id ?? null, "create", data.title)
  revalidate(data.slug)
  return { ok: true, id: row?.id }
}

export async function updatePost(formData: FormData): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const id = String(formData.get("id") ?? "")
  if (!id) return { ok: false, error: "Missing post id." }
  const data = parse(formData)
  if (data.title.length < 4) return { ok: false, error: "Enter a post title." }

  const supabase = await createClient()
  const patch: Record<string, unknown> = {
    slug: data.slug,
    title: data.title,
    excerpt: data.excerpt,
    body: data.body,
    external_url: data.externalUrl,
    tags: data.tags,
    status: data.status,
    updated_at: new Date().toISOString(),
  }
  // Set published_at the first time it goes live.
  if (data.status === "published") {
    const { data: existing } = await supabase
      .from("posts")
      .select("published_at")
      .eq("id", id)
      .single()
    if (!existing?.published_at) patch.published_at = new Date().toISOString()
  }

  const file = formData.get("cover") as File | null
  if (file && file.size > 0) {
    const cover = await uploadImage(file, "posts")
    if (cover.error) return { ok: false, error: cover.error }
    patch.cover_path = cover.path
  }

  const { error } = await supabase.from("posts").update(patch).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("post", id, "update", data.title)
  revalidate(data.slug)
  return { ok: true, id }
}

export async function togglePostPublish(
  id: string,
  next: boolean
): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const patch: Record<string, unknown> = {
    status: next ? "published" : "draft",
  }
  if (next) patch.published_at = new Date().toISOString()
  const { error } = await supabase.from("posts").update(patch).eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("post", id, next ? "publish" : "unpublish")
  revalidate()
  return { ok: true }
}

export async function deletePost(id: string): Promise<ContentResult> {
  if (!isSupabaseConfigured()) return NOT_READY
  const supabase = await createClient()
  const { data: post } = await supabase
    .from("posts")
    .select("cover_path")
    .eq("id", id)
    .single()
  await deleteImage(post?.cover_path)
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) return { ok: false, error: error.message }
  await audit("post", id, "delete")
  revalidate()
  return { ok: true }
}
