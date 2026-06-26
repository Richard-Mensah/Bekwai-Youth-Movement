"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import { updateCommunityName } from "./actions"
import type { CommunityItem } from "@/lib/data/content"

function Row({ community }: { community: CommunityItem }) {
  const router = useRouter()
  const [name, setName] = useState(community.name)
  const [pending, start] = useTransition()
  const [saved, setSaved] = useState(false)
  const dirty = name !== community.name

  return (
    <div className="flex items-center gap-2 rounded-lg border border-canopy/10 bg-white px-3 py-2">
      <span className="w-6 shrink-0 text-xs text-ink/40">{community.id}</span>
      <input
        value={name}
        onChange={(e) => {
          setName(e.target.value)
          setSaved(false)
        }}
        className="min-w-0 flex-1 rounded-md border border-transparent px-2 py-1 text-sm hover:border-canopy/20 focus:border-canopy focus:outline-none"
      />
      {community.isTown && (
        <span className="shrink-0 rounded-full bg-gold-50 px-2 py-0.5 text-[10px] font-semibold text-gold-700">
          town
        </span>
      )}
      <button
        type="button"
        disabled={pending || !dirty}
        onClick={() =>
          start(async () => {
            const res = await updateCommunityName(community.id, name)
            if (res.ok) {
              setSaved(true)
              router.refresh()
            }
          })
        }
        className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold text-canopy enabled:hover:bg-canopy-50 disabled:opacity-40"
      >
        {saved && !dirty ? <Check size={14} /> : "Save"}
      </button>
    </div>
  )
}

export default function CommunitiesEditor({
  communities,
}: {
  communities: CommunityItem[]
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {communities.map((c) => (
        <Row key={c.id} community={c} />
      ))}
    </div>
  )
}
