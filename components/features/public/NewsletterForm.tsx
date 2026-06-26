"use client"

import { useState, useTransition } from "react"
import { ArrowRight, Check } from "lucide-react"
import { subscribeNewsletter } from "@/app/actions/newsletter"

export default function NewsletterForm() {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    startTransition(async () => {
      const res = await subscribeNewsletter(formData)
      if (res.ok) {
        setDone(true)
      } else {
        setError(res.error ?? "Something went wrong.")
      }
    })
  }

  if (done) {
    return (
      <div className="flex w-full max-w-md items-center gap-2.5 rounded-full border border-gold-400/40 bg-white/5 px-5 py-3 text-sm text-white md:ml-auto">
        <Check size={18} className="text-gold-300" />
        You&apos;re on the list — thank you for joining the movement.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md md:ml-auto" noValidate>
      <div className="flex gap-2">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-400/60 focus:outline-none"
        />
        <button
          type="submit"
          disabled={pending}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-400 px-5 py-3 text-sm font-semibold text-canopy transition-colors hover:bg-gold-300 disabled:opacity-60"
        >
          {pending ? "Joining…" : "Subscribe"}
          {!pending && <ArrowRight size={16} />}
        </button>
      </div>
      {error && <p className="mt-2 px-2 text-xs text-gold-200">{error}</p>}
    </form>
  )
}
