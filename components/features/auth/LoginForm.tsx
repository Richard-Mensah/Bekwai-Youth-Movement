"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { loginSchema } from "@/lib/validations"
import Input from "@/components/ui/Input"
import PasswordInput from "@/components/ui/PasswordInput"
import Button from "@/components/ui/Button"
import AuthNotice from "./AuthNotice"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

/** Only allow same-site relative redirects (avoid open-redirect). */
function safeNext(v: string | null): string {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/dashboard"
}

export default function LoginForm() {
  const router = useRouter()
  const next = safeNext(useSearchParams().get("next"))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [resent, setResent] = useState(false)

  /** Supabase returns this whenever the address exists but the password is
   *  wrong — and, identically, when no such account exists. */
  const wrongPassword = /invalid login credentials/i.test(serverError)
  const unconfirmed = /email not confirmed/i.test(serverError)

  async function resendConfirmation() {
    setResent(true)
    await createClient().auth.resend({ type: "signup", email })
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
    setResent(false)
    const form = new FormData(e.currentTarget)
    const parsed = loginSchema.safeParse(Object.fromEntries(form.entries()))

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

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)
    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-green-700">Sign in</h1>
      <p className="mt-1 text-sm text-gray-500">
        Access your BYM dashboard.
      </p>

      {!SUPABASE_READY && <div className="mt-4"><AuthNotice /></div>}
      {serverError && (
        <div className="mt-4 rounded-lg bg-brand-red-50 p-3 text-sm text-brand-red-700">
          {wrongPassword ? (
            <>
              <p className="font-medium">
                That email and password don&apos;t match a BYM account.
              </p>
              <p className="mt-1 text-brand-red-700/85">
                Check the password with the eye icon below — or{" "}
                <Link
                  href={`/forgot-password${
                    email ? `?email=${encodeURIComponent(email)}` : ""
                  }`}
                  className="font-medium underline"
                >
                  email yourself a reset link
                </Link>
                .
              </p>
            </>
          ) : unconfirmed ? (
            <>
              <p className="font-medium">Your email isn&apos;t confirmed yet.</p>
              <p className="mt-1 text-brand-red-700/85">
                Open the link we sent when you joined.{" "}
                {resent ? (
                  <span className="font-medium">Sent again — check your inbox.</span>
                ) : (
                  <button
                    type="button"
                    onClick={resendConfirmation}
                    className="font-medium underline"
                  >
                    Send it again
                  </button>
                )}
              </p>
            </>
          ) : (
            <p>{serverError}</p>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          name="email"
          type="email"
          label="Email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <PasswordInput
          name="password"
          label="Password"
          autoComplete="current-password"
          error={errors.password}
        />
        <div className="text-right">
          <Link
            href="/forgot-password"
            className="text-xs font-medium text-canopy hover:underline dark:text-paper/70"
          >
            Forgot your password?
          </Link>
        </div>
        <Button type="submit" disabled={!SUPABASE_READY || loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Not a member yet?{" "}
        <Link
          href={`/join${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-brand-green hover:underline"
        >
          Join BYM
        </Link>
      </p>
    </div>
  )
}
