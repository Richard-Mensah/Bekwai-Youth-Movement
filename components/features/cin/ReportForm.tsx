"use client"

import { useState, useTransition } from "react"
import { createCinReport } from "@/app/dashboard/cin/actions"
import { CIN_CATEGORIES, SEVERITIES } from "@/constants/cin"
import { COMMUNITIES } from "@/constants/communities"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

const SELECT =
  "mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"

export default function ReportForm({ defaultCommunityId }: { defaultCommunityId?: number }) {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    startTransition(async () => {
      const res = await createCinReport(data)
      if (res.ok) {
        setMessage({ ok: true, text: "Report submitted." })
        form.reset()
      } else {
        setMessage({ ok: false, text: res.error ?? "Could not submit." })
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {!SUPABASE_READY && (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
          Connect Supabase to submit live reports. Fields are previewable below.
        </p>
      )}
      {message && (
        <p
          className={
            message.ok
              ? "rounded-lg bg-brand-green-50 p-3 text-sm text-brand-green-700"
              : "rounded-lg bg-brand-red-50 p-3 text-sm text-brand-red-700"
          }
        >
          {message.text}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Category</label>
          <select name="category" className={SELECT}>
            <option value="">Select…</option>
            {CIN_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Severity</label>
          <select name="severity" className={SELECT} defaultValue="medium">
            {SEVERITIES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Community</label>
        <select name="communityId" className={SELECT} defaultValue={defaultCommunityId ?? ""}>
          <option value="">Select…</option>
          {COMMUNITIES.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={3}
          className={SELECT}
          placeholder="Describe the community issue…"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Evidence photo (optional)
        </label>
        <input
          type="file"
          name="evidence"
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand-green-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-green"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input name="gpsLat" label="GPS latitude (optional)" placeholder="6.45" />
        <Input name="gpsLng" label="GPS longitude (optional)" placeholder="-2.33" />
      </div>

      <Button type="submit" disabled={!SUPABASE_READY || pending} className="w-full">
        {pending ? "Submitting…" : "Submit monthly report"}
      </Button>
    </form>
  )
}
