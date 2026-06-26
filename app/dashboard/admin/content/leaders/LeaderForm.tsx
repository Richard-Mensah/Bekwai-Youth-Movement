"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import { createLeader, updateLeader } from "./actions"
import type { LeaderItem } from "@/lib/data/content"

const TIERS: [string, string][] = [
  ["cabinet", "Executive Cabinet"],
  ["parliament", "Youth Parliament"],
  ["cin", "Community Intelligence"],
  ["tac", "Traditional Advisory Council"],
]

export default function LeaderForm({ leader }: { leader?: LeaderItem }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = leader ? await updateLeader(fd) : await createLeader(fd)
      if (res.ok) {
        router.push("/dashboard/admin/content/leaders")
        router.refresh()
      } else setError(res.error ?? "Something went wrong.")
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      {leader && <input type="hidden" name="id" value={leader.id} />}

      <div>
        <label htmlFor="tier" className="block text-sm font-medium text-ink/75">
          Tier
        </label>
        <select
          id="tier"
          name="tier"
          defaultValue={leader?.tier ?? "cabinet"}
          className="mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        >
          {TIERS.map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
      </div>

      <Input name="title" label="Role / position title" defaultValue={leader?.title} required />
      <Input name="name" label="Person's name (optional)" defaultValue={leader?.name ?? ""} />
      <Input
        name="ukEquivalent"
        label="Equivalent / subtitle (optional)"
        defaultValue={leader?.ukEquivalent ?? ""}
      />

      <div>
        <label htmlFor="blurb" className="block text-sm font-medium text-ink/75">
          Portfolio / bio
        </label>
        <textarea
          id="blurb"
          name="blurb"
          rows={3}
          defaultValue={leader?.blurb ?? ""}
          className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        />
      </div>

      <ImageUploadField name="photo" label="Headshot" currentUrl={leader?.photoUrl} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          name="sdg"
          label="SDG numbers (comma separated)"
          defaultValue={leader?.sdg.join(", ")}
          placeholder="16, 17"
        />
        <Input
          name="sortOrder"
          label="Sort order"
          type="number"
          defaultValue={String(leader?.sortOrder ?? 0)}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink/75">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={leader ? leader.isPublished : true}
          className="h-4 w-4 rounded border-canopy/30 text-canopy focus:ring-canopy"
        />
        Show on the public site
      </label>

      {error && <p className="text-sm text-brand-red">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : leader ? "Save changes" : "Add person"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/content/leaders")}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}
