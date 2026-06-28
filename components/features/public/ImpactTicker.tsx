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
    <div className="overflow-hidden border-b border-canopy-700 bg-canopy py-3 dark:bg-canopy-800">
      <div className="group flex">
        <div className="flex shrink-0 animate-marquee items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
          {track.map((chip, i) => (
            <span key={i} className="flex items-center">
              <span className="px-6 text-sm font-medium text-gold-200">{chip}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400/60" aria-hidden="true" />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
