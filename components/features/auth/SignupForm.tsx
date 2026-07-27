"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { registerSchema } from "@/lib/validations"
import { friendlyAuthError } from "@/lib/auth-errors"
import { COMMUNITIES } from "@/constants/communities"
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
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-green-700">Join BYM</h1>
      <p className="mt-1 text-sm text-gray-500">
        Register as a member. Your membership is verified by an administrator.
      </p>

      {!SUPABASE_READY && <div className="mt-4"><AuthNotice /></div>}
      {serverError && (
        <p className="mt-4 rounded-lg bg-brand-red-50 p-3 text-sm text-brand-red-700">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input name="fullName" label="Full name" error={errors.fullName} />
        <Input name="email" type="email" label="Email" error={errors.email} />
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
              <span className="flex items-center gap-1 text-brand-green">
                <Check size={12} aria-hidden /> Passwords match
              </span>
            ) : (
              "Type it once more so we know it is right."
            )
          }
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
            >
              <option value="">Select…</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-brand-red">{errors.gender}</p>}
          </div>
          <Input name="dob" type="date" label="Date of birth" error={errors.dob} />
        </div>
        <Input name="phone" label="Phone" error={errors.phone} />
        <div>
          <label className="block text-sm font-medium text-gray-700">Community</label>
          <select
            name="communityId"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-brand-green focus:outline-none focus:ring-1 focus:ring-brand-green"
          >
            <option value="">Select your community…</option>
            {COMMUNITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.communityId && (
            <p className="mt-1 text-xs text-brand-red">{errors.communityId}</p>
          )}
        </div>

        <Button type="submit" disabled={!SUPABASE_READY || loading} className="w-full">
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Already a member?{" "}
        <Link
          href={`/login${next ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-medium text-brand-green hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}
