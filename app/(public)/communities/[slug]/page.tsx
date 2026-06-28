import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  MapPin,
  Crown,
  Users2,
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  Vote,
  Users,
  Radar,
} from "lucide-react"
import {
  getCommunityBySlug,
  getCommunityReps,
  SEAT_LABELS,
  type SeatType,
} from "@/lib/data/content"
import SectionHeading from "@/components/ui/SectionHeading"
import Button from "@/components/ui/Button"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) return { title: "Community not found" }
  return {
    title: `${community.name} — Community`,
    description:
      community.about ??
      `${community.name}, ${
        community.isTown ? "the town" : "a sub-community"
      } of the Sefwi Bekwai Traditional Area, and its BYM representation.`,
  }
}

const SEAT_ICON: Record<SeatType, typeof Vote> = {
  mp: Vote,
  council_rep: Users,
  cin_officer: Radar,
}
const SEAT_ORDER: SeatType[] = ["mp", "council_rep", "cin_officer"]

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "BY"
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const community = await getCommunityBySlug(slug)
  if (!community) notFound()

  const reps = await getCommunityReps(community.id)
  const repBySeat = new Map<SeatType, typeof reps>()
  for (const seat of SEAT_ORDER) repBySeat.set(seat, reps.filter((r) => r.seatType === seat))

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-canopy text-white canopy-texture">
        <div className="container-content py-16 md:py-20">
          <Link
            href="/communities"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-white/70 hover:text-white"
          >
            <ArrowLeft size={16} /> All communities
          </Link>
          <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-gold-300">
            <MapPin size={14} />
            {community.isTown
              ? "Town · seat of the Assembly"
              : "A sub-community of Sefwi Bekwai"}
          </span>
          <h1 className="mt-4 font-display text-4xl font-semibold sm:text-5xl">
            {community.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/75">
            {community.about ??
              `${community.name} is part of the Sefwi Bekwai Traditional Area in the Western North Region of Ghana — one of the communities represented within the Bekwai Youth Movement.`}
          </p>
        </div>
      </section>

      {/* Traditional authority */}
      <section className="section">
        <div className="container-content">
          <SectionHeading
            eyebrow="Traditional authority"
            title="Chief & elders"
            description="The traditional leadership that guards the values and legitimacy of the community."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                <Crown size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-canopy">
                {community.chief ?? "To be announced"}
              </h3>
              <p className="mt-1 text-sm text-ink/60">
                {community.chiefTitle ?? (community.isTown ? "Paramount Chief" : "Sub-Chief")}
              </p>
            </div>
            <div className="rounded-2xl border border-canopy/10 bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-50 text-gold-600">
                <Users2 size={22} />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-canopy">Elders</h3>
              {community.elders.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-ink/65">
                  {community.elders.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-ink/50">To be announced.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* BYM representatives */}
      <section className="section bg-paper">
        <div className="container-content">
          <SectionHeading
            eyebrow="BYM representation"
            title="Your representatives"
            description="Every community is entitled to three dedicated representatives. Filled seats are shown below; open seats are an invitation to serve."
          />
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SEAT_ORDER.map((seat) => {
              const holders = repBySeat.get(seat) ?? []
              const Icon = SEAT_ICON[seat]
              const filled = holders.length > 0
              return (
                <div
                  key={seat}
                  className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-6 shadow-card"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-canopy text-gold-300">
                      <Icon size={20} />
                    </span>
                    {filled ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green">
                        <CheckCircle2 size={14} /> Filled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink/40">
                        <CircleDashed size={14} /> Open
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-sm font-semibold text-canopy">
                    {SEAT_LABELS[seat]}
                  </h3>
                  {filled ? (
                    <ul className="mt-3 space-y-2">
                      {holders.map((r) => (
                        <li key={r.id} className="flex items-center gap-2.5">
                          <span className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-gold-400/40">
                            {r.photoUrl ? (
                              <Image
                                src={r.photoUrl}
                                alt={r.name}
                                width={36}
                                height={36}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="flex h-full w-full items-center justify-center bg-canopy-50 text-xs font-semibold text-canopy">
                                {initials(r.name)}
                              </span>
                            )}
                          </span>
                          <span className="text-sm font-medium text-ink/80">{r.name}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-3 flex-1 text-sm text-ink/55">
                      This seat is open. Could you be {community.name}&apos;s voice?
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <Button href="/join" variant="secondary">
              Represent {community.name}
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
