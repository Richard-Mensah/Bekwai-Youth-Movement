"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { updateCommunityDetails } from "./actions"
import type { CommunityDetail } from "@/lib/data/content"

const TEXTAREA =
  "mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"

export default function CommunityDetailsForm({
  community,
}: {
  community: CommunityDetail
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg(null)
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = await updateCommunityDetails(fd)
      setMsg(
        res.ok
          ? { ok: true, text: "Community details saved." }
          : { ok: false, text: res.error ?? "Failed to save." }
      )
      if (res.ok) router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
      <input type="hidden" name="id" value={community.id} />

      <Input name="name" label="Community name" defaultValue={community.name} required />

      <div>
        <label htmlFor="about" className="block text-sm font-medium text-ink/75">
          About this community
        </label>
        <textarea
          id="about"
          name="about"
          rows={4}
          defaultValue={community.about ?? ""}
          placeholder="A short description shown at the top of the community page."
          className={TEXTAREA}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input name="chief" label="Chief (name)" defaultValue={community.chief ?? ""} />
        <Input
          name="chiefTitle"
          label="Chief title"
          defaultValue={community.chiefTitle ?? ""}
          placeholder={community.isTown ? "Paramount Chief" : "Sub-Chief"}
        />
      </div>

      <div>
        <label htmlFor="elders" className="block text-sm font-medium text-ink/75">
          Elders (one per line)
        </label>
        <textarea
          id="elders"
          name="elders"
          rows={4}
          defaultValue={community.elders.join("\n")}
          placeholder={"Nana Kwesi\nMaame Yaa\n…"}
          className={TEXTAREA}
        />
      </div>

      {msg && (
        <p className={msg.ok ? "text-sm text-brand-green" : "text-sm text-brand-red"}>
          {msg.text}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save details"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/dashboard/admin/content/communities")}
        >
          Back
        </Button>
        <Button href={`/communities/${community.slug}`} variant="ghost">
          View public page
        </Button>
      </div>
    </form>
  )
}
