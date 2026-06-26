"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { setMessageStatus } from "./actions"

export default function MessageStatusActions({
  id,
  status,
}: {
  id: string
  status: string
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const go = (s: string) =>
    start(async () => {
      await setMessageStatus(id, s)
      router.refresh()
    })

  return (
    <div className="flex items-center gap-3">
      {status !== "read" && status !== "archived" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => go("read")}
          className="text-xs font-semibold text-canopy hover:underline disabled:opacity-50"
        >
          Mark read
        </button>
      )}
      {status !== "archived" ? (
        <button
          type="button"
          disabled={pending}
          onClick={() => go("archived")}
          className="text-xs font-semibold text-ink/50 hover:underline disabled:opacity-50"
        >
          Archive
        </button>
      ) : (
        <button
          type="button"
          disabled={pending}
          onClick={() => go("new")}
          className="text-xs font-semibold text-canopy hover:underline disabled:opacity-50"
        >
          Restore
        </button>
      )}
    </div>
  )
}
