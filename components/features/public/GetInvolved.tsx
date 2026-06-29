import Link from "next/link"
import { ArrowRight, UserPlus, HandHeart, Users, Vote, Radar } from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import Button from "@/components/ui/Button"

const PATHS = [
  { icon: UserPlus, label: "Become a member", note: "Open to all young people" },
  { icon: HandHeart, label: "Volunteer", note: "Join a Volunteer Action Team" },
  { icon: Users, label: "Council Representative", note: "Represent your community" },
  { icon: Vote, label: "Youth Parliament", note: "Ages 10–45" },
  { icon: Radar, label: "Intelligence Officer", note: "Report what matters" },
]

/** Final conversion band — membership pathways + primary CTA. */
export default function GetInvolved() {
  return (
    <section className="relative overflow-hidden bg-canopy text-white">
      <div className="absolute inset-0 canopy-texture" />
      <div className="container-content relative section">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-light justify-center">
            <span className="h-px w-5 bg-gold-400" />
            Get involved
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-white text-balance sm:text-4xl">
            Be part of the change in your community
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            There&apos;s a place for every young person in Sefwi Bekwai, whether you
            want to lead, volunteer, represent, or simply stay informed.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {PATHS.map(({ icon: Icon, label, note }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-center"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-gold-300">
                  <Icon size={20} />
                </span>
                <p className="mt-3 text-sm font-semibold text-white">{label}</p>
                <p className="mt-0.5 text-xs text-white/55">{note}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 flex flex-wrap justify-center gap-3">
          <Button
            href="/join"
            size="lg"
            className="bg-gold-400 text-canopy hover:bg-gold-300 focus-visible:ring-gold"
          >
            Register as a member <ArrowRight size={18} />
          </Button>
          <Button href="/transparency" size="lg" variant="light">
            View our transparency portal
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
