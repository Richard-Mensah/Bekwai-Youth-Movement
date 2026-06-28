import Image from "next/image"
import { ArrowRight, Users } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
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
    <section className="section bg-paper dark:bg-canopy-900">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Our people"
            title={`Join ${total.toLocaleString()} young leader${
              total === 1 ? "" : "s"
            } building the movement`}
            description="Real young people from across our 32 communities — volunteering, representing, and shaping Sefwi Bekwai's future together."
            centered
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-4">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex w-24 flex-col items-center rounded-2xl border border-canopy/10 bg-white p-3 text-center shadow-card sm:w-28 dark:border-white/10 dark:bg-canopy-800"
              >
                <div className="h-16 w-16 overflow-hidden rounded-full ring-2 ring-gold-400/40 sm:h-20 sm:w-20">
                  {m.photoUrl ? (
                    <Image
                      src={m.photoUrl}
                      alt={m.firstName}
                      width={72}
                      height={72}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-canopy-50 font-display text-lg font-semibold text-canopy dark:bg-white/10 dark:text-gold-300">
                      {initials(m.firstName)}
                    </div>
                  )}
                </div>
                <p className="mt-2 w-full truncate text-xs font-semibold text-canopy dark:text-paper">
                  {m.firstName}
                </p>
                {m.communityName && (
                  <p className="w-full truncate text-[10px] text-ink/45 dark:text-paper/45">
                    {m.communityName}
                  </p>
                )}
              </div>
            ))}

            {total > members.length && (
              <div className="flex w-24 flex-col items-center justify-center rounded-2xl border border-dashed border-canopy/20 bg-white p-3 text-center sm:w-28 dark:border-white/20 dark:bg-canopy-800">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-50 text-gold-600 sm:h-20 sm:w-20">
                  <Users size={22} />
                </span>
                <p className="mt-2 text-xs font-semibold text-canopy dark:text-paper">
                  +{(total - members.length).toLocaleString()}
                </p>
                <p className="text-[10px] text-ink/45 dark:text-paper/45">more</p>
              </div>
            )}
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
