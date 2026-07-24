"use client"

import { useState, useTransition } from "react"
import { Send, CheckCircle2 } from "lucide-react"
import Input from "@/components/ui/Input"
import { OPEN_ROLE_GROUPS } from "@/constants/openRoles"
import { submitApplication } from "@/app/actions/leadership-application"

const selectClass =
  "mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
const textareaClass =
  "mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
const labelClass = "block text-sm font-medium text-ink/75"

/** Public form to apply for a BYM leadership role → leadership_applications. */
export default function LeadershipApplicationForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const fullName = String(data.get("fullName") ?? "").trim()
    const email = String(data.get("email") ?? "").trim()
    const roleApplied = String(data.get("roleApplied") ?? "").trim()
    const motivation = String(data.get("motivation") ?? "").trim()
    const consent = data.get("consent") === "on"

    const next: Record<string, string> = {}
    if (!fullName) next.fullName = "Please enter your full name."
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
      next.email = "Please enter a valid email."
    if (!roleApplied) next.roleApplied = "Please select a role."
    if (motivation.length < 20)
      next.motivation = "A sentence or two on why you want to serve."
    if (!consent) next.consent = "Please confirm the declaration."
    setErrors(next)
    if (Object.keys(next).length > 0) return

    startTransition(async () => {
      const res = await submitApplication(data)
      if (res.ok) setDone(true)
      else setServerError(res.error ?? "Something went wrong.")
    })
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-gold-200 bg-gold-50 p-8 text-center">
        <CheckCircle2 size={36} className="text-gold-600" />
        <h3 className="mt-3 font-display text-xl font-semibold text-canopy">
          Application received
        </h3>
        <p className="mt-1 max-w-sm text-sm text-ink/65">
          Thank you for stepping forward to serve. The Secretariat will review
          your application and be in touch about the next steps in the
          nomination and vetting process.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Personal details */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Full name" name="fullName" placeholder="Full name" error={errors.fullName} />
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          error={errors.email}
        />
        <Input label="Phone" name="phone" type="tel" placeholder="+233 …" />
        <Input label="Community" name="community" placeholder="Your community" />
        <Input label="Age" name="age" type="number" min={10} max={120} placeholder="e.g. 24" />
        <div>
          <label htmlFor="gender" className={labelClass}>
            Gender
          </label>
          <select id="gender" name="gender" className={selectClass} defaultValue="">
            <option value="" disabled>
              Select…
            </option>
            <option>Female</option>
            <option>Male</option>
            <option>Prefer not to say</option>
          </select>
        </div>
      </div>

      {/* Role choice */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="roleApplied" className={labelClass}>
            Role you are applying for
          </label>
          <select
            id="roleApplied"
            name="roleApplied"
            className={selectClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select a role…
            </option>
            {OPEN_ROLE_GROUPS.map((g) => (
              <optgroup key={g.arm} label={g.label}>
                {g.roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.roleApplied && (
            <p className="mt-1 text-xs text-brand-red">{errors.roleApplied}</p>
          )}
        </div>
        <div>
          <label htmlFor="altRole" className={labelClass}>
            Second choice <span className="text-ink/40">(optional)</span>
          </label>
          <select id="altRole" name="altRole" className={selectClass} defaultValue="">
            <option value="">None</option>
            {OPEN_ROLE_GROUPS.map((g) => (
              <optgroup key={g.arm} label={g.label}>
                {g.roles.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>

      <Input label="Current occupation / studies" name="occupation" placeholder="e.g. Teacher, Level 300 student" />

      <div>
        <label htmlFor="qualifications" className={labelClass}>
          Qualifications & skills <span className="text-ink/40">(optional)</span>
        </label>
        <textarea
          id="qualifications"
          name="qualifications"
          rows={3}
          placeholder="Education, certifications, and relevant skills."
          className={textareaClass}
        />
      </div>

      <div>
        <label htmlFor="experience" className={labelClass}>
          Leadership / volunteering experience <span className="text-ink/40">(optional)</span>
        </label>
        <textarea
          id="experience"
          name="experience"
          rows={3}
          placeholder="Any roles you've held or community work you've done."
          className={textareaClass}
        />
      </div>

      <div>
        <label htmlFor="motivation" className={labelClass}>
          Why do you want to serve in this role?
        </label>
        <textarea
          id="motivation"
          name="motivation"
          rows={4}
          placeholder="Tell us what you would bring and what you hope to achieve."
          className={textareaClass}
        />
        {errors.motivation && (
          <p className="mt-1 text-xs text-brand-red">{errors.motivation}</p>
        )}
      </div>

      <Input
        label="Availability"
        name="availability"
        placeholder="e.g. Weekends, evenings, full-time"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Referee name" name="refereeName" placeholder="Someone who can vouch for you" />
        <Input label="Referee phone / email" name="refereeContact" placeholder="Their contact" />
      </div>

      {/* Declaration */}
      <label className="flex items-start gap-3 rounded-xl border border-canopy/15 bg-canopy-50/40 p-4">
        <input
          type="checkbox"
          name="consent"
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-canopy/40 text-canopy focus:ring-canopy"
        />
        <span className="text-sm text-ink/70">
          I confirm the information above is accurate, and I commit to serving in
          line with BYM&apos;s non-partisan values and Code of Conduct.
        </span>
      </label>
      {errors.consent && <p className="text-xs text-brand-red">{errors.consent}</p>}

      {serverError && <p className="text-sm text-brand-red">{serverError}</p>}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-canopy px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-canopy-600 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit application"}
        {!pending && <Send size={16} />}
      </button>
    </form>
  )
}
