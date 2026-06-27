"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { togglePartnerPublish, deletePartner } from "./actions"

export default function PartnerRowActions({
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
            await togglePartnerPublish(id, !published)
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
          if (confirm("Delete this partner?")) {
            start(async () => {
              await deletePartner(id)
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
