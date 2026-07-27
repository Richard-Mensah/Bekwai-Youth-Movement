"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, Undo2, X } from "lucide-react"
import Badge from "@/components/ui/Badge"
import { setMemberVerification } from "./actions"
import type { VerificationStatus } from "@/types"

const TONE: Record<string, "green" | "amber" | "red" | "gray"> = {
  verified: "green",
  pending: "amber",
  rejected: "red",
}

/**
 * The verification decision, made inline in the directory.
 *
 * Rejecting asks for confirmation because it emails the person to say they were
 * turned down; approving does not, since it is the expected outcome and is
 * reversible from the same control.
 */
export default function MemberStatusActions({
  id,
  name,
  status,
}: {
  id: string
  name: string
  status: string
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [confirmingReject, setConfirmingReject] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function decide(next: VerificationStatus) {
    setError(null)
    start(async () => {
      const res = await setMemberVerification(id, next)
      if (res.ok) {
        setConfirmingReject(false)
        router.refresh()
      } else {
        setError(res.error ?? "Could not save that.")
      }
    })
  }

  return (
    <div className="min-w-[9rem]">
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={TONE[status] ?? "gray"}>{status}</Badge>
        {pending && <Loader2 size={13} className="animate-spin text-ink/40" />}
      </div>

      {!pending && (
        <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-semibold">
          {status !== "verified" && (
            <button
              type="button"
              onClick={() => decide("verified")}
              className="inline-flex items-center gap-1 text-brand-green hover:underline"
            >
              <Check size={12} /> Verify
            </button>
          )}

          {status === "pending" &&
            (confirmingReject ? (
              <span className="inline-flex items-center gap-2">
                <span className="font-normal text-ink/55">
                  Reject {name.split(" ")[0] || "them"}?
                </span>
                <button
                  type="button"
                  onClick={() => decide("rejected")}
                  className="text-brand-red hover:underline"
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmingReject(false)}
                  className="text-ink/55 hover:underline"
                >
                  No
                </button>
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmingReject(true)}
                className="inline-flex items-center gap-1 text-brand-red hover:underline"
              >
                <X size={12} /> Reject
              </button>
            ))}

          {status !== "pending" && (
            <button
              type="button"
              onClick={() => decide("pending")}
              className="inline-flex items-center gap-1 text-ink/50 hover:underline"
            >
              <Undo2 size={12} /> Undo
            </button>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-brand-red">{error}</p>}
    </div>
  )
}
