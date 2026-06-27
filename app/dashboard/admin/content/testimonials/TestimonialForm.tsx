"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import { createTestimonial, updateTestimonial } from "./actions"
import type { Testimonial } from "@/lib/data/content"

export default function TestimonialForm({ item }: { item?: Testimonial }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = item ? await updateTestimonial(fd) : await createTestimonial(fd)
      if (res.ok) {
        router.push("/dashboard/admin/content/testimonials")
        router.refresh()
      } else setError(res.error ?? "Something went wrong.")
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {item && <input type="hidden" name="id" value={item.id} />}

      <Input name="name" label="Name" defaultValue={item?.name} placeholder="Ama Serwaa" required />
      <Input
        name="role"
        label="Role (optional)"
        defaultValue={item?.role ?? ""}
        placeholder="Member · Health & Welfare"
      />
      <div>
        <label htmlFor="quote" className="block text-sm font-medium text-ink/75">
          Quote
        </label>
        <textarea
          id="quote"
          name="quote"
          rows={4}
          defaultValue={item?.quote}
          placeholder="What this member says about BYM…"
          className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        />
      </div>

      <ImageUploadField
        name="photo"
        label="Photo (optional)"
        currentUrl={item?.photoUrl}
        hint="A square headshot looks best."
      />

      <Input
        name="sortOrder"
        label="Sort order"
        type="number"
        defaultValue={String(item?.sortOrder ?? 0)}
      />

      <label className="flex items-center gap-2 text-sm font-medium text-ink/75">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={item ? item.isPublished : true}
          className="h-4 w-4 rounded border-canopy/30 text-canopy focus:ring-canopy"
        />
        Published (show on the homepage)
      </label>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : item ? "Save changes" : "Add testimonial"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/content/testimonials")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
