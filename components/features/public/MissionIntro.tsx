import Image from "next/image"
import Reveal from "@/components/ui/Reveal"
import Button from "@/components/ui/Button"
import { ArrowRight, Landmark, Radar, HeartHandshake } from "lucide-react"
import { COMMUNITY_COUNT } from "@/constants/communities"

const PILLARS = [
  {
    icon: Landmark,
    title: "Structured governance",
    body: "A Youth General Assembly and a Bekwai Youth Parliament, with clear portfolios.",
  },
  {
    icon: Radar,
    title: "Community intelligence",
    body: "Monthly, ground-level evidence from all 33 communities informs every decision.",
  },
  {
    icon: HeartHandshake,
    title: "Volunteerism & leadership",
    body: "Service over self — leaders developed and aligned with the UN SDGs.",
  },
]

/** "Who we are" — mission + a magazine-style photo composition. */
export default function MissionIntro() {
  return (
    <section className="section overflow-hidden">
      <div className="container-content grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
        {/* ---- Narrative column ---- */}
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-5 bg-gold-400" />
            Who we are
            <span className="ml-1 text-ink/40 dark:text-paper/40">· Since 2021</span>
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-canopy text-balance dark:text-paper sm:text-4xl">
            A grassroots movement, now building lasting institutions
          </h2>
          <span className="mt-5 block h-1 w-16 rounded-full bg-gold-400" />
          <p className="mt-5 text-lg leading-relaxed text-ink/70 dark:text-paper/70 text-pretty">
            The Bekwai Youth Movement harnesses the potential of every young
            person in Sefwi Bekwai and its 32 surrounding sub-communities —
            turning volunteer energy into structured, accountable institutions.
          </p>

          {/* Pillars — scannable proof points */}
          <ul className="mt-7 space-y-4">
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <li key={title} className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-canopy-50 text-canopy dark:bg-canopy-800 dark:text-gold-300">
                  <Icon size={18} />
                </span>
                <div>
                  <p className="font-semibold text-canopy dark:text-paper">{title}</p>
                  <p className="text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                    {body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <Button href="/about" variant="outline">
              Read our story <ArrowRight size={16} />
            </Button>
          </div>
        </Reveal>

        {/* ---- Editorial photo bento ---- */}
        <Reveal delay={0.1}>
          <div className="relative">
            {/* soft depth glow */}
            <div className="absolute -right-10 -top-10 -z-10 h-52 w-52 rounded-full bg-gold-400/20 blur-3xl" />
            <div className="absolute -bottom-12 -left-8 -z-10 h-52 w-52 rounded-full bg-canopy/10 blur-3xl" />

            <div className="grid h-[30rem] grid-cols-4 grid-rows-4 gap-3 sm:h-[34rem] sm:gap-4">
              {/* Feature */}
              <figure className="group relative col-span-2 col-start-1 row-span-3 row-start-1 overflow-hidden rounded-2xl shadow-card ring-1 ring-canopy/10">
                <Image
                  src="/images/history/279361960_158851559944757_3313056682566741472_n.jpg"
                  alt="Bekwai Youth Movement members gathered with a community elder"
                  fill
                  sizes="(max-width: 1024px) 50vw, 26vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-canopy shadow-sm">
                  Est. 2021
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-canopy/5 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-semibold text-white">
                  One movement, 33 communities
                </figcaption>
              </figure>

              {/* Stat — 2021 */}
              <div className="col-span-2 col-start-3 row-start-1 flex flex-col justify-center rounded-2xl bg-canopy p-5 text-white canopy-texture ring-1 ring-canopy/20">
                <p className="font-display text-3xl font-semibold text-gold-300">2021</p>
                <p className="mt-0.5 text-xs leading-snug text-white/75">
                  Grassroots beginnings in Sefwi Bekwai
                </p>
              </div>

              {/* Tall image B */}
              <figure className="group relative col-start-3 row-span-2 row-start-2 overflow-hidden rounded-2xl shadow-card ring-1 ring-canopy/10">
                <Image
                  src="/images/history/when we first started with an interview.jpg"
                  alt="A BYM member speaking on the street with a movement microphone"
                  fill
                  sizes="(max-width: 1024px) 25vw, 13vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>

              {/* Tall image C */}
              <figure className="group relative col-start-4 row-span-2 row-start-2 overflow-hidden rounded-2xl shadow-card ring-1 ring-canopy/10">
                <Image
                  src="/images/history/IMG-20211220-WA0002.jpg"
                  alt="BYM community outreach — donating supplies"
                  fill
                  sizes="(max-width: 1024px) 25vw, 13vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </figure>

              {/* Caption image (bottom-left) */}
              <figure className="group relative col-span-2 col-start-1 row-start-4 overflow-hidden rounded-2xl shadow-card ring-1 ring-canopy/10">
                <Image
                  src="/images/history/IMG-20211210-WA0035.jpg"
                  alt="BYM volunteers sharing a light moment"
                  fill
                  sizes="(max-width: 1024px) 50vw, 26vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-canopy/70 to-transparent" />
                <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold text-white">
                  Volunteering for change
                </figcaption>
              </figure>

              {/* Stat — 31 */}
              <div className="col-span-2 col-start-3 row-start-4 flex flex-col justify-center rounded-2xl border border-canopy/10 bg-paper p-5 dark:border-white/10 dark:bg-canopy-800">
                <p className="font-display text-3xl font-semibold text-canopy dark:text-paper">
                  {COMMUNITY_COUNT - 1}
                  <span className="text-gold-500">+</span>
                </p>
                <p className="mt-0.5 text-xs leading-snug text-ink/60 dark:text-paper/60">
                  sub-communities united under one movement
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
