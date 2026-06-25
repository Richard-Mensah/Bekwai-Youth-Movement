"use client"

import { useState, useTransition } from "react"
import {
  createPublicReport,
  createAnnualReport,
  createBudget,
} from "@/app/dashboard/admin/transparency/actions"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

const SELECT =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"

type Kind = "report" | "annual" | "budget"
const TABS: { value: Kind; label: string }[] = [
  { value: "report", label: "Public report" },
  { value: "annual", label: "Annual report" },
  { value: "budget", label: "Budget" },
]

export default function TransparencyForm() {
  const [kind, setKind] = useState<Kind>("report")
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const action =
        kind === "report" ? createPublicReport : kind === "annual" ? createAnnualReport : createBudget
      const res = await action(data)
      setMsg(res.ok ? { ok: true, text: "Created as draft." } : { ok: false, text: res.error ?? "Failed." })
      if (res.ok) form.reset()
    })
  }

  return (
    <div>
      <div className="mb-3 inline-flex flex-wrap rounded-lg border border-gray-200 p-0.5 text-xs">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setKind(t.value)}
            className={
              kind === t.value
                ? "rounded-md bg-brand-green px-3 py-1 font-medium text-white"
                : "px-3 py-1 font-medium text-gray-600"
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {!SUPABASE_READY && (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          Connect Supabase to create records.
        </p>
      )}
      {msg && (
        <p className={msg.ok ? "mb-3 rounded-lg bg-brand-green-50 p-2.5 text-xs text-brand-green-700" : "mb-3 rounded-lg bg-brand-red-50 p-2.5 text-xs text-brand-red-700"}>
          {msg.text}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-3">
        <Input name="title" label="Title" />
        {kind === "report" && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Summary</label>
            <textarea name="summary" rows={2} className={SELECT} />
          </div>
        )}
        {kind === "annual" && (
          <Input name="year" type="number" label="Year" placeholder="2026" />
        )}
        {kind === "budget" && (
          <div className="grid grid-cols-3 gap-3">
            <Input name="fiscalYear" type="number" label="Fiscal year" placeholder="2026" />
            <Input name="income" type="number" label="Income (GHS)" />
            <Input name="expenditure" type="number" label="Expenditure (GHS)" />
          </div>
        )}
        <Button type="submit" disabled={!SUPABASE_READY || pending} size="sm">
          {pending ? "Saving…" : "Create draft"}
        </Button>
      </form>
    </div>
  )
}
