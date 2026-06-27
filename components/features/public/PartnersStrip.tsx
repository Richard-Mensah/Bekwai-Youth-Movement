import Image from "next/image"
import Reveal from "@/components/ui/Reveal"
import { getPartners } from "@/lib/data/content"

/** Partner & sponsor logos. Renders nothing until partners are added in the CMS. */
export default async function PartnersStrip() {
  const partners = await getPartners()
  if (partners.length === 0) return null

  return (
    <section className="border-y border-canopy/10 bg-white">
      <div className="container-content py-12">
        <Reveal className="text-center">
          <p className="eyebrow justify-center">
            <span className="h-px w-5 bg-gold-400" />
            Partners & supporters
          </p>
        </Reveal>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {partners.map((p) => {
            const inner = p.logoUrl ? (
              <Image
                src={p.logoUrl}
                alt={p.name}
                width={140}
                height={56}
                className="h-12 w-auto object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
              />
            ) : (
              <span className="text-sm font-semibold text-ink/50">{p.name}</span>
            )
            return p.url ? (
              <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" title={p.name}>
                {inner}
              </a>
            ) : (
              <span key={p.id} title={p.name}>
                {inner}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}
