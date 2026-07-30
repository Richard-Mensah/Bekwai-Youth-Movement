"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { registerSchema, PASSWORD_MIN } from "@/lib/validations"
import { friendlyAuthError, isAlreadyRegistered } from "@/lib/auth-errors"
import { safeNext } from "@/lib/auth-redirect"
import { sendWelcomeEmail } from "@/app/actions/welcome"
import { COMMUNITIES_BY_NAME, COMMUNITY_COUNT } from "@/constants/communities"
import Input from "@/components/ui/Input"
import PasswordInput from "@/components/ui/PasswordInput"
import Button from "@/components/ui/Button"
import AuthNotice from "./AuthNotice"
import GoogleButton, { AuthDivider } from "./GoogleButton"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

/**
 * A numbered group of related fields.
 *
 * Eight fields in one undifferentiated column is the thing that makes this form
 * feel long. Grouped into three short steps, the same eight read as "name and
 * email, then a password, then where you live" — no fewer questions, but a
 * visible end to each one.
 */
function Fieldset({
  legend,
  step,
  children,
}: {
  legend: string
  step: number
  children: React.ReactNode
}) {
  return (
    <fieldset className="space-y-4">
      <legend className="mb-3 flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-canopy text-[11px] font-bold text-gold-300"
        >
          {step}
        </span>
        <span className="text-sm font-semibold text-canopy dark:text-paper">
          {legend}
        </span>
      </legend>
      {children}
    </fieldset>
  )
}

