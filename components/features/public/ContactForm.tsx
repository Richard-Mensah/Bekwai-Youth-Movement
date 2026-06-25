"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import Input from "@/components/ui/Input"
import { ORG } from "@/constants/nav"

const TOPICS = [
  "Partnership / collaboration",
  "Media / press",
  "Membership",
  "Community engagement",
  "Other",
]

/**
 * Composes a pre-filled email to the Secretariat (mailto). Keeps the contact
 * channel working with no backend; swap for a Supabase insert later if desired.
 */
export default function ContactForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const name = String(data.get("name") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const topic = String(data.get("topic") ?? "")
    const message = String(data.get("message") ?? "").trim()

    const next: Record<string, string> = {}
    if (!name) next.name = "Please enter your name."
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email."
    if (!message) next.message = "Please enter a short message."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    const subject = encodeURIComponent(`[${topic}] enquiry from ${name}`)
    const body = encodeURIComponent(
      `${message}\n\n— ${name}\n${email}`
    )
    window.location.href = `mailto:${ORG.email}?subject=${subject}&body=${body}`
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
        <label
          htmlFor="topic"
          className="block text-sm font-medium text-ink/75"
        >
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
        <label
          htmlFor="message"
          className="block text-sm font-medium text-ink/75"
        >
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

      <button
        type="submit"
        className="inline-flex items-center gap-2 rounded-full bg-canopy px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
      >
        Send message <Send size={16} />
      </button>
      <p className="text-xs text-ink/45">
        This opens your email app with the message pre-filled to {ORG.email}.
      </p>
    </form>
  )
}
