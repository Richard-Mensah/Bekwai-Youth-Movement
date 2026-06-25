"use client"

import { useState, useTransition } from "react"
import { createBill, createMotion } from "@/app/dashboard/mp/actions"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

const SELECT =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"

type Kind = "bill" | "motion"

/** Submit new Parliamentary business — a Bill or a Motion. */
export default function BillForm() {
  const [kind, setKind] = useState<Kind>("bill")
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const res = kind === "bill" ? await createBill(data) : await createMotion(data)
      setMsg(res.ok ? { ok: true, text: `${kind} submitted.` } : { ok: false, text: res.error ?? "Failed." })
      if (res.ok) form.reset()
    })
  }

  return (
    <div>
      <div className="mb-3 inline-flex rounded-lg border border-gray-200 p-0.5 text-xs">
        {(["bill", "motion"] as Kind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={
              kind === k
                ? "rounded-md bg-brand-green px-3 py-1 font-medium text-white"
                : "px-3 py-1 font-medium text-gray-600"
            }
          >
            {k === "bill" ? "Bill" : "Motion"}
          </button>
        ))}
      </div>

      {!SUPABASE_READY && (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          Connect Supabase to submit live business.
        </p>
      )}
      {msg && (
        <p className={msg.ok ? "mb-3 rounded-lg bg-brand-green-50 p-2.5 text-xs text-brand-green-700" : "mb-3 rounded-lg bg-brand-red-50 p-2.5 text-xs text-brand-red-700"}>
          {msg.text}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <Input name="title" label="Title" />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {kind === "bill" ? "Summary" : "Body"}
          </label>
          <textarea name={kind === "bill" ? "summary" : "body"} rows={3} className={SELECT} />
        </div>
        <Button type="submit" disabled={!SUPABASE_READY || pending} className="w-full">
          {pending ? "Submitting…" : `Submit ${kind}`}
        </Button>
      </form>
    </div>
  )
}
