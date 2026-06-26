"use client"

import { useState, useTransition } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import Input from "@/components/ui/Input"
import { submitContact } from "@/app/actions/contact"

const TOPICS = [
  "Partnership / collaboration",
  "Media / press",
  "Membership",
  "Community engagement",
  "Other",
]

/** Sends a contact enquiry to Supabase (contact_messages) via a server action. */
export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const message = String(data.get("message") ?? "").trim()

    const next: Record<string, string> = {}
    if (!name) next.name = "Please enter your name."
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email."
    if (!message) next.message = "Please enter a short message."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    startTransition(async () => {
      const res = await submitContact(data)
      if (res.ok) setDone(true)
      else setServerError(res.error ?? "Something went wrong.")
    })
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-gold-200 bg-gold-50 p-8 text-center">
        <CheckCircle2 size={36} className="text-gold-600" />
        <h3 className="mt-3 font-display text-xl font-semibold text-canopy">
          Message sent
        </h3>
        <p className="mt-1 text-sm text-ink/65">
          Thank you for reaching out — the Secretariat will get back to you soon.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Your name" name="name" placeholder="Full name" error={errors.name} />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          error={errors.email}
        />
      </div>

      <div>
        <label htmlFor="topic" className="block text-sm font-medium text-ink/75">
          Reason for contact
        </label>
        <select
          id="topic"
          name="topic"
          className="mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        >
          {TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink/75">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          placeholder="How can the Secretariat help?"
          className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
        />
        {errors.message && (
          <p className="mt-1 text-xs text-brand-red">{errors.message}</p>
        )}
      </div>

      {serverError && <p className="text-sm text-brand-red">{serverError}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-canopy px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-canopy-600 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
        {!pending && <Send size={16} />}
      </button>
    </form>
  )
}
