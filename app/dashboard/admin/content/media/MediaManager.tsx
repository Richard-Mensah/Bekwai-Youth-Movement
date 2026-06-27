"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Copy, Check, Trash2 } from "lucide-react"
import Button from "@/components/ui/Button"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import { uploadMedia, deleteMedia } from "./actions"

type Item = { path: string; url: string }

export default function MediaManager({ items }: { items: Item[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    start(async () => {
      const res = await uploadMedia(fd)
      if (res.ok) {
        form.reset()
        router.refresh()
      } else setError(res.error ?? "Upload failed.")
    })
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onUpload}
        className="max-w-xl space-y-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card"
      >
        <h3 className="font-display text-base font-semibold text-canopy">Upload an image</h3>
        <ImageUploadField name="file" label="Image" hint="Reuse the URL anywhere in the CMS." />
        {error && <p className="text-sm text-brand-red">{error}</p>}
        <Button type="submit" disabled={pending}>
          {pending ? "Uploading…" : "Upload"}
        </Button>
      </form>

      {items.length === 0 ? (
        <p className="text-sm text-ink/55">No media yet. Uploads from any module appear here.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <MediaCard key={item.path} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}

function MediaCard({ item }: { item: { path: string; url: string } }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [copied, setCopied] = useState(false)

  return (
    <div className="overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card">
      <div className="relative aspect-square bg-paper">
        {item.url && <Image src={item.url} alt="" fill className="object-contain p-2" />}
      </div>
      <div className="flex items-center justify-between p-2">
        <button
          type="button"
          onClick={() => {
            navigator.clipboard.writeText(item.url)
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-canopy hover:underline"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />} {copied ? "Copied" : "Copy URL"}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            if (confirm("Delete this image?"))
              start(async () => {
                await deleteMedia(item.path)
                router.refresh()
              })
          }}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-red hover:underline disabled:opacity-50"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}
