"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { loginSchema } from "@/lib/validations"
import { friendlyAuthError } from "@/lib/auth-errors"
import { safeNext } from "@/lib/auth-redirect"
import Input from "@/components/ui/Input"
import PasswordInput from "@/components/ui/PasswordInput"
import Button from "@/components/ui/Button"
import AuthNotice from "./AuthNotice"
import GoogleButton, { AuthDivider } from "./GoogleButton"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const next = safeNext(params.get("next"))
  const [errors, setErrors] = useState<Record<string, string>>({})
  // /auth/callback sends a refused confirmation or reset link back here with the
  // reason attached; showing it beats dropping someone on a blank sign-in page
  // with no idea why their link did not work.
  const [serverError, setServerError] = useState(() => {
    const linkError = params.get("error")
    return linkError ? friendlyAuthError(linkError) : ""
  })
  const [loading, setLoading] = useState(false)
  // Prefilled when another page already knows the address — the signup form
  // sends someone here once it discovers they are a member already, and making
  // them retype it is how you lose them on a phone.
  const [email, setEmail] = useState(() => params.get("email") ?? "")
  const [resent, setResent] = useState<"idle" | "sent" | "failed">("idle")
  const [resendError, setResendError] = useState("")

  /** Supabase returns this whenever the address exists but the password is
   *  wrong — and, identically, when no such account exists. */
  const wrongPassword = /invalid login credentials/i.test(serverError)
  const unconfirmed = /email not confirmed/i.test(serverError)

  /** Never claim the email went out without checking — the project-wide email
   *  quota is shared, so this genuinely fails sometimes. */
  async function resendConfirmation() {
    const { error } = await createClient().auth.resend({
      type: "signup",
      email,
      // Without this the resent link falls back to the project's Site URL and
      // skips /auth/callback — so the second email would behave differently
      // from the first, which is exactly the sort of thing nobody thinks to test.
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setResendError(friendlyAuthError(error.message))
      setResent("failed")
    } else {
      setResent("sent")
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
    setResent("idle")
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
      setServerError(friendlyAuthError(error.message))
      return
    }
    router.push(next)
    router.refresh()
  }

  return (
    <div className="surface relative overflow-hidden p-7 shadow-elevated sm:p-8">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent"
      />
      <h1 className="font-display text-[1.75rem] font-bold tracking-tight text-canopy dark:text-paper">
        Welcome back
      </h1>
      <p className="mt-1.5 text-sm text-ink/55 dark:text-paper/55">
        Sign in to your BYM dashboard.
      </p>

      {!SUPABASE_READY && <div className="mt-4"><AuthNotice /></div>}
      {serverError && (
        <div className="mt-4 rounded-xl border border-brand-red/15 bg-brand-red-50 p-3.5 text-sm text-brand-red-700 dark:border-brand-red/25 dark:bg-brand-red/15 dark:text-brand-red-100">
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
                {resent === "sent" ? (
                  <span className="font-medium">Sent again — check your inbox.</span>
                ) : resent === "failed" ? (
                  <span className="font-medium">{resendError}</span>
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

      {/* Above the password form, not below it: for a returning member this is
          the shorter path, and the one that cannot fail on a forgotten password.
          `next` is already normalised by safeNext at the top of this component. */}
      <div className="mt-7">
        <GoogleButton next={next} label="Sign in with Google" disabled={!SUPABASE_READY} />
      </div>
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="text-xs font-semibold text-ink/55 transition-colors hover:text-canopy hover:underline dark:text-paper/55 dark:hover:text-paper"
          >
            Forgot your password?
          </Link>
        </div>
        <Button type="submit" disabled={!SUPABASE_READY || loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 border-t border-canopy/[0.08] pt-5 text-center text-sm text-ink/55 dark:border-white/[0.08] dark:text-paper/55">
        Not a member yet?{" "}
        <Link
          href={`/join${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-canopy hover:underline dark:text-gold-300"
        >
          Join BYM
        </Link>
      </p>
    </div>
  )
}
