import Image from "next/image"
import Reveal from "@/components/ui/Reveal"
import Button from "@/components/ui/Button"
import { ArrowRight } from "lucide-react"

/** A single collage photo tile with hover-zoom and an optional caption. */
function Photo({
  src,
  alt,
  ratio,
  caption,
}: {
  src: string
  alt: string
  ratio: string
  caption?: string
}) {
  return (
    <figure
      className={`group relative mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-canopy/10 ${ratio}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 45vw, 22vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      {caption && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-canopy/10 to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-3 text-xs font-semibold text-white">
            {caption}
          </figcaption>
        </>
      )}
    </figure>
  )
}

/** "Who we are" — mission + the new flagship-initiatives framing. */
export default function MissionIntro() {
  return (
    <section className="section">
      <div className="container-content grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">
            <span className="h-px w-5 bg-gold-400" />
            Who we are
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-canopy text-balance sm:text-4xl">
            A grassroots movement, now building lasting institutions
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/70 dark:text-paper/70 text-pretty">
            The Bekwai Youth Movement exists to harness the potential of all young
            people in Sefwi Bekwai and its 31 surrounding sub-communities, through
            structured governance, community intelligence, volunteerism, and
            sustained leadership development, aligned with the UN SDGs.
          </p>
          <p className="mt-4 leading-relaxed text-ink/65 dark:text-paper/65">
            To deliver on that promise, the movement is bringing on board two
            flagship initiatives: a <strong className="text-canopy dark:text-paper">Youth
            General Assembly</strong> and a <strong className="text-canopy dark:text-paper">Bekwai
            Youth Parliament</strong>, supported by a Community Intelligence
            Network that gives every community a voice and every decision an
            evidence base.
          </p>
          <div className="mt-7">
            <Button href="/about" variant="outline">
              Read our story <ArrowRight size={16} />
            </Button>
          </div>
        </Reveal>

        {/* Engaging photo collage (bento masonry) */}
        <Reveal delay={0.1}>
          <div className="columns-2 gap-4">
            <Photo
              src="/images/history/279361960_158851559944757_3313056682566741472_n.jpg"
              alt="BYM members gathered with a community elder"
              ratio="aspect-[4/3]"
              caption="One movement, 32 communities"
            />
            <div className="mb-4 break-inside-avoid rounded-2xl bg-canopy p-5 text-white canopy-texture">
              <p className="font-display text-3xl font-semibold text-gold-300">2021</p>
              <p className="mt-1 text-sm text-white/75">
                Grassroots beginnings in Sefwi Bekwai
              </p>
            </div>
            <Photo
              src="/images/history/IMG-20211210-WA0035.jpg"
              alt="BYM volunteers sharing a light moment"
              ratio="aspect-square"
            />
            <Photo
              src="/images/history/IMG-20211220-WA0002.jpg"
              alt="BYM community outreach — donating supplies"
              ratio="aspect-[3/4]"
              caption="Service over self"
            />
            <div className="mb-4 break-inside-avoid rounded-2xl border border-canopy/10 bg-paper p-5 dark:border-white/10 dark:bg-canopy-800">
              <p className="font-display text-3xl font-semibold text-canopy dark:text-paper">31</p>
              <p className="mt-1 text-sm text-ink/65 dark:text-paper/65">
                sub-communities united under one movement
              </p>
            </div>
            <Photo
              src="/images/history/IMG-20211113-WA0024.jpg"
              alt="BYM members on air during a radio engagement"
              ratio="aspect-[3/4]"
              caption="On air in Sefwi Bekwai"
            />
            <Photo
              src="/images/history/IMG-20211210-WA0048.jpg"
              alt="Young women and men serving side by side"
              ratio="aspect-square"
            />
            <Photo
              src="/images/history/IMG-20211210-WA0006.jpg"
              alt="Bekwai Youth Movement branded shirts"
              ratio="aspect-[4/3]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
