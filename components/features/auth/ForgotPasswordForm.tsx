"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MailCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import AuthNotice from "./AuthNotice"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

export default function ForgotPasswordForm() {
  // Carried over from the sign-in page so a stuck member does not retype it.
  const prefill = useSearchParams().get("email") ?? ""
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim()
    if (!email) {
      setError("Enter the email address you registered with.")
      return
    }

    setLoading(true)
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      // Via /auth/callback, not straight to /reset-password: the reset link
      // carries the same unredeemed code the signup link does, so that page's
      // getSession() would find nothing and report a perfectly good link as
      // invalid.
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        "/reset-password"
      )}`,
    })
    setLoading(false)

    // Deliberately shown even when the address is not registered: confirming
    // which emails have accounts would let anyone enumerate our membership.
    if (error) setError(friendlyAuthError(error.message))
    else setSent(true)
  }

  if (sent) {
    return (
      <div className="surface p-8 text-center shadow-elevated">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-50 text-brand-green">
          <MailCheck size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-canopy dark:text-paper">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
          If that email belongs to a BYM member, a reset link is on its way. The
          link works once and expires after an hour, so open it on this device.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
          Nothing after a few minutes? Check your spam folder, then try again.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="surface p-8 shadow-elevated">
      <h1 className="font-display text-2xl font-bold text-canopy dark:text-paper">
        Reset your password
      </h1>
      <p className="mt-1 text-sm text-ink/60 dark:text-paper/55">
        We&apos;ll email you a link to choose a new one.
      </p>

      {!SUPABASE_READY && (
        <div className="mt-4">
          <AuthNotice />
        </div>
      )}
      {error && (
        <p className="mt-4 rounded-lg bg-brand-red-50 p-3 text-sm text-brand-red-700">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          defaultValue={prefill}
          hint="The address you used when you joined BYM."
        />
        <Button type="submit" disabled={!SUPABASE_READY || loading} className="w-full">
          {loading ? "Sending…" : "Send reset link"}
        </Button>
      </form>

      <p className="mt-6 border-t border-canopy/[0.08] pt-5 text-center text-sm text-ink/55 dark:border-white/[0.08] dark:text-paper/55">
        Remembered it?{" "}
        <Link
          href="/login"
          className="font-semibold text-canopy hover:underline dark:text-gold-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
