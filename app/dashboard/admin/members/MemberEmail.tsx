"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { emailMembers } from "./actions"

export default function MemberEmail({
  total,
  verified,
  pending,
  emailReady,
}: {
  total: number
  verified: number
  pending: number
  emailReady: boolean
}) {
  const router = useRouter()
  const [pending_, start] = useTransition()
  const [status, setStatus] = useState<"all" | "verified" | "pending">("all")
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  const count = status === "verified" ? verified : status === "pending" ? pending : total

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set("status", status)
    start(async () => {
      const res = await emailMembers(fd)
      setMsg(
        res.ok
          ? { ok: true, text: res.error ?? "Email sent to members." }
          : { ok: false, text: res.error ?? "Failed to send." }
      )
      if (res.ok) {
        form.reset()
        router.refresh()
      }
    })
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card"
    >
      <h3 className="font-display text-base font-semibold text-canopy">
        Email members
      </h3>
      {!emailReady && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Email isn&apos;t configured (RESEND_API_KEY). You can compose now — it
          will be saved as a draft until Resend is set up.
        </p>
      )}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-ink/75">
          Send to
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        >
          <option value="all">All members ({total})</option>
          <option value="verified">Verified only ({verified})</option>
          <option value="pending">Pending only ({pending})</option>
        </select>
      </div>
      <p className="text-sm text-ink/65">
        Sending to <strong>{count}</strong> member{count === 1 ? "" : "s"}.
      </p>
      <Input name="subject" label="Subject" placeholder="An update from BYM" required />
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-ink/75">
          Message
        </label>
        <textarea
          id="body"
          name="body"
          rows={8}
          placeholder="Write your message to members…"
          className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        />
      </div>
      {msg && (
        <p className={msg.ok ? "text-sm text-brand-green" : "text-sm text-brand-red"}>
          {msg.text}
        </p>
      )}
      <Button type="submit" disabled={pending_}>
        <Send size={16} />{" "}
        {pending_ ? "Sending…" : emailReady ? "Send email" : "Save draft"}
      </Button>
    </form>
  )
}
