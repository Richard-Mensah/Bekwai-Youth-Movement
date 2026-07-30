"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { MailCheck } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"
import { safeNext } from "@/lib/auth-redirect"
import Button from "@/components/ui/Button"

/**
 * Where a new member waits for their confirmation link.
 *
 * This page is the whole funnel's narrowest point, and it used to be a dead end:
 * it named no address, so someone who mistyped their email had no way to notice,
 * and it offered no way to send the link again, so anyone whose mail was slow or
 * filtered had only one move left — register again, which fails with "already
 * registered". Of the first ten members, six never once signed in. Delivery was
 * not the problem by then; having nowhere to go from this page was.
 *
 * So: say which inbox to open, and let them ask again from here.
 */
export default function VerifyPending() {
  const params = useSearchParams()
  const next = safeNext(params.get("next"))
  // Passed by the signup form. Absent if someone reaches this page directly, in
  // which case we ask for the address rather than guess at it.
  const email = params.get("email") ?? ""

  const [state, setState] = useState<"idle" | "sending" | "sent" | "failed">("idle")
  const [error, setError] = useState("")

  async function resend() {
    setState("sending")
    setError("")
    const { error } = await createClient().auth.resend({
      type: "signup",
      email,
      // Must be set. Without it the resent link falls back to the project's Site
      // URL and never reaches /auth/callback, so the second email would confirm
      // the account but leave the member signed out — a different bug from the
      // first email, and one nobody would think to test for.
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      // Never claim it went out without checking: the project-wide hourly email
      // quota is shared between every member, so this genuinely fails.
      setError(friendlyAuthError(error.message))
      setState("failed")
    } else {
      setState("sent")
    }
  }

  return (
    <div className="surface p-8 text-center shadow-elevated">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-canopy text-gold-300 shadow-card">
        <MailCheck size={28} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold text-canopy dark:text-paper">
        Account created
      </h1>

      {email ? (
        <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
          Confirm your address by opening the link we just sent to{" "}
          <strong className="break-all text-canopy dark:text-paper">{email}</strong>.
          It may take a minute, and it may land in spam.
        </p>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
          Confirm your address by opening the link we just emailed you. It may
          take a minute, and it may land in spam.
        </p>
      )}

      <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-paper/60">
        Your membership is then <strong>pending verification</strong> by an
        administrator. Once verified, your role-based dashboard unlocks.
      </p>

      {email && (
        <div className="mt-6 rounded-xl border border-canopy/10 bg-canopy-50/60 p-4 dark:border-white/10 dark:bg-white/[0.04]">
          {state === "sent" ? (
            <p className="text-sm font-medium text-brand-green">
              Sent again — check that inbox, including spam.
            </p>
          ) : (
            <>
              <p className="text-sm text-ink/65 dark:text-paper/60">
                Nothing after a few minutes?
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={resend}
                disabled={state === "sending"}
                className="mt-2.5"
              >
                {state === "sending" ? "Sending…" : "Send the link again"}
              </Button>
              {state === "failed" && (
                <p className="mt-2.5 text-sm text-brand-red-700 dark:text-brand-red-100">
                  {error}
                </p>
              )}
            </>
          )}
          <p className="mt-3 text-xs text-ink/55 dark:text-paper/50">
            Wrong address?{" "}
            <Link href="/join" className="font-semibold underline">
              Register again with the right one
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/login"
          className="rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
        >
          Go to sign in
        </Link>
        <Link
          href="/"
          className="rounded-full border border-canopy/25 px-5 py-2.5 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50 dark:border-white/15 dark:text-paper dark:hover:bg-white/10"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