export default function SignupForm() {
  const router = useRouter()
  // "" rather than "/dashboard", so the sign-in and verify-pending links below
  // can tell "no destination was asked for" from "/dashboard was asked for".
  const next = safeNext(useSearchParams().get("next"), "")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  // The address of someone who turns out to already be a member. Not an error —
  // it means "you are further along than you think", so it gets its own notice
  // and a sign-in link rather than red text telling them they failed.
  const [existing, setExisting] = useState("")
  const [loading, setLoading] = useState(false)
  // Tracked only to give live feedback on the confirm field — the values that
  // are actually submitted come from the form itself.
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // PASSWORD_MIN, not a literal: a hard-coded 8 here showed "Passwords match" in
  // green for a password the form was about to reject on the very next submit.
  const confirmed =
    password.length >= PASSWORD_MIN &&
    confirmPassword.length > 0 &&
    password === confirmPassword

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
    setExisting("")
    const form = new FormData(e.currentTarget)
    const raw = Object.fromEntries(form.entries())
    const parsed = registerSchema.safeParse(raw)

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
    const { data, error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        // Must land on /auth/callback, never on the destination directly: the
        // link carries a code that only that route knows how to redeem into a
        // session. Pointing it at a page confirms the account but leaves the
        // member signed out.
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                next || "/dashboard"
              )}`
            : undefined,
        data: {
          full_name: parsed.data.fullName,
          gender: parsed.data.gender,
          dob: parsed.data.dob,
          phone: parsed.data.phone,
          community_id: parsed.data.communityId,
        },
      },
    })
    setLoading(false)

    if (error) {
      // "Already registered" is the one failure that is not a failure, and it is
      // common in a drive: people who cannot remember whether they signed up
      // last week simply sign up again.
      if (isAlreadyRegistered(error.message)) setExisting(parsed.data.email)
      else setServerError(friendlyAuthError(error.message))
      return
    }

    // With "Confirm email" ON, a duplicate signup does not error at all: Supabase
    // returns an obfuscated user with no identities, so that nobody can discover
    // which addresses belong to members by watching which ones fail. Treated as
    // success it becomes the worst outcome of the three — a returning member is
    // told "Account created" and sent to wait for an email that never comes,
    // because none was sent.
    if (data.user && data.user.identities?.length === 0) {
      setExisting(parsed.data.email)
      return
    }

    // If email confirmation is disabled, Supabase returns a live session and the
    // applicant can go straight on; otherwise send them to verify their email.
    if (data.session) {
      // Not awaited, and errors are swallowed by the action itself. The member is
      // already registered and signed in — making them watch a spinner while an
      // SMTP provider thinks about it would reintroduce, in miniature, the exact
      // dependency this whole flow was rebuilt to remove.
      void sendWelcomeEmail()
      router.push(next || "/dashboard")
      router.refresh()
      return
    }

    // Carry the address so /verify-pending can name the inbox to check and offer
    // to send the link again. Same convention as the sign-in page's reset link.
    const pending = new URLSearchParams({ email: parsed.data.email })
    if (next) pending.set("next", next)
    router.push(`/verify-pending?${pending}`)
  }

  return (
    <div className="surface relative overflow-hidden p-7 shadow-elevated sm:p-8">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent"
      />
      <h1 className="font-display text-[1.75rem] font-bold tracking-tight text-canopy dark:text-paper">
        Join BYM
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/55 dark:text-paper/55">
        Membership is verified by an administrator — you can apply for office
        straight away, without waiting.
      </p>

      {!SUPABASE_READY && <div className="mt-4"><AuthNotice /></div>}
      {existing && (
        <div className="mt-4 rounded-xl border border-gold-400/40 bg-gold-50 p-3.5 text-sm text-canopy dark:border-gold-400/25 dark:bg-gold-400/10 dark:text-paper">
          <p className="font-medium">
            {existing} is already registered with BYM.
          </p>
          <p className="mt-1 text-canopy/80 dark:text-paper/75">
            Nothing more to fill in —{" "}
            <Link
              href={`/login?${new URLSearchParams({
                email: existing,
                ...(next ? { next } : {}),
              })}`}
              className="font-semibold underline"
            >
              sign in instead
            </Link>
            , or{" "}
            <Link
              href={`/forgot-password?email=${encodeURIComponent(existing)}`}
              className="font-semibold underline"
            >
              reset the password
            </Link>{" "}
            if you have forgotten it.
          </p>
        </div>
      )}
      {serverError && (
        <p className="mt-4 rounded-xl border border-brand-red/15 bg-brand-red-50 p-3.5 text-sm text-brand-red-700 dark:border-brand-red/25 dark:bg-brand-red/15 dark:text-brand-red-100">
          {serverError}
        </p>
      )}

      {/* First, because it removes five of these eight fields. Google returns a
          verified address and a name; /complete-profile then asks only for the
          community, phone, gender and date of birth it cannot know. `next || ""`
          would send an empty destination — safeNext's default belongs here. */}
      <div className="mt-7">
        <GoogleButton
          next={next || "/dashboard"}
          label="Sign up with Google"
          disabled={!SUPABASE_READY}
        />
      </div>
      <AuthDivider />

      <form onSubmit={handleSubmit} className="space-y-7">
        <Fieldset legend="Who you are" step={1}>
          <Input
            name="fullName"
            label="Full name"
            autoComplete="name"
            error={errors.fullName}
          />
          <Input
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            error={errors.email}
          />
        </Fieldset>

        <Fieldset legend="Choose a password" step={2}>
          <PasswordInput
            name="password"
            label="Password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            hint={`At least ${PASSWORD_MIN} characters.`}
          />
          <PasswordInput
            name="confirmPassword"
            label="Confirm password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
            hint={
              confirmed ? (
                <span className="flex items-center gap-1 font-semibold text-brand-green">
                  <Check size={12} aria-hidden /> Passwords match
                </span>
              ) : (
                "Type it once more so we know it is right."
              )
            }
          />
        </Fieldset>

        <Fieldset legend="Where you belong" step={3}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="gender" className="field-label">
                Gender
              </label>
              <select id="gender" name="gender" className="field mt-1">
                <option value="">Select…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-xs text-brand-red">{errors.gender}</p>
              )}
            </div>
            <Input
              name="dob"
              type="date"
              label="Date of birth"
              autoComplete="bday"
              error={errors.dob}
            />
          </div>
          <Input
            name="phone"
            label="Phone"
            autoComplete="tel"
            inputMode="tel"
            error={errors.phone}
          />
          <div>
            <label htmlFor="communityId" className="field-label">
              Community
            </label>
            <select id="communityId" name="communityId" className="field mt-1">
              <option value="">Select your community…</option>
              {COMMUNITIES_BY_NAME.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.communityId ? (
              <p className="mt-1 text-xs text-brand-red">{errors.communityId}</p>
            ) : (
              <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
                All {COMMUNITY_COUNT} communities, listed alphabetically.
              </p>
            )}
          </div>
        </Fieldset>

        <Button type="submit" disabled={!SUPABASE_READY || loading} className="w-full">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 border-t border-canopy/[0.08] pt-5 text-center text-sm text-ink/55 dark:border-white/[0.08] dark:text-paper/55">
        Already a member?{" "}
        <Link
          href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-canopy hover:underline dark:text-gold-300"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
