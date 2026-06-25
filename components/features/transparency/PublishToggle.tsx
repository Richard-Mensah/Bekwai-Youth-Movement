"use client"

import { useState, useTransition } from "react"
import { togglePublish } from "@/app/dashboard/admin/transparency/actions"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

type Table =
  | "published_budgets"
  | "community_scorecards"
  | "public_reports"
  | "annual_reports"

type Props = { table: Table; id: string; isPublished: boolean }

export default function PublishToggle({ table, id, isPublished }: Props) {
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState("")

  function toggle() {
    if (!SUPABASE_READY) {
      setNote("Connect Supabase")
      return
    }
    startTransition(async () => {
      const res = await togglePublish(table, id, !isPublished)
      if (!res.ok) setNote(res.error ?? "Failed")
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggle}
        disabled={pending}
        className={
          isPublished
            ? "rounded-full bg-brand-green-50 px-3 py-1 text-xs font-medium text-brand-green-700 ring-1 ring-inset ring-brand-green-100 disabled:opacity-50"
            : "rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500 ring-1 ring-inset ring-gray-200 disabled:opacity-50"
        }
      >
        {pending ? "…" : isPublished ? "Published — unpublish" : "Draft — publish"}
      </button>
      {note && <span className="text-[11px] text-gray-400">{note}</span>}
    </div>
  )
}
