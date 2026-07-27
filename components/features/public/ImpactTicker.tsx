import { getSettings } from "@/lib/data/content"

/** Live impact ticker — a slim animated marquee band of headline numbers,
 * sitting between the hero and the trust bar. Reuses the `marquee` keyframe
 * already defined in tailwind.config.ts. Pauses on hover. */
export default async function ImpactTicker() {
  const { stats } = await getSettings()

  const chips = [
    `${stats.communities} communities served`,
    `${stats.cabinet} Civic Cabinet portfolios`,
    `${stats.reps} representatives per community`,
    `${stats.sdgs} UN SDGs aligned`,
    `${stats.women}% minimum women's seats`,
    "Strictly non-political",
    "Endorsed by Traditional Authority",
    "Volunteering for Change",
  ]

  // Duplicate the track once so the -50% translate loops seamlessly.
  const track = [...chips, ...chips]

  return (
    <div className="relative overflow-hidden border-y border-white/[0.08] bg-canopy py-3 dark:bg-canopy-800">
      {/* The track was cut off dead straight at both edges, which reads as a
          clipped element rather than a continuous band. Fading it out lets the
          motion arrive from and depart into the page. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canopy to-transparent dark:from-canopy-800 sm:w-28"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canopy to-transparent dark:from-canopy-800 sm:w-28"
      />

      <div className="group flex">
        <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {track.map((chip, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 text-sm font-medium tracking-tight text-gold-200">
                {chip}
              </span>
              <span
                className="h-1 w-1 rounded-full bg-gold-400/50"
                aria-hidden="true"
              />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
