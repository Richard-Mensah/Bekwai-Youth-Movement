"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import { createPartner, updatePartner } from "./actions"
import type { PartnerItem } from "@/lib/data/content"

export default function PartnerForm({ partner }: { partner?: PartnerItem }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = partner ? await updatePartner(fd) : await createPartner(fd)
      if (res.ok) {
        router.push("/dashboard/admin/content/partners")
        router.refresh()
      } else setError(res.error ?? "Something went wrong.")
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      {partner && <input type="hidden" name="id" value={partner.id} />}
      <Input name="name" label="Partner / sponsor name" defaultValue={partner?.name} required />
      <Input name="url" label="Website (optional)" defaultValue={partner?.url ?? ""} placeholder="https://…" />
      <div>
        <label htmlFor="tier" className="block text-sm font-medium text-ink/75">
          Type
        </label>
        <select
          id="tier"
          name="tier"
          defaultValue={partner?.tier ?? "partner"}
          className="mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        >
          <option value="partner">Partner</option>
          <option value="sponsor">Sponsor</option>
        </select>
      </div>
      <ImageUploadField name="logo" label="Logo" currentUrl={partner?.logoUrl} />
      <Input name="sortOrder" label="Sort order" type="number" defaultValue={String(partner?.sortOrder ?? 0)} />
      <label className="flex items-center gap-2 text-sm font-medium text-ink/75">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={partner ? partner.isPublished : true}
          className="h-4 w-4 rounded border-canopy/30 text-canopy focus:ring-canopy"
        />
        Show on the public site
      </label>
      {error && <p className="text-sm text-brand-red">{error}</p>}
      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : partner ? "Save changes" : "Add partner"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/content/partners")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
