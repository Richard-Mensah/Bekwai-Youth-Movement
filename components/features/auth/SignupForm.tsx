"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { registerSchema } from "@/lib/validations"
import { friendlyAuthError } from "@/lib/auth-errors"
import { COMMUNITIES_BY_NAME, COMMUNITY_COUNT } from "@/constants/communities"
import Input from "@/components/ui/Input"
import PasswordInput from "@/components/ui/PasswordInput"
import Button from "@/components/ui/Button"
import AuthNotice from "./AuthNotice"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

/** Only allow same-site relative redirects (avoid open-redirect). */
function safeNext(v: string | null): string {
  return v && v.startsWith("/") && !v.startsWith("//") ? v : ""
}

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
  const next = safeNext(useSearchParams().get("next"))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)
  // Tracked only to give live feedback on the confirm field — the values that
  // are actually submitted come from the form itself.
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const confirmed =
    password.length >= 8 && confirmPassword.length > 0 && password === confirmPassword

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
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
        emailRedirectTo:
          typeof window !== "undefined"
            ? `${window.location.origin}${next || "/dashboard"}`
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
      setServerError(friendlyAuthError(error.message))
      return
    }
    // If email confirmation is disabled, Supabase returns a live session and the
    // applicant can go straight on; otherwise send them to verify their email.
    if (data.session) {
      router.push(next || "/dashboard")
      router.refresh()
    } else {
      router.push(`/verify-pending${next ? `?next=${encodeURIComponent(next)}` : ""}`)
    }
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
      {serverError && (
        <p className="mt-4 rounded-xl border border-brand-red/15 bg-brand-red-50 p-3.5 text-sm text-brand-red-700 dark:border-brand-red/25 dark:bg-brand-red/15 dark:text-brand-red-100">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-7">
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
            hint="At least 8 characters."
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
