"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CircleAlert, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { newPasswordSchema } from "@/lib/validations"
import PasswordInput from "@/components/ui/PasswordInput"
import Button from "@/components/ui/Button"

type LinkState = "checking" | "valid" | "invalid"

export default function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [linkState, setLinkState] = useState<LinkState>("checking")
  const [linkError, setLinkError] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  // Supabase bounces the emailed link back here with a one-time code, which the
  // browser client exchanges for a short-lived recovery session automatically.
  // getSession() waits for that exchange to finish, so a session here means the
  // link was genuine, unused and unexpired — that is what gates the form.
  useEffect(() => {
    const description = params.get("error_description")
    if (description) {
      setLinkError(description.replace(/\+/g, " "))
      setLinkState("invalid")
      return
    }

    let cancelled = false
    createClient()
      .auth.getSession()
      .then(({ data }) => {
        if (cancelled) return
        setLinkState(data.session ? "valid" : "invalid")
      })
    return () => {
      cancelled = true
    }
  }, [params])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
    const form = new FormData(e.currentTarget)
    const parsed = newPasswordSchema.safeParse(Object.fromEntries(form.entries()))

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const { error } = await createClient().auth.updateUser({
      password: parsed.data.password,
    })
    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }
    // The recovery session is a real session, so they are already signed in.
    router.push("/dashboard")
    router.refresh()
  }

  if (linkState === "checking") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-canopy/10 bg-white p-8 text-sm text-ink/60 shadow-sm">
        <Loader2 size={16} className="animate-spin" /> Checking your link…
      </div>
    )
  }

  if (linkState === "invalid") {
    return (
      <div className="rounded-2xl border border-canopy/10 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-red-50 text-brand-red">
          <CircleAlert size={28} />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold text-canopy">
          This link cannot be used
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink/65">
          {linkError ||
            "Reset links work once and expire after an hour. Open the link on the same device you requested it from — if you opened it elsewhere, just request a fresh one."}
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-block rounded-lg bg-canopy px-5 py-2.5 text-sm font-medium text-white hover:bg-canopy-600"
        >
          Send a new link
        </Link>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-canopy/10 bg-white p-8 shadow-sm">
      <h1 className="font-display text-2xl font-bold text-canopy">
        Choose a new password
      </h1>
      <p className="mt-1 text-sm text-ink/60">
        You&apos;ll be signed in as soon as it is saved.
      </p>

      {serverError && (
        <p className="mt-4 rounded-lg bg-brand-red-50 p-3 text-sm text-brand-red-700">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <PasswordInput
          name="password"
          label="New password"
          autoComplete="new-password"
          error={errors.password}
          hint="At least 8 characters. Use the eye to check what you typed."
        />
        <PasswordInput
          name="confirmPassword"
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword}
        />
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving…" : "Save password"}
        </Button>
      </form>
    </div>
  )
}
