import Link from "next/link"
import { UserPlus, LogIn, BadgeCheck, Save, ListChecks } from "lucide-react"

/** Where signing in lands you: straight into the applications portal. */
const NEXT = "/dashboard/apply"

const PERKS = [
  {
    icon: BadgeCheck,
    title: "Your unique BYM ID",
    body: "Every account gets an official membership ID (e.g. BYM-2026-0004) that identifies you through the process.",
  },
  {
    icon: Save,
    title: "One verified profile",
    body: "Your name, community and contact are captured once, so applying takes only a couple of minutes.",
  },
  {
    icon: ListChecks,
    title: "Track your application",
    body: "Follow your progress through vetting and appointment from your own dashboard, at any time.",
  },
]

/** Shown on /leadership/apply when the visitor is not signed in. */
export default function ApplyAccountGate() {
  return (
    <div className="rounded-3xl border border-canopy/10 bg-white p-6 shadow-card sm:p-9">
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-canopy-50 text-canopy">
          <UserPlus size={26} />
        </span>
        <h3 className="mt-4 font-display text-xl font-semibold text-canopy sm:text-2xl">
          First, create your applicant account
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-ink/65">
          To keep the process fair and traceable, applications are tied to an
          account. It’s free and takes a minute — you’ll get your own unique BYM
          ID, then you can put your name forward.
        </p>
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {PERKS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-2xl border border-canopy/10 bg-paper/60 p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-canopy-50 text-canopy">
              <Icon size={17} />
            </span>
            <h4 className="mt-3 text-sm font-semibold text-canopy">{title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink/60">{body}</p>
          </div>
        ))}
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href={`/join?next=${encodeURIComponent(NEXT)}`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-canopy px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
        >
          <UserPlus size={16} /> Create my account
        </Link>
        <Link
          href={`/login?next=${encodeURIComponent(NEXT)}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-canopy/25 bg-white px-6 py-3 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50"
        >
          <LogIn size={16} /> I already have an account
        </Link>
      </div>
      <p className="mt-4 text-center text-xs text-ink/45">
        After you sign in, you’ll land straight in your applications portal.
      </p>
    </div>
  )
}
