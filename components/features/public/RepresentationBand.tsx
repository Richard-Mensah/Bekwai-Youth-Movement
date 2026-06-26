import { Vote, Users, Radar } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import { getCommunities } from "@/lib/data/content"

const SEATS = [
  {
    icon: Vote,
    title: "Youth Parliament Member",
    age: "Ages 10–45",
    body: "Legislative voice — debates issues and submits Youth Recommendations.",
  },
  {
    icon: Users,
    title: "Council Representative",
    age: "Ages 18–45",
    body: "Executive voice — carries community priorities into the Assembly.",
  },
  {
    icon: Radar,
    title: "Community Intelligence Officer",
    age: "Ages 18+",
    body: "Evidence voice — reports monthly on what's really happening on the ground.",
  },
]

/** "No community left without a voice" — the 3-rep model + 32-community grid. */
export default async function RepresentationBand() {
  const communities = await getCommunities()
  return (
    <section className="section">
      <div className="container-content grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-5 bg-gold-400" />
            Representation policy
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-canopy text-balance sm:text-4xl">
            No community left without a voice
          </h2>
          <p className="mt-5 leading-relaxed text-ink/70">
            Every one of our 32 communities — from Sefwi Bekwai town to the
            furthest sub-community — is entitled to three dedicated representatives.
            Where a seat is unfilled, an interim protocol guarantees the community
            is still heard.
          </p>

          <div className="mt-7 space-y-3">
            {SEATS.map(({ icon: Icon, title, age, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-canopy/10 bg-white p-4 shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canopy text-gold-300">
                  <Icon size={20} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-canopy">{title}</h3>
                    <span className="text-xs font-medium text-gold-600">{age}</span>
                  </div>
                  <p className="mt-0.5 text-sm text-ink/60">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="rounded-3xl bg-canopy p-8 text-white canopy-texture">
            <p className="font-display text-5xl font-semibold text-gold-300">32</p>
            <p className="mt-1 text-sm text-white/70">
              communities, each with a seat at the table
            </p>
            <div className="mt-6 flex flex-wrap gap-1.5">
              {communities.map((c) => (
                <span
                  key={c.id}
                  className={`rounded-md px-2.5 py-1 text-xs font-medium ${
                    c.isTown
                      ? "bg-gold-400 text-canopy"
                      : "bg-white/10 text-white/80"
                  }`}
                >
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
