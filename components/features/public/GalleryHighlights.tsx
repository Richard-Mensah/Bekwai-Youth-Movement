import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import Reveal from "@/components/ui/Reveal"
import SectionHeading from "@/components/ui/SectionHeading"
import { getGallery } from "@/lib/data/content"

/**
 * Homepage "Moments" strip — a masonry preview of gallery photos that links
 * through to the full gallery. Renders nothing if there are no images.
 */
export default async function GalleryHighlights() {
  const photos = (await getGallery()).slice(0, 10)
  if (photos.length === 0) return null

  return (
    <section className="section bg-paper">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Moments"
            title="The movement in pictures"
            description="From debates and radio engagements to community outreach — a glimpse of the Bekwai Youth Movement in action across our 32 communities."
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
            {photos.map((p) => (
              <div
                key={p.id}
                className="group relative block w-full overflow-hidden rounded-xl border border-canopy/10"
              >
                <Image
                  src={p.url}
                  alt={p.caption || "Bekwai Youth Movement activity"}
                  width={500}
                  height={500}
                  className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute inset-0 bg-canopy/0 transition-colors group-hover:bg-canopy/15" />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-8 text-center">
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
