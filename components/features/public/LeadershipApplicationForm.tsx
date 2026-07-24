"use client"

import { useRef, useState, useTransition } from "react"
import {
  Send,
  CheckCircle2,
  UserRound,
  Briefcase,
  FileText,
  Users2,
  ScrollText,
  Upload,
  X,
  MapPin,
  Video,
  Sparkles,
} from "lucide-react"
import Input from "@/components/ui/Input"
import { OPEN_ROLE_GROUPS } from "@/constants/openRoles"
import { submitApplication } from "@/app/actions/leadership-application"

const selectClass =
  "mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
const textareaClass =
  "mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
const labelClass = "block text-sm font-medium text-ink/75"
const optional = <span className="font-normal text-ink/40">(optional)</span>

function Section({
  n,
  icon: Icon,
  title,
  hint,
  children,
}: {
  n: number
  icon: React.ElementType
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="border-t border-gray-100 pt-6 first:border-0 first:pt-0">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canopy-50 text-canopy">
          <Icon size={17} />
        </span>
        <div>
          <h3 className="font-display text-base font-semibold text-canopy">
            <span className="mr-1.5 text-gold-500">{n}.</span>
            {title}
          </h3>
          {hint && <p className="text-xs text-ink/50">{hint}</p>}
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  )
}

const VETTING = [
  {
    value: "in_person",
    icon: MapPin,
    title: "In-person",
    body: "I'll be in Sefwi Bekwai",
  },
  {
    value: "virtual",
    icon: Video,
    title: "Virtual",
    body: "I'll be away from home",
  },
  {
    value: "either",
    icon: Sparkles,
    title: "Either",
    body: "Whatever works best",
  },
]

/** Public form to apply for a BYM leadership role → leadership_applications. */
export default function LeadershipApplicationForm() {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [pending, startTransition] = useTransition()
  const [cvName, setCvName] = useState<string | null>(null)
  const cvRef = useRef<HTMLInputElement>(null)

  function clearCv() {
    if (cvRef.current) cvRef.current.value = ""
    setCvName(null)
  }

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
    if (Object.keys(next).length > 0) {
      form
        .querySelector(`[name="${Object.keys(next)[0]}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" })
      return
    }

    startTransition(async () => {
      const res = await submitApplication(data)
      if (res.ok) setDone(true)
      else setServerError(res.error ?? "Something went wrong.")
    })
  }

  if (done) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-gold-200 bg-gold-50 px-6 py-12 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-400/25">
          <CheckCircle2 size={38} className="text-gold-600" />
        </span>
        <h3 className="mt-4 font-display text-2xl font-semibold text-canopy">
          Application received
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-ink/70">
          Thank you for stepping forward to serve. The Secretariat will review
          your application and be in touch about the next steps — residency
          check, vetting (in-person or virtual), and interview. Keep an eye on
          your email and phone.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-8">
      {/* 1 — About you */}
      <Section n={1} icon={UserRound} title="About you">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Full name" name="fullName" placeholder="Full name" error={errors.fullName} />
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
          />
          <Input label="Phone / WhatsApp" name="phone" type="tel" placeholder="+233 …" />
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
      </Section>

      {/* 2 — The role */}
      <Section n={2} icon={ScrollText} title="The role you want to serve in">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="roleApplied" className={labelClass}>
              Role you are applying for
            </label>
            <select id="roleApplied" name="roleApplied" className={selectClass} defaultValue="">
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
              Second choice {optional}
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
      </Section>

      {/* 3 — Background */}
      <Section
        n={3}
        icon={Briefcase}
        title="Your background"
        hint="Qualifications are optional — commitment counts for just as much."
      >
        <Input label="Current occupation / studies" name="occupation" placeholder="e.g. Teacher, trader, Level 300 student" />
        <div>
          <label htmlFor="qualifications" className={labelClass}>
            Qualifications & skills {optional}
          </label>
          <textarea
            id="qualifications"
            name="qualifications"
            rows={3}
            placeholder="Education, training, or skills you have. Leave blank if this doesn't apply to you."
            className={textareaClass}
          />
        </div>
        <div>
          <label htmlFor="experience" className={labelClass}>
            Leadership / volunteering experience {optional}
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
            placeholder="Tell us in your own words what you would bring and what you hope to achieve."
            className={textareaClass}
          />
          {errors.motivation && (
            <p className="mt-1 text-xs text-brand-red">{errors.motivation}</p>
          )}
        </div>
      </Section>

      {/* 4 — CV (optional) */}
      <Section
        n={4}
        icon={FileText}
        title="Upload your CV"
        hint="Completely optional — don't worry if you don't have one."
      >
        <input
          ref={cvRef}
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx,.odt,.rtf,.jpg,.jpeg,.png"
          className="sr-only"
          onChange={(e) => setCvName(e.target.files?.[0]?.name ?? null)}
        />
        {cvName ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-canopy/20 bg-canopy-50/50 px-4 py-3">
            <span className="flex min-w-0 items-center gap-2 text-sm text-ink/75">
              <FileText size={16} className="shrink-0 text-canopy" />
              <span className="truncate">{cvName}</span>
            </span>
            <button
              type="button"
              onClick={clearCv}
              className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-brand-red hover:bg-brand-red/10"
            >
              <X size={14} /> Remove
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => cvRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-canopy/25 bg-paper/60 px-4 py-8 text-center transition-colors hover:border-canopy/50 hover:bg-canopy-50/40"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-canopy-50 text-canopy">
              <Upload size={20} />
            </span>
            <span className="text-sm font-semibold text-canopy">
              Click to upload your CV
            </span>
            <span className="text-xs text-ink/50">
              PDF, Word or image · up to 5 MB · optional
            </span>
          </button>
        )}
      </Section>

      {/* 5 — Vetting preference + availability + referee */}
      <Section
        n={5}
        icon={Users2}
        title="Vetting & references"
        hint="Vetting is hybrid — in-person in Sefwi Bekwai or virtual if you're away."
      >
        <div>
          <span className={labelClass}>How would you prefer to be vetted?</span>
          <div className="mt-2 grid gap-3 sm:grid-cols-3">
            {VETTING.map(({ value, icon: Icon, title, body }, i) => (
              <label
                key={value}
                className="group relative flex cursor-pointer flex-col rounded-xl border border-canopy/20 bg-white p-4 shadow-sm transition-all hover:border-canopy/40 has-[:checked]:border-canopy has-[:checked]:bg-canopy-50/60 has-[:checked]:ring-1 has-[:checked]:ring-canopy"
              >
                <input
                  type="radio"
                  name="vettingPref"
                  value={value}
                  defaultChecked={i === 2}
                  className="sr-only"
                />
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-canopy-50 text-canopy group-has-[:checked]:bg-canopy group-has-[:checked]:text-white">
                  <Icon size={17} />
                </span>
                <span className="mt-2.5 text-sm font-semibold text-canopy">{title}</span>
                <span className="text-xs text-ink/55">{body}</span>
              </label>
            ))}
          </div>
        </div>

        <Input
          label="When are you available?"
          name="availability"
          placeholder="e.g. Weekends, evenings, or full-time"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Referee name (optional)" name="refereeName" placeholder="Someone who can vouch for you" />
          <Input label="Referee phone / email (optional)" name="refereeContact" placeholder="Their contact" />
        </div>
      </Section>

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

      {serverError && (
        <p className="rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-canopy px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-canopy-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {pending ? "Submitting your application…" : "Submit application"}
        {!pending && <Send size={16} />}
      </button>
    </form>
  )
}
