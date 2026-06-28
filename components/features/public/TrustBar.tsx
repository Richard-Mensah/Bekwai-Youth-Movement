import { Globe2, ShieldCheck, Landmark, Users } from "lucide-react"

const MARKS = [
  { icon: Globe2, label: "Aligned with UN SDGs 2030" },
  { icon: ShieldCheck, label: "Strictly non-political" },
  { icon: Landmark, label: "Endorsed by Traditional Authority" },
  { icon: Users, label: "Serving 32 communities" },
]

/** Slim credibility band directly beneath the hero. */
export default function TrustBar() {
  return (
    <div className="border-b border-canopy/10 bg-paper dark:border-white/10 dark:bg-canopy-900">
      <div className="container-content grid grid-cols-2 gap-x-6 gap-y-4 py-6 md:grid-cols-4">
        {MARKS.map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canopy-50 text-canopy dark:bg-white/10 dark:text-gold-300">
              <Icon size={17} />
            </span>
            <span className="text-sm font-medium text-ink/75 dark:text-paper/75">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
