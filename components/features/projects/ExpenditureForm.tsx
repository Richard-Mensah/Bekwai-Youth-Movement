"use client"

import { useState, useTransition } from "react"
import { recordExpenditure } from "@/app/dashboard/cabinet/actions"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

export default function ExpenditureForm({ projectId }: { projectId: string }) {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const res = await recordExpenditure(data)
      setMsg(res.ok ? { ok: true, text: "Expenditure recorded." } : { ok: false, text: res.error ?? "Failed." })
      if (res.ok) form.reset()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="projectId" value={projectId} />
      {!SUPABASE_READY && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          Connect Supabase to record expenditure.
        </p>
      )}
      {msg && (
        <p className={msg.ok ? "rounded-lg bg-brand-green-50 p-2.5 text-xs text-brand-green-700" : "rounded-lg bg-brand-red-50 p-2.5 text-xs text-brand-red-700"}>
          {msg.text}
        </p>
      )}
      <div className="grid grid-cols-2 gap-3">
        <Input name="amountGhs" type="number" label="Amount (GHS)" />
        <Input name="payee" label="Payee" />
      </div>
      <Input name="purpose" label="Purpose" />
      <Button type="submit" disabled={!SUPABASE_READY || pending} size="sm">
        {pending ? "Saving…" : "Record expenditure"}
      </Button>
    </form>
  )
}
