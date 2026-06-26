"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toggleLeaderPublish, deleteLeader } from "./actions"

export default function LeaderRowActions({
  id,
  published,
}: {
  id: string
  published: boolean
}) {
  const router = useRouter()
  const [pending, start] = useTransition()

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          start(async () => {
            await toggleLeaderPublish(id, !published)
            router.refresh()
          })
        }
        className="text-xs font-semibold text-canopy hover:underline disabled:opacity-50"
      >
        {published ? "Hide" : "Show"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Remove this person?")) {
            start(async () => {
              await deleteLeader(id)
              router.refresh()
            })
          }
        }}
        className="text-xs font-semibold text-brand-red hover:underline disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  )
}
