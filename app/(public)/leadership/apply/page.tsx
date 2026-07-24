import type { Metadata } from "next"
import {
  Users,
  ShieldCheck,
  CalendarClock,
  HeartHandshake,
  MapPin,
  Video,
  ArrowDown,
} from "lucide-react"
import { BadgeCheck } from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import LeadershipApplicationForm from "@/components/features/public/LeadershipApplicationForm"
import ApplyAccountGate from "@/components/features/public/ApplyAccountGate"
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server"

type Account = {
  fullName: string
  email: string
  phone: string
  community: string
  membershipId: string
}

async function getAccount(): Promise<Account | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, phone, membership_id, communities(name)")
    .eq("id", user.id)
    .single()
  return {
    fullName: (data?.full_name as string) ?? "",
    email: (data?.email as string) ?? user.email ?? "",
    phone: (data?.phone as string) ?? "",
    community:
      ((data?.communities as { name?: string } | null)?.name as string) ?? "",
    membershipId: (data?.membership_id as string) ?? "",
  }
}

export const metadata: Metadata = {
  title: "Apply for a Leadership Role",
  description:
    "Enrolment is open. Apply to serve in the Bekwai Youth Movement, from Director-General to community-level seats. Open to every committed young person across the 32 communities. A CV is optional.",
}

const STEPS = [
  {
    icon: Users,
    title: "Open to all who qualify",
    body: "Every office, from Director-General to community seats, is open. Commitment to the community matters as much as paper qualifications.",
  },
  {
    icon: ShieldCheck,
    title: "Merit & values first",
    body: "Selection follows a fair, 5-step nomination and vetting process. BYM is non-partisan; leaders serve the community, not any party.",
  },
  {
    icon: CalendarClock,
    title: "What happens next",
    body: "The Secretariat reviews every application, then invites shortlisted applicants to residency check, vetting, and an interview.",
  },
]

export default async function LeadershipApplyPage() {
  const account = await getAccount()
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-canopy text-white">
        <div className="absolute inset-0 canopy-texture" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-brand-green-400/10 blur-3xl" />
        <div className="container-content relative py-16 sm:py-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-200 ring-1 ring-inset ring-gold-400/30">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-300" />
              </span>
              Enrolment is now open
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="mt-5 max-w-3xl font-display text-3xl font-semibold text-white text-balance sm:text-5xl">
              Step forward to lead the movement
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-2xl text-lg text-white/75 text-pretty">
              The Bekwai Youth Movement is calling on every committed young person
              to put their name forward — from Director-General to the last role.
              You do not need a fancy CV. You need the heart to serve.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <a
              href="#apply"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3 text-sm font-semibold text-canopy shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gold-300"
            >
              Start your application
              <ArrowDown size={16} />
            </a>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container-content">
          <div className="grid gap-5 sm:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.08}>
                <div className="group h-full rounded-2xl border border-canopy/10 bg-white p-6 shadow-card transition-all hover:-translate-y-1 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-canopy-50 text-canopy transition-colors group-hover:bg-canopy group-hover:text-white">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold text-canopy">
                    {title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Reassurance: no CV / no formal schooling needed */}
      <section className="section pt-0">
        <div className="container-content">
          <Reveal>
            <div className="flex flex-col gap-5 rounded-3xl border border-gold-200 bg-gold-50 p-7 sm:flex-row sm:items-center sm:p-9">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gold-400/25 text-gold-700">
                <HeartHandshake size={26} />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-canopy">
                  No CV? No formal schooling? You are still welcome.
                </h2>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/70">
                  Ours is a large community, and not everyone has had the same
                  chance at formal education or a written CV. That does not make
                  you any less capable of leading. If you are committed to helping
                  build this organisation, we want to hear from you. The CV upload
                  below is completely optional.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Application form */}
      <section id="apply" className="section scroll-mt-24 bg-paper">
        <div className="container-content max-w-3xl">
          <Reveal>
            <div className="mb-8 text-center">
              <p className="eyebrow justify-center">
                <span className="h-px w-6 bg-gold-400" />
                The application
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-canopy sm:text-3xl">
                Put your name forward
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-ink/60">
                {account
                  ? "It takes about 5 minutes. Fields without an “optional” tag are required. Your details go straight to the Secretariat."
                  : "Applications are tied to an account so the process stays fair and traceable."}
              </p>
            </div>
          </Reveal>

          {account ? (
            <Reveal delay={0.1}>
              {/* Signed-in identity banner with the applicant's unique BYM ID */}
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-canopy/10 bg-canopy p-4 text-white canopy-texture">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/20 text-gold-200">
                    <BadgeCheck size={20} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {account.fullName || "Signed in"}
                    </p>
                    <p className="text-xs text-white/60">Applying as a verified account</p>
                  </div>
                </div>
                {account.membershipId && (
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider text-white/50">
                      Your BYM ID
                    </p>
                    <p className="font-mono text-sm font-semibold text-gold-200">
                      {account.membershipId}
                    </p>
                  </div>
                )}
              </div>
              <div className="rounded-3xl border border-canopy/10 bg-white p-6 shadow-card sm:p-9">
                <LeadershipApplicationForm account={account} />
              </div>
            </Reveal>
          ) : (
            <Reveal delay={0.1}>
              <ApplyAccountGate />
            </Reveal>
          )}
        </div>
      </section>

      {/* Hybrid vetting explainer */}
      <section className="section pt-0">
        <div className="container-content max-w-3xl">
          <Reveal>
            <div className="rounded-3xl bg-canopy p-8 text-white canopy-texture sm:p-10">
              <p className="eyebrow-light">
                <span className="h-px w-5 bg-gold-400" />
                How vetting works
              </p>
              <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                A hybrid process — no one is left out
              </h2>
              <p className="mt-2 max-w-2xl text-white/75">
                We know many of our people are away from home for work or study.
                So vetting is run two ways, and you tell us which suits you in the
                form above.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-inset ring-white/15">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/20 text-gold-200">
                    <MapPin size={18} />
                  </span>
                  <h3 className="mt-3 font-semibold text-white">In-person</h3>
                  <p className="mt-1 text-sm text-white/70">
                    Held in Sefwi Bekwai for those who are home during the vetting
                    window. Meet the panel face to face.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 p-5 ring-1 ring-inset ring-white/15">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/20 text-gold-200">
                    <Video size={18} />
                  </span>
                  <h3 className="mt-3 font-semibold text-white">Virtual</h3>
                  <p className="mt-1 text-sm text-white/70">
                    An online session for applicants who are far from home at the
                    time — so distance is never a barrier to serving.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
