"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { completeProfile } from "@/app/actions/profile"
import { safeNext } from "@/lib/auth-redirect"
import { COMMUNITIES_BY_NAME, COMMUNITY_COUNT } from "@/constants/communities"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"

/**
 * The four questions Google cannot answer, asked once.
 *
 * Kept to exactly those four. The temptation is to re-ask for a name here too,
 * since it is on screen anyway — but the name arrived verified from the provider
 * and re-asking would make signing in with Google longer than not bothering,
 * which defeats the point of adding it.
 */
export default function CompleteProfileForm({
  fullName,
}: {
  fullName: string
}) {
  const router = useRouter()
  const next = safeNext(useSearchParams().get("next"))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  const firstName = fullName.trim().split(/\s+/)[0]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const res = await completeProfile(Object.fromEntries(form.entries()))

    if (!res.ok) {
      setErrors(res.fieldErrors ?? {})
      setServerError(res.error ?? "")
      setLoading(false)
      return
    }

    setErrors({})
    router.push(next)
    // The layout gate is decided on the server from the profile row, so the
    // client cache has to be dropped or the member is bounced back here.
    router.refresh()
  }

  return (
    <div className="surface relative overflow-hidden p-7 shadow-elevated sm:p-8">
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-gold-400/80 to-transparent"
      />
      <h1 className="font-display text-[1.75rem] font-bold tracking-tight text-canopy dark:text-paper">
        Akwaaba{firstName ? `, ${firstName}` : ""}
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-ink/55 dark:text-paper/55">
        Your account is created. Four last details — your community decides who
        represents you in the Assembly, so we cannot leave it blank.
      </p>

      {serverError && (
        <p className="mt-4 rounded-xl border border-brand-red/15 bg-brand-red-50 p-3.5 text-sm text-brand-red-700 dark:border-brand-red/25 dark:bg-brand-red/15 dark:text-brand-red-100">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-7 space-y-4">
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

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Saving…" : "Finish and open my dashboard"}
        </Button>
      </form>
    </div>
  )
}
