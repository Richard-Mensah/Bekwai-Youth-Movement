import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import { getPublicMembersData } from "@/lib/data/content"

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || "BY"
}

/** Social-proof wall of verified, opted-in members (first name + avatar). */
export default async function MembersWall() {
  const { members, total } = await getPublicMembersData(18)
  if (total === 0) return null

  return (
    <section className="section bg-canopy text-white canopy-texture">
      <div className="container-content">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow-light justify-center">
            <span className="h-px w-5 bg-gold-400" />
            Our people
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
            Join {total.toLocaleString()} young leader{total === 1 ? "" : "s"} already
            building the movement
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            Real young people from across our 32 communities — volunteering,
            representing, and shaping Sefwi Bekwai&apos;s future together.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {members.map((m) => (
              <div key={m.id} className="w-20 text-center sm:w-24">
                <div className="mx-auto h-16 w-16 overflow-hidden rounded-full ring-2 ring-gold-400/40 sm:h-20 sm:w-20">
                  {m.photoUrl ? (
                    <Image
                      src={m.photoUrl}
                      alt={m.firstName}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/10 font-display text-lg font-semibold text-gold-300">
                      {initials(m.firstName)}
                    </div>
                  )}
                </div>
                <p className="mt-2 truncate text-xs font-medium text-white/85">
                  {m.firstName}
                </p>
                {m.communityName && (
                  <p className="truncate text-[10px] text-white/45">{m.communityName}</p>
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10 text-center">
          <a
            href="/join"
            className="inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-brand-red-600"
          >
            Become a member <ArrowRight size={16} />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
