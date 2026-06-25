"use client"

import { useState, useTransition } from "react"
import { createNomination } from "@/app/dashboard/admin/governance/actions"
import { COMMUNITIES } from "@/constants/communities"
import { SEAT_TYPES, SEAT_LABEL } from "@/constants/governance"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

const SELECT =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"

export default function NominationForm() {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const res = await createNomination(data)
      setMsg(res.ok ? { ok: true, text: "Nomination added." } : { ok: false, text: res.error ?? "Failed." })
      if (res.ok) form.reset()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {!SUPABASE_READY && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          Connect Supabase to add nominations.
        </p>
      )}
      {msg && (
        <p className={msg.ok ? "rounded-lg bg-brand-green-50 p-2.5 text-xs text-brand-green-700" : "rounded-lg bg-brand-red-50 p-2.5 text-xs text-brand-red-700"}>
          {msg.text}
        </p>
      )}
      <Input name="fullName" label="Nominee full name" />
      <div>
        <label className="block text-sm font-medium text-gray-700">Community</label>
        <select name="communityId" className={SELECT}>
          <option value="">Select…</option>
          {COMMUNITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Seat</label>
        <select name="seatType" className={SELECT}>
          <option value="">Select…</option>
          {SEAT_TYPES.map((s) => (
            <option key={s} value={s}>{SEAT_LABEL[s]}</option>
          ))}
        </select>
      </div>
      <Input name="nominatedBy" label="Nominated by (optional)" />
      <Button type="submit" disabled={!SUPABASE_READY || pending} size="sm">
        {pending ? "Adding…" : "Add nomination"}
      </Button>
    </form>
  )
}
