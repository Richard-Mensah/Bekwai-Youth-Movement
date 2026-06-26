"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import Button from "@/components/ui/Button"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import { addGalleryImage, updateGalleryItem, deleteGalleryImage } from "./actions"
import type { GalleryItem } from "@/lib/data/content"

export default function GalleryManager({ items }: { items: GalleryItem[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    start(async () => {
      const res = await addGalleryImage(fd)
      if (res.ok) {
        form.reset()
        router.refresh()
      } else setError(res.error ?? "Upload failed.")
    })
  }

  return (
    <div className="space-y-8">
      {/* Add form */}
      <form
        onSubmit={onAdd}
        className="max-w-xl space-y-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card"
      >
        <h3 className="font-display text-base font-semibold text-canopy">Add a photo</h3>
        <ImageUploadField name="image" label="Image" />
        <input
          name="caption"
          placeholder="Caption (optional)"
          className="block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        />
        <input type="hidden" name="sortOrder" value={items.length} />
        {error && <p className="text-sm text-brand-red">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading…" : "Add photo"}
        </Button>
      </form>

      {/* Existing */}
      {items.length === 0 ? (
        <p className="text-sm text-ink/55">
          No photos yet. Add some above, or import current content from the Content
          Studio.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <GalleryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function GalleryCard({ item }: { item: GalleryItem }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [caption, setCaption] = useState(item.caption)
  const [order, setOrder] = useState(item.sortOrder)

  return (
    <div className="overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card">
      <div className="relative aspect-[4/3]">
        {item.url && <Image src={item.url} alt={item.caption || "Gallery"} fill className="object-cover" />}
      </div>
      <div className="space-y-2 p-3">
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder="Caption"
          className="block w-full rounded-md border border-canopy/20 px-2 py-1.5 text-sm focus:border-canopy focus:outline-none"
        />
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-16 rounded-md border border-canopy/20 px-2 py-1.5 text-sm focus:border-canopy focus:outline-none"
            title="Sort order"
          />
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await updateGalleryItem(item.id, caption, order)
                router.refresh()
              })
            }
            className="rounded-full bg-canopy px-3 py-1.5 text-xs font-semibold text-white hover:bg-canopy-600 disabled:opacity-50"
          >
            Save
          </button>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (confirm("Delete this photo?"))
                start(async () => {
                  await deleteGalleryImage(item.id)
                  router.refresh()
                })
            }}
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline disabled:opacity-50"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  )
}
