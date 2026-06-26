"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import Markdown from "@/components/features/public/Markdown"
import { createPost, updatePost } from "./actions"
import type { Post } from "@/lib/data/content"

export default function PostForm({ post }: { post?: Post }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [body, setBody] = useState(post?.body ?? "")
  const [preview, setPreview] = useState(false)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = post ? await updatePost(fd) : await createPost(fd)
      if (res.ok) {
        router.push("/dashboard/admin/content/posts")
        router.refresh()
      } else setError(res.error ?? "Something went wrong.")
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-3xl space-y-4">
      {post && <input type="hidden" name="id" value={post.id} />}

      <Input name="title" label="Title" defaultValue={post?.title} placeholder="Post title" required />
      <Input
        name="slug"
        label="URL slug (optional — auto-generated from title)"
        defaultValue={post?.slug}
        placeholder="my-post"
      />
      <Input
        name="excerpt"
        label="Excerpt (short summary shown in cards)"
        defaultValue={post?.excerpt ?? ""}
        placeholder="One or two sentences"
      />

      <ImageUploadField
        name="cover"
        label="Cover image"
        currentUrl={post?.coverUrl}
        hint="Shown on the article page and post cards."
      />

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="body" className="block text-sm font-medium text-ink/75">
            Body (Markdown supported)
          </label>
          <button
            type="button"
            onClick={() => setPreview((v) => !v)}
            className="text-xs font-semibold text-canopy hover:underline"
          >
            {preview ? "Edit" : "Preview"}
          </button>
        </div>
        {preview ? (
          <div className="mt-1 min-h-[12rem] rounded-lg border border-canopy/20 p-4">
            {body ? <Markdown>{body}</Markdown> : <p className="text-sm text-ink/40">Nothing to preview yet.</p>}
          </div>
        ) : (
          <textarea
            id="body"
            name="body"
            rows={14}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder={"Write your article here.\n\n## A heading\n\nUse **bold**, lists, and [links](https://example.com)."}
            className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 font-mono text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
          />
        )}
      </div>

      <Input
        name="tags"
        label="Tags (comma separated)"
        defaultValue={post?.tags.join(", ")}
        placeholder="Climate, SDG 13"
      />
      <Input
        name="externalUrl"
        label="External link (optional — e.g. a Medium article)"
        defaultValue={post?.externalUrl ?? ""}
        placeholder="https://…"
      />

      <label className="flex items-center gap-2 text-sm font-medium text-ink/75">
        <input
          type="checkbox"
          name="status"
          value="published"
          defaultChecked={post?.status === "published"}
          className="h-4 w-4 rounded border-canopy/30 text-canopy focus:ring-canopy"
        />
        Publish now (uncheck to save as draft)
      </label>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : post ? "Save changes" : "Create post"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/content/posts")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
