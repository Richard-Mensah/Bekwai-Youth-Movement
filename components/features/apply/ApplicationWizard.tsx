"use client"

import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CircleAlert,
  Cloud,
  CloudOff,
  Loader2,
  MapPin,
  Send,
  Sparkles,
  Video,
} from "lucide-react"
import Input from "@/components/ui/Input"
import StepRail from "./StepRail"
import DocumentUploader from "./DocumentUploader"
import EligibilityPanel from "./EligibilityPanel"
import { ARM_STYLE, officeIcon } from "./OfficeIcon"
import { OPEN_ROLE_GROUPS } from "@/constants/openRoles"
import { officeByTitle } from "@/constants/offices"
import {
  TOTAL_STEPS,
  VETTING_OPTIONS,
  WIZARD_STEPS,
} from "@/constants/applications"
import type { ApplicationDocument, ApplicationRow } from "@/lib/data/applications"
import { saveDraft, submitDraft } from "@/app/dashboard/apply/actions"
import { cn } from "@/lib/utils"

type Props = {
  application: ApplicationRow
  documents: ApplicationDocument[]
  membershipId: string | null
}

type Values = {
  fullName: string
  email: string
  phone: string
  community: string
  age: string
  gender: string
  roleApplied: string
  altRole: string
  occupation: string
  qualifications: string
  experience: string
  motivation: string
  availability: string
  refereeName: string
  refereeContact: string
  vettingPref: string
  consent: boolean
}

const FIELD_TO_COLUMN: Record<keyof Values, string> = {
  fullName: "full_name",
  email: "email",
  phone: "phone",
  community: "community",
  age: "age",
  gender: "gender",
  roleApplied: "role_applied",
  altRole: "alt_role",
  occupation: "occupation",
  qualifications: "qualifications",
  experience: "experience",
  motivation: "motivation",
  availability: "availability",
  refereeName: "referee_name",
  refereeContact: "referee_contact",
  vettingPref: "vetting_pref",
  consent: "consent",
}

const selectClass =
  "mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-700 dark:text-paper"
const textareaClass =
  "mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-700 dark:text-paper"
const labelClass = "block text-sm font-medium text-ink/75 dark:text-paper/75"
const optional = (
  <span className="font-normal text-ink/40 dark:text-paper/40">(optional)</span>
)

/** Icons for the shared vetting options; the labels live in constants. */
const VETTING_ICONS: Record<string, React.ElementType> = {
  in_person: MapPin,
  virtual: Video,
  either: Sparkles,
}

