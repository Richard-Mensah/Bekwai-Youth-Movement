import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Camera } from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import SectionHeading from "@/components/ui/SectionHeading"

/** One photo tile: hover-zoom + optional caption overlay. */
function Photo({
  src,
  alt,
  caption,
  className = "",
  sizes,
}: {
  src: string
  alt: string
  caption?: string
  className?: string
  sizes: string
}) {
  return (
    <figure className={`group relative overflow-hidden rounded-2xl border border-canopy/10 ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {caption && (
        <>
          <div className="absolute inset-0 bg-gradient-to-t from-canopy/85 via-canopy/10 to-transparent opacity-90" />
          <figcaption className="absolute inset-x-0 bottom-0 flex items-center gap-2 p-4 text-sm font-semibold text-white">
            <Camera size={15} className="shrink-0 text-gold-300" />
            {caption}
          </figcaption>
        </>
      )}
    </figure>
  )
}

const P = "/images/history"

/**
 * Homepage "Moments" — a curated editorial photo layout from BYM's 2021
 * beginnings (radio talks, clean-ups, outreach, recognition), linking to the
 * full gallery.
 */
export default function GalleryHighlights() {
  return (
    <section className="section bg-paper">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Moments"
            title="The movement in pictures"
            description="From radio talks and debates to community clean-ups and outreach — glimpses of the Bekwai Youth Movement in action since 2021, across our 33 communities."
          />
        </Reveal>

        {/* Editorial hero row: one feature + two stacked */}
        <Reveal delay={0.1} className="mt-10">
          <div className="grid gap-4 md:grid-cols-3">
            <Photo
              src={`${P}/when we first started with an interview.jpg`}
              alt="A BYM member speaking on the street with a movement microphone"
              caption="Taking our message to the streets, 2021"
              className="h-72 md:col-span-2 md:h-[28rem]"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="grid grid-rows-2 gap-4">
              <Photo
                src={`${P}/IMG-20211210-WA0013.jpg`}
                alt="BYM members together in the community"
                className="h-56 md:h-full"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <Photo
                src={`${P}/275513517_145137107982869_5887215383066194674_n.jpg`}
                alt="BYM volunteers on a community clean-up"
                caption="Community clean-up"
                className="h-56 md:h-full"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
        </Reveal>

        {/* Supporting row */}
        <Reveal delay={0.15} className="mt-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Photo
              src={`${P}/IMG-20211220-WA0002.jpg`}
              alt="BYM community outreach — donating supplies"
              className="aspect-[4/5]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <Photo
              src={`${P}/472434052_1644476419477350_7263677863074049163_n.jpg`}
              alt="BYM team receiving a community citation"
              caption="Recognised by our community"
              className="aspect-[4/5]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <Photo
              src={`${P}/IMG-20211114-WA0037.jpg`}
              alt="BYM members on a radio engagement"
              className="aspect-[4/5]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            <Photo
              src={`${P}/IMG-20211210-WA0035.jpg`}
              alt="BYM volunteers sharing a light moment"
              className="aspect-[4/5]"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-8 text-center">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-canopy/20 bg-white px-6 py-3 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50"
          >
            View the full gallery
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
