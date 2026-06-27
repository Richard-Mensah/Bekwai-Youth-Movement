"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toggleMemberPublic } from "./actions"

export default function MemberPublicToggle({
  id,
  isPublic,
  disabled,
}: {
  id: string
  isPublic: boolean
  disabled?: boolean
}) {
  const router = useRouter()
  const [pending, start] = useTransition()

  return (
    <button
      type="button"
      disabled={pending || disabled}
      title={
        disabled
          ? "Only verified members appear on the homepage"
          : isPublic
            ? "Visible on the homepage wall — click to hide"
            : "Hidden from the homepage wall — click to show"
      }
      onClick={() =>
        start(async () => {
          await toggleMemberPublic(id, !isPublic)
          router.refresh()
        })
      }
      className="text-xs font-semibold text-canopy hover:underline disabled:opacity-40"
    >
      {isPublic ? "On site" : "Hidden"}
    </button>
  )
}
