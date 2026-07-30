"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { friendlyAuthError } from "@/lib/auth-errors"

/**
 * Sign in with Google.
 *
 * The reason this exists: the eight-field registration form is the widest part
 * of the funnel, and the two fields people get wrong are the two this replaces —
 * a mistyped email address (which sends the confirmation somewhere nobody reads)
 * and a password chosen in a hurry and forgotten by the next visit. Google
 * supplies a verified address and remembers the credential, so the member does
 * neither.
 *
 * It deliberately does NOT collect the rest of what BYM needs. Google knows a
 * name and an email; it does not know which of the 33 communities someone belongs
 * to, and community is the unit the Movement's representation is built on. That
 * is what /complete-profile is for — see `app/(auth)/complete-profile`.
 *
 * The redirect target is `/auth/callback`, which already redeems the `?code=`
 * that OAuth returns (it was written for the emailed PKCE links and needs no
 * change). The verifier lives in a cookie written by `@supabase/ssr`, which is
 * why the exchange can happen server-side in that route handler at all.
 */
export default function GoogleButton({
  next,
  label = "Continue with Google",
  disabled,
}: {
  /** Where to land after the exchange. Already passed through `safeNext`. */
  next: string
  label?: string
  disabled?: boolean
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function signIn() {
    setError("")
    setLoading(true)

    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          next
        )}`,
      },
    })

    // On success the browser has already left for Google, so reaching this line
    // at all means it failed. The spinner is only cleared here for that reason —
    // clearing it unconditionally would flash the button back to its resting
    // state during the redirect.
    if (error) {
      setError(friendlyAuthError(error.message))
      setLoading(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={signIn}
        disabled={disabled || loading}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-canopy/20 bg-white px-4 py-2.5 text-sm font-semibold text-ink shadow-sm transition-all hover:-translate-y-0.5 hover:border-canopy/35 hover:shadow-md disabled:pointer-events-none disabled:opacity-55 dark:border-white/15 dark:bg-canopy-700 dark:text-paper dark:hover:border-white/25"
      >
        <GoogleMark />
        {loading ? "Opening Google…" : label}
      </button>
      {error && (
        <p className="mt-2 text-xs text-brand-red" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Google's four-colour G, inline.
 *
 * Inline rather than an <img>: Google's branding terms require the mark to be
 * shown unaltered, and a remote asset is the one thing that can fail to load on
 * a slow connection — leaving a button that says "Continue with" beside an empty
 * box. It also keeps the page self-contained, which is what the site's security
 * headers assume.
 */
function GoogleMark() {
  return (
    <svg width="17" height="17" viewBox="0 0 48 48" aria-hidden focusable="false">
      <path
        fill="#4285F4"
        d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"
      />
      <path
        fill="#34A853"
        d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"
      />
      <path
        fill="#FBBC05"
        d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"
      />
      <path
        fill="#EA4335"
        d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"
      />
    </svg>
  )
}

/** "or" rule, for placing the button beside an email form. */
export function AuthDivider() {
  return (
    <div className="my-5 flex items-center gap-3" aria-hidden>
      <span className="h-px flex-1 bg-canopy/10 dark:bg-white/10" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-ink/40 dark:text-paper/40">
        or
      </span>
      <span className="h-px flex-1 bg-canopy/10 dark:bg-white/10" />
    </div>
  )
}
