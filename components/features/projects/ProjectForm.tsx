"use client"

import { useState, useTransition } from "react"
import { createProject } from "@/app/dashboard/cabinet/actions"
import { COMMUNITIES } from "@/constants/communities"
import { UNITS } from "@/constants/units"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

const SELECT =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"

export default function ProjectForm() {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const res = await createProject(data)
      setMsg(res.ok ? { ok: true, text: "Project proposed." } : { ok: false, text: res.error ?? "Failed." })
      if (res.ok) form.reset()
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {!SUPABASE_READY && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-800">
          Connect Supabase to create live projects.
        </p>
      )}
      {msg && (
        <p className={msg.ok ? "rounded-lg bg-brand-green-50 p-2.5 text-xs text-brand-green-700" : "rounded-lg bg-brand-red-50 p-2.5 text-xs text-brand-red-700"}>
          {msg.text}
        </p>
      )}
      <Input name="name" label="Project name" />
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea name="description" rows={2} className={SELECT} />
      </div>
      <div className="grid grid-cols-2 gap-3">
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
          <label className="block text-sm font-medium text-gray-700">Unit</label>
          <select name="unitId" className={SELECT}>
            <option value="">Select…</option>
            {UNITS.map((u) => (
              <option key={u.no} value={u.no}>{u.name}</option>
            ))}
          </select>
        </div>
      </div>
      <Input name="budgetGhs" type="number" label="Budget (GHS)" placeholder="0" />
      <Button type="submit" disabled={!SUPABASE_READY || pending} className="w-full">
        {pending ? "Submitting…" : "Propose project"}
      </Button>
    </form>
  )
}
