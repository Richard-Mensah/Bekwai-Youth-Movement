"use client"

import { useState, useTransition } from "react"
import { advanceBillStage } from "@/app/dashboard/mp/actions"
import { nextStage, BILL_STATUS_META } from "@/constants/parliament"
import type { BillStatus } from "@/types"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

type Props = { billId: string; status: BillStatus }

/** Speaker/Clerk action to move a bill to the next reading. */
export default function AdvanceStageButton({ billId, status }: Props) {
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState("")
  const next = nextStage(status)

  if (!next) {
    return <p className="text-xs text-gray-400">Bill is at its final stage.</p>
  }

  function advance() {
    if (!SUPABASE_READY) {
      setNote("Connect Supabase to advance bills.")
      return
    }
    startTransition(async () => {
      const res = await advanceBillStage(billId, status)
      if (!res.ok) setNote(res.error ?? "Failed.")
    })
  }

  return (
    <div>
      <Button onClick={advance} disabled={pending} size="sm">
        {pending ? "Advancing…" : `Advance to ${BILL_STATUS_META[next].label}`}
      </Button>
      {note && <p className="mt-2 text-xs text-gray-500">{note}</p>}
    </div>
  )
}
