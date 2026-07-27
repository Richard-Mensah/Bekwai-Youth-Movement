import { Globe2, ShieldCheck, Landmark, Users } from "lucide-react"
import { COMMUNITY_COUNT } from "@/constants/communities"

const MARKS = [
  { icon: Globe2, label: "Aligned with UN SDGs 2030" },
  { icon: ShieldCheck, label: "Strictly non-political" },
  { icon: Landmark, label: "Endorsed by Traditional Authority" },
  // Derived, so the band cannot outlive the community list it counts.
  { icon: Users, label: `Serving ${COMMUNITY_COUNT} communities` },
]

/** Slim credibility band directly beneath the hero. */
export default function TrustBar() {
  return (
    <div className="border-b border-canopy/10 bg-paper dark:border-white/10 dark:bg-canopy-900">
      {/* Hairline dividers rather than gutters: four marks reading as one
          continuous statement of standing, not four loose chips. */}
      <div className="container-content grid grid-cols-2 divide-canopy/[0.08] py-2 dark:divide-white/[0.08] md:grid-cols-4 md:divide-x">
        {MARKS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="group flex items-center gap-3 py-4 md:justify-center md:px-5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canopy-50 text-canopy transition-colors duration-300 group-hover:bg-canopy group-hover:text-gold-300 dark:bg-white/10 dark:text-gold-300">
              <Icon size={16} aria-hidden />
            </span>
            <span className="text-[0.8125rem] font-medium leading-snug text-ink/75 dark:text-paper/75">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
