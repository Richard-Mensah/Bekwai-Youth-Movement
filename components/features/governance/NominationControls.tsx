"use client"

import { useTransition } from "react"
import { advanceNomination, rejectNomination } from "@/app/dashboard/admin/governance/actions"
import { nextNominationStage, NOMINATION_META, type NominationStage } from "@/constants/governance"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

export default function NominationControls({
  id,
  stage,
}: {
  id: string
  stage: NominationStage
}) {
  const [pending, startTransition] = useTransition()
  const next = nextNominationStage(stage)
  if (stage === "rejected" || !SUPABASE_READY) return null

  return (
    <div className="mt-2 flex gap-1">
      {next && (
        <button
          disabled={pending}
          onClick={() => startTransition(() => advanceNomination(id, stage).then(() => {}))}
          className="rounded bg-brand-green-50 px-2 py-0.5 text-[10px] font-medium text-brand-green-700 hover:bg-brand-green-100 disabled:opacity-50"
        >
          → {NOMINATION_META[next].label}
        </button>
      )}
      <button
        disabled={pending}
        onClick={() => startTransition(() => rejectNomination(id).then(() => {}))}
        className="rounded bg-brand-red-50 px-2 py-0.5 text-[10px] font-medium text-brand-red-700 hover:bg-brand-red-100 disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  )
}
