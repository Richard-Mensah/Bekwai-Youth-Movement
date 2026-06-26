"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { togglePostPublish, deletePost } from "./actions"

export default function PostRowActions({
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
            await togglePostPublish(id, !published)
            router.refresh()
          })
        }
        className="text-xs font-semibold text-canopy hover:underline disabled:opacity-50"
      >
        {published ? "Unpublish" : "Publish"}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (confirm("Delete this post? This cannot be undone.")) {
            start(async () => {
              await deletePost(id)
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
