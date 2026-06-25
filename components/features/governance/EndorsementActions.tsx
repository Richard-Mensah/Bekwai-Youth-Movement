"use client"

import { useState, useTransition } from "react"
import { decideEndorsement } from "@/app/dashboard/admin/governance/actions"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

export default function EndorsementActions({ id }: { id: string }) {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState<string | null>(null)

  function decide(decision: "endorsed" | "declined") {
    if (!SUPABASE_READY) {
      setDone("Connect Supabase")
      return
    }
    startTransition(async () => {
      const res = await decideEndorsement(id, decision)
      setDone(res.ok ? decision : res.error ?? "Failed")
    })
  }

  if (done === "endorsed" || done === "declined") {
    return <span className="text-xs font-medium text-gray-500">Marked {done}.</span>
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={pending}
        onClick={() => decide("endorsed")}
        className="rounded-md bg-brand-green-50 px-3 py-1 text-xs font-medium text-brand-green-700 hover:bg-brand-green-100 disabled:opacity-50"
      >
        Endorse
      </button>
      <button
        disabled={pending}
        onClick={() => decide("declined")}
        className="rounded-md bg-brand-red-50 px-3 py-1 text-xs font-medium text-brand-red-700 hover:bg-brand-red-100 disabled:opacity-50"
      >
        Decline
      </button>
      {done && <span className="text-[11px] text-gray-400">{done}</span>}
    </div>
  )
}
