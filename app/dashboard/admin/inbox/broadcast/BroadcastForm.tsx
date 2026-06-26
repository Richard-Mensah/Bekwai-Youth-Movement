"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Send } from "lucide-react"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { sendBroadcast } from "./actions"

export default function BroadcastForm({
  subscriberCount,
  emailReady,
}: {
  subscriberCount: number
  emailReady: boolean
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    start(async () => {
      const res = await sendBroadcast(fd)
      setMsg(
        res.ok
          ? { ok: true, text: "Broadcast sent to subscribers." }
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
      className="max-w-2xl space-y-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card"
    >
      {!emailReady && (
        <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
          Email isn&apos;t configured (RESEND_API_KEY). You can compose now — it
          will be saved as a draft until Resend is set up.
        </p>
      )}
      <p className="text-sm text-ink/65">
        Sending to <strong>{subscriberCount}</strong> subscriber
        {subscriberCount === 1 ? "" : "s"}.
      </p>
      <Input name="subject" label="Subject" placeholder="What's new at BYM" required />
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-ink/75">
          Message
        </label>
        <textarea
          id="body"
          name="body"
          rows={10}
          placeholder="Write your update to the community…"
          className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        />
      </div>
      {msg && (
        <p className={msg.ok ? "text-sm text-brand-green" : "text-sm text-brand-red"}>
          {msg.text}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        <Send size={16} /> {pending ? "Sending…" : emailReady ? "Send broadcast" : "Save draft"}
      </Button>
    </form>
  )
}