export default function ApplicationWizard({
  application,
  documents,
  membershipId,
}: Props) {
  const router = useRouter()
  const reduce = useReducedMotion()

  const [values, setValues] = useState<Values>({
    fullName: application.fullName,
    email: application.email,
    phone: application.phone ?? "",
    community: application.community ?? "",
    age: application.age != null ? String(application.age) : "",
    gender: application.gender ?? "",
    roleApplied: application.roleApplied,
    altRole: application.altRole ?? "",
    occupation: application.occupation ?? "",
    qualifications: application.qualifications ?? "",
    experience: application.experience ?? "",
    motivation: application.motivation,
    availability: application.availability ?? "",
    refereeName: application.refereeName ?? "",
    refereeContact: application.refereeContact ?? "",
    vettingPref: application.vettingPref ?? "either",
    consent: application.consent,
  })

  const [step, setStep] = useState(
    Math.min(Math.max(application.currentStep, 1), TOTAL_STEPS)
  )
  const [furthest, setFurthest] = useState(step)
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({})
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  )
  const [serverError, setServerError] = useState<string | null>(null)
  const [submitting, startSubmit] = useTransition()

  const pendingPatch = useRef<Record<string, string | number | boolean | null>>({})
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const office = officeByTitle(values.roleApplied)

  /** Queues a patch and flushes it after a short pause. */
  const queueSave = useCallback(
    (patch: Record<string, string | number | boolean | null>) => {
      Object.assign(pendingPatch.current, patch)
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(async () => {
        const batch = pendingPatch.current
        pendingPatch.current = {}
        if (Object.keys(batch).length === 0) return
        setSaveState("saving")
        const res = await saveDraft(application.id, batch)
        setSaveState(res.ok ? "saved" : "error")
      }, 800)
    },
    [application.id]
  )

  // Flush anything outstanding when the wizard unmounts.
  useEffect(() => {
    const pending = pendingPatch.current
    const id = application.id
    return () => {
      if (timer.current) clearTimeout(timer.current)
      if (Object.keys(pending).length > 0) void saveDraft(id, pending)
    }
  }, [application.id])

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
    const column = FIELD_TO_COLUMN[key]
    const out =
      key === "age"
        ? value === ""
          ? null
          : Number(value)
        : typeof value === "boolean"
          ? value
          : String(value).trim() === ""
            ? null
            : value
    queueSave({ [column]: out as string | number | boolean | null })
  }

  /** Required fields per step. Everything else is genuinely optional. */
  function validate(n: number): boolean {
    const next: Partial<Record<keyof Values, string>> = {}
    if (n === 1 && !values.roleApplied)
      next.roleApplied = "Choose the office you want to serve in."
    if (n === 2) {
      if (values.fullName.trim().length < 3)
        next.fullName = "Please enter your full name."
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email.trim()))
        next.email = "Please enter a valid email address."
      if (values.age && (Number(values.age) < 10 || Number(values.age) > 120))
        next.age = "Please enter a valid age."
    }
    if (n === 4 && values.motivation.trim().length < 20)
      next.motivation = "A sentence or two on why you want to serve."
    if (n === 7 && !values.consent)
      next.consent = "Please confirm the declaration to submit."
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function go(n: number) {
    const target = Math.min(Math.max(n, 1), TOTAL_STEPS)
    if (target > step && !validate(step)) return
    setStep(target)
    setFurthest((f) => Math.max(f, target))
    queueSave({ current_step: target })
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
  }

  function handleSubmit() {
    if (!validate(7)) return
    setServerError(null)
    startSubmit(async () => {
      // Make sure nothing is still sitting in the debounce.
      if (timer.current) clearTimeout(timer.current)
      const batch = pendingPatch.current
      pendingPatch.current = {}
      if (Object.keys(batch).length > 0) await saveDraft(application.id, batch)

      const res = await submitDraft(application.id)
      if (res.ok) router.push(`/dashboard/apply/${application.id}?submitted=1`)
      else setServerError(res.error)
    })
  }

  const Icon = office ? officeIcon(office.icon) : BadgeCheck

  return (
    <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      {/* Rail */}
      <aside className="lg:sticky lg:top-8 lg:self-start">
        <StepRail step={step} furthest={furthest} onJump={go} />
        <SaveIndicator state={saveState} className="mt-6 hidden lg:flex" />
      </aside>

      {/* Panel */}
      <div className="min-w-0">
        <div className="rounded-3xl border border-canopy/10 bg-white p-6 shadow-card sm:p-8 dark:border-white/10 dark:bg-canopy-800">
          <header className="mb-6 border-b border-canopy/[0.08] pb-5 dark:border-white/10">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold-600 dark:text-gold-300">
              Step {step} of {TOTAL_STEPS}
            </p>
            <h2 className="mt-1.5 font-display text-xl font-semibold text-canopy dark:text-paper sm:text-2xl">
              {WIZARD_STEPS[step - 1].title}
            </h2>
          </header>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduce ? false : { opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reduce ? undefined : { opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* 1 — The office */}
              {step === 1 && (
                <div className="space-y-5">
                  <p className="text-sm leading-relaxed text-ink/65 dark:text-paper/60">
                    Every office is open, from Director-General to the community
                    seats. Not sure which fits you?{" "}
                    <Link
                      href="/dashboard/apply/roles"
                      className="font-semibold text-brand-blue hover:underline"
                    >
                      Browse all offices
                    </Link>{" "}
                    first — your progress is saved.
                  </p>

                  <div>
                    <label htmlFor="roleApplied" className={labelClass}>
                      The office you are applying for
                    </label>
                    <select
                      id="roleApplied"
                      value={values.roleApplied}
                      onChange={(e) => set("roleApplied", e.target.value)}
                      className={selectClass}
                    >
                      <option value="">Select an office…</option>
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

                  {office && (
                    <motion.div
                      initial={reduce ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3.5 rounded-2xl p-4",
                        ARM_STYLE[office.arm].tint
                      )}
                    >
                      <Icon size={20} className="mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-display text-sm font-semibold">
                          {office.title}
                        </p>
                        <p className="mt-1 text-xs leading-relaxed opacity-80">
                          {office.summary}
                        </p>
                        <Link
                          href={`/dashboard/apply/roles/${office.slug}`}
                          className="mt-2 inline-block text-xs font-semibold underline underline-offset-2"
                        >
                          Read the full role description
                        </Link>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label htmlFor="altRole" className={labelClass}>
                      Second choice {optional}
                    </label>
                    <select
                      id="altRole"
                      value={values.altRole}
                      onChange={(e) => set("altRole", e.target.value)}
                      className={selectClass}
                    >
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
                    <p className="mt-1 text-xs text-ink/45 dark:text-paper/45">
                      If your first choice is filled, the Secretariat will
                      consider you for this one.
                    </p>
                  </div>
                </div>
              )}

              {/* 2 — About you */}
              {step === 2 && (
                <div className="space-y-5">
                  {membershipId && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-canopy p-4 text-white canopy-texture">
                      <span className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gold-400/20 text-gold-200">
                          <BadgeCheck size={18} />
                        </span>
                        <span className="text-sm text-white/70">
                          Applying as a verified account
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[10px] uppercase tracking-wider text-white/50">
                          Your BYM ID
                        </span>
                        <span className="font-mono text-sm font-semibold text-gold-200">
                          {membershipId}
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Full name"
                      name="fullName"
                      value={values.fullName}
                      onChange={(e) => set("fullName", e.target.value)}
                      error={errors.fullName}
                    />
                    <Input
                      label="Email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={(e) => set("email", e.target.value)}
                      error={errors.email}
                    />
                    <Input
                      label="Phone / WhatsApp"
                      name="phone"
                      type="tel"
                      placeholder="+233 …"
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                    />
                    <Input
                      label="Community"
                      name="community"
                      placeholder="Your community"
                      value={values.community}
                      onChange={(e) => set("community", e.target.value)}
                    />
                    <Input
                      label="Age"
                      name="age"
                      type="number"
                      min={10}
                      max={120}
                      placeholder="e.g. 24"
                      value={values.age}
                      onChange={(e) => set("age", e.target.value)}
                      error={errors.age}
                    />
                    <div>
                      <label htmlFor="gender" className={labelClass}>
                        Gender
                      </label>
                      <select
                        id="gender"
                        value={values.gender}
                        onChange={(e) => set("gender", e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select…</option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  {office && (
                    <EligibilityPanel
                      office={office}
                      age={values.age ? Number(values.age) : null}
                    />
                  )}
                </div>
              )}

              {/* 3 — Background */}
              {step === 3 && (
                <div className="space-y-5">
                  <p className="rounded-xl bg-gold-50 px-4 py-3 text-sm leading-relaxed text-ink/70 dark:bg-gold-400/10 dark:text-paper/70">
                    Every field on this step is optional. Not everyone has had
                    the same chance at formal education, and that does not make
                    you any less capable of leading. Skip anything that
                    doesn&apos;t apply to you.
                  </p>
                  <Input
                    label="Current occupation or studies"
                    name="occupation"
                    placeholder="e.g. Teacher, trader, Level 300 student"
                    value={values.occupation}
                    onChange={(e) => set("occupation", e.target.value)}
                  />
                  <div>
                    <label htmlFor="qualifications" className={labelClass}>
                      Qualifications & skills {optional}
                    </label>
                    <textarea
                      id="qualifications"
                      rows={3}
                      placeholder="Education, training, or skills you have."
                      className={textareaClass}
                      value={values.qualifications}
                      onChange={(e) => set("qualifications", e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor="experience" className={labelClass}>
                      Leadership or volunteering experience {optional}
                    </label>
                    <textarea
                      id="experience"
                      rows={3}
                      placeholder="Any roles you've held or community work you've done."
                      className={textareaClass}
                      value={values.experience}
                      onChange={(e) => set("experience", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* 4 — Motivation */}
              {step === 4 && (
                <div className="space-y-5">
                  <div>
                    <label htmlFor="motivation" className={labelClass}>
                      {office
                        ? `Why do you want to serve as ${office.title}?`
                        : "Why do you want to serve?"}
                    </label>
                    <textarea
                      id="motivation"
                      rows={7}
                      placeholder={
                        office
                          ? `Tell us in your own words what you would bring, and what you hope to achieve in your first year as ${office.title}.`
                          : "Tell us in your own words what you would bring and what you hope to achieve."
                      }
                      className={textareaClass}
                      value={values.motivation}
                      onChange={(e) => set("motivation", e.target.value)}
                    />
                    <div className="mt-1.5 flex items-center justify-between">
                      {errors.motivation ? (
                        <p className="text-xs text-brand-red">{errors.motivation}</p>
                      ) : (
                        <p className="text-xs text-ink/45 dark:text-paper/45">
                          Write as much or as little as you like — there is no
                          right answer.
                        </p>
                      )}
                      <p className="shrink-0 text-xs tabular-nums text-ink/40 dark:text-paper/40">
                        {values.motivation.trim().length} characters
                      </p>
                    </div>
                  </div>

                  {office && office.responsibilities.length > 0 && (
                    <div className="rounded-2xl border border-canopy/10 bg-paper/70 p-4 dark:border-white/10 dark:bg-white/5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink/45 dark:text-paper/45">
                        A reminder of what this office does
                      </p>
                      <ul className="mt-2.5 space-y-1.5">
                        {office.responsibilities.slice(0, 4).map((r) => (
                          <li
                            key={r}
                            className="flex gap-2 text-xs leading-relaxed text-ink/65 dark:text-paper/60"
                          >
                            <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* 5 — Documents */}
              {step === 5 && (
                <DocumentUploader
                  applicationId={application.id}
                  documents={documents}
                />
              )}

              {/* 6 — Vetting */}
              {step === 6 && (
                <div className="space-y-6">
                  <div>
                    <span className={labelClass}>
                      How would you prefer to be vetted?
                    </span>
                    <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">
                      Vetting is hybrid — in person in Sefwi Bekwai, or online if
                      you are away from home. Distance is never a barrier.
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-3">
                      {VETTING_OPTIONS.map(({ value, title, body }) => {
                        const VIcon = VETTING_ICONS[value] ?? Sparkles
                        const active = values.vettingPref === value
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => set("vettingPref", value)}
                            aria-pressed={active}
                            className={cn(
                              "group flex flex-col rounded-xl border p-4 text-left shadow-sm transition-all",
                              active
                                ? "border-canopy bg-canopy-50/60 ring-1 ring-canopy dark:border-gold-400 dark:bg-white/10 dark:ring-gold-400"
                                : "border-canopy/20 bg-white hover:border-canopy/40 dark:border-white/10 dark:bg-canopy-700"
                            )}
                          >
                            <span
                              className={cn(
                                "flex h-9 w-9 items-center justify-center rounded-lg transition-colors",
                                active
                                  ? "bg-canopy text-white dark:bg-gold-400 dark:text-canopy"
                                  : "bg-canopy-50 text-canopy dark:bg-white/10 dark:text-paper"
                              )}
                            >
                              <VIcon size={17} />
                            </span>
                            <span className="mt-2.5 text-sm font-semibold text-canopy dark:text-paper">
                              {title}
                            </span>
                            <span className="text-xs text-ink/55 dark:text-paper/55">
                              {body}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Input
                    label="When are you available?"
                    name="availability"
                    placeholder="e.g. Weekends, evenings, or full-time"
                    value={values.availability}
                    onChange={(e) => set("availability", e.target.value)}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Input
                      label="Referee name (optional)"
                      name="refereeName"
                      placeholder="Someone who can vouch for you"
                      value={values.refereeName}
                      onChange={(e) => set("refereeName", e.target.value)}
                    />
                    <Input
                      label="Referee phone or email (optional)"
                      name="refereeContact"
                      placeholder="Their contact"
                      value={values.refereeContact}
                      onChange={(e) => set("refereeContact", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* 7 — Review */}
              {step === 7 && (
                <div className="space-y-6">
                  <p className="text-sm leading-relaxed text-ink/65 dark:text-paper/60">
                    Please check everything over. You can still change anything —
                    just use the Edit links.
                  </p>

                  <Review
                    step={1}
                    title="The office"
                    onEdit={() => go(1)}
                    rows={[
                      ["Applying for", values.roleApplied || "— not chosen"],
                      ["Second choice", values.altRole || "None"],
                    ]}
                  />
                  <Review
                    step={2}
                    title="About you"
                    onEdit={() => go(2)}
                    rows={[
                      ["Name", values.fullName],
                      ["Email", values.email],
                      ["Phone", values.phone || "—"],
                      ["Community", values.community || "—"],
                      ["Age", values.age || "—"],
                      ["Gender", values.gender || "—"],
                    ]}
                  />
                  <Review
                    step={3}
                    title="Your background"
                    onEdit={() => go(3)}
                    rows={[
                      ["Occupation", values.occupation || "—"],
                      ["Qualifications", values.qualifications || "—"],
                      ["Experience", values.experience || "—"],
                    ]}
                  />
                  <Review
                    step={4}
                    title="Why this office"
                    onEdit={() => go(4)}
                    rows={[["Motivation", values.motivation || "—"]]}
                  />
                  <Review
                    step={5}
                    title="Documents"
                    onEdit={() => go(5)}
                    rows={[
                      [
                        "Attached",
                        documents.length > 0
                          ? documents.map((d) => d.filename).join(", ")
                          : "None — that's fine",
                      ],
                    ]}
                  />
                  <Review
                    step={6}
                    title="Vetting & referees"
                    onEdit={() => go(6)}
                    rows={[
                      [
                        "Preference",
                        VETTING_OPTIONS.find((v) => v.value === values.vettingPref)
                          ?.title ?? "Either",
                      ],
                      ["Availability", values.availability || "—"],
                      [
                        "Referee",
                        values.refereeName
                          ? `${values.refereeName}${values.refereeContact ? ` — ${values.refereeContact}` : ""}`
                          : "—",
                      ],
                    ]}
                  />

                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-canopy/15 bg-canopy-50/50 p-4 dark:border-white/10 dark:bg-white/5">
                    <input
                      type="checkbox"
                      checked={values.consent}
                      onChange={(e) => set("consent", e.target.checked)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-canopy/40 text-canopy focus:ring-canopy"
                    />
                    <span className="text-sm leading-relaxed text-ink/70 dark:text-paper/70">
                      I confirm the information above is accurate. I commit to
                      serving in line with the Movement&apos;s non-partisan
                      values and the Code of Conduct in Schedule IV of the
                      Constitution, and — if appointed — to taking the Oath of
                      Service in Schedule I.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-xs text-brand-red">{errors.consent}</p>
                  )}

                  {serverError && (
                    <p className="flex items-start gap-2 rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
                      <CircleAlert size={16} className="mt-0.5 shrink-0" />
                      {serverError}
                    </p>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer nav */}
          <div className="mt-8 flex items-center justify-between gap-3 border-t border-canopy/[0.08] pt-6 dark:border-white/10">
            <button
              type="button"
              onClick={() => go(step - 1)}
              disabled={step === 1}
              className="inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-ink/60 transition-colors hover:bg-canopy/5 hover:text-canopy disabled:invisible dark:text-paper/60 dark:hover:bg-white/5 dark:hover:text-paper"
            >
              <ArrowLeft size={15} /> Back
            </button>

            <SaveIndicator state={saveState} className="lg:hidden" />

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={() => go(step + 1)}
                className="inline-flex items-center gap-2 rounded-full bg-canopy px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
              >
                Continue <ArrowRight size={15} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-2.5 text-sm font-semibold text-canopy shadow-sm transition-all hover:-translate-y-0.5 hover:bg-gold-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" /> Submitting…
                  </>
                ) : (
                  <>
                    Submit application <Send size={15} />
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink/45 dark:text-paper/45">
          Your progress saves automatically. You can close this page and pick up
          where you left off.
        </p>
      </div>
    </div>
  )
}

function SaveIndicator({
  state,
  className,
}: {
  state: "idle" | "saving" | "saved" | "error"
  className?: string
}) {
  if (state === "idle") return <span className={className} />
  const map = {
    saving: { icon: Loader2, text: "Saving…", tone: "text-ink/45 dark:text-paper/45", spin: true },
    saved: { icon: Check, text: "Saved", tone: "text-brand-green dark:text-brand-green-100", spin: false },
    error: { icon: CloudOff, text: "Not saved — check your connection", tone: "text-brand-red", spin: false },
  } as const
  const { icon: Icon, text, tone, spin } = map[state]
  return (
    <span
      aria-live="polite"
      className={cn("flex items-center gap-1.5 text-xs font-medium", tone, className)}
    >
      <Icon size={13} className={spin ? "animate-spin" : undefined} />
      {text}
      {state === "saved" && <Cloud size={12} className="opacity-40" />}
    </span>
  )
}

function Review({
  title,
  rows,
  onEdit,
}: {
  step: number
  title: string
  rows: [string, string][]
  onEdit: () => void
}) {
  return (
    <section className="rounded-2xl border border-canopy/10 bg-paper/60 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-sm font-semibold text-canopy dark:text-paper">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs font-semibold text-brand-blue hover:underline"
        >
          Edit
        </button>
      </div>
      <dl className="mt-3 space-y-2">
        {rows.map(([k, v]) => (
          <div key={k} className="grid gap-0.5 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-3">
            <dt className="text-[11px] uppercase tracking-wider text-ink/40 dark:text-paper/40">
              {k}
            </dt>
            <dd className="whitespace-pre-wrap break-words text-sm text-ink/75 dark:text-paper/75">
              {v}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
