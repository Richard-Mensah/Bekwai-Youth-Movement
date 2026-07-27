import Link from "next/link"
import { ArrowRight } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import { SDG_GOALS } from "@/constants/sdgs"

const INK_LUMINANCE = 0.0129 // #111827

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const c = hex.replace("#", "")
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255)
  const lin = (v: number) =>
    v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

function contrast(a: number, b: number): number {
  const [hi, lo] = a > b ? [a, b] : [b, a]
  return (hi + 0.05) / (lo + 0.05)
}

/**
 * Picks the readable foreground for an SDG tile.
 *
 * The official palette runs from deep navy to bright yellow-green, so the white
 * text every tile used to carry failed on the light ones — SDG 11 measured 2.09
 * against white, less than half the 4.5 minimum. Rather than guess a luminance
 * cutoff, measure both candidates and take the winner; across all twelve goals
 * that clears 4.5 on every tile.
 */
function readableOn(hex: string): "ink" | "white" {
  const bg = luminance(hex)
  return contrast(bg, INK_LUMINANCE) > contrast(bg, 1) ? "ink" : "white"
}

/** Rich, colour-coded showcase of the 12 aligned UN Global Goals. */
export default function SdgShowcase() {
  return (
    <section className="section">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="Global alignment"
            title="Aligned with 12 UN Sustainable Development Goals"
            description="Every unit, programme, and governance activity maps to the UN 2030 Agenda, making BYM's work globally recognised and fundable by development partners."
          />
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {SDG_GOALS.map((sdg) => {
              const dark = readableOn(sdg.color) === "ink"
              return (
                <Link
                  key={sdg.goal}
                  href="/sdgs"
                  aria-label={`Goal ${sdg.goal}: ${sdg.title}`}
                  className="group relative flex aspect-square flex-col justify-between overflow-hidden rounded-xl p-4 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
                  style={{ backgroundColor: sdg.color }}
                >
                  {/* Depth without altering the official colour: a wash that
                      deepens toward the lower corner, plus a sheen that only
                      travels across on hover. */}
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-br from-white/[0.18] via-transparent to-black/[0.18]"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10"
                  />

                  <span
                    className={`relative font-display text-2xl font-bold leading-none tabular-nums ${
                      dark ? "text-ink/85" : "text-white"
                    }`}
                  >
                    {String(sdg.goal).padStart(2, "0")}
                  </span>
                  <span
                    className={`relative mt-6 text-xs font-semibold leading-snug ${
                      dark ? "text-ink/80" : "text-white"
                    }`}
                  >
                    {sdg.title}
                  </span>
                </Link>
              )
            })}
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <Link
            href="/sdgs"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-canopy hover:text-canopy-600 dark:text-paper dark:hover:text-gold-200"
          >
            See our full SDG alignment framework
            <ArrowRight size={16} />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
