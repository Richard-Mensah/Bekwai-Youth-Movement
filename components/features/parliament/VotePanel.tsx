"use client"

import { useEffect, useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { castVote } from "@/app/dashboard/mp/actions"
import { VOTE_CHOICES, type VoteChoice } from "@/constants/parliament"
import type { VoteTally } from "@/lib/data/parliament"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

type Props = { billId: string; initial: VoteTally }

export default function VotePanel({ billId, initial }: Props) {
  const [tally, setTally] = useState<VoteTally>(initial)
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState("")

  const total = tally.aye + tally.no + tally.abstain

  useEffect(() => {
    if (!SUPABASE_READY) return
    const supabase = createClient()

    async function refetch() {
      const { data } = await supabase
        .from("votes")
        .select("choice")
        .eq("bill_id", billId)
      const next: VoteTally = { aye: 0, no: 0, abstain: 0 }
      for (const v of data ?? []) next[v.choice as VoteChoice]++
      setTally(next)
    }

    const channel = supabase
      .channel(`votes-${billId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "votes", filter: `bill_id=eq.${billId}` },
        refetch
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [billId])

  function vote(choice: VoteChoice) {
    if (!SUPABASE_READY) {
      setNote("Connect Supabase to record live votes.")
      return
    }
    startTransition(async () => {
      const res = await castVote(billId, choice)
      setNote(res.ok ? "Your vote was recorded." : res.error ?? "Vote failed.")
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-brand-green-700">Live voting</h3>
        <span className="text-xs text-gray-400">{total} votes</span>
      </div>

      <div className="mt-4 space-y-2">
        {VOTE_CHOICES.map((c) => {
          const count = tally[c.value]
          const pct = total ? Math.round((count / total) * 100) : 0
          return (
            <div key={c.value}>
              <div className="flex justify-between text-xs text-gray-600">
                <span>{c.label}</span>
                <span>{count} · {pct}%</span>
              </div>
              <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: c.color }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {VOTE_CHOICES.map((c) => (
          <button
            key={c.value}
            onClick={() => vote(c.value)}
            disabled={pending}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            {c.label}
          </button>
        ))}
      </div>
      {note && <p className="mt-3 text-xs text-gray-500">{note}</p>}
      {SUPABASE_READY && (
        <p className="mt-2 text-[11px] text-brand-green">● Live — updates in real time</p>
      )}
    </div>
  )
}
