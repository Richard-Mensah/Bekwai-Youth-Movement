import Image from "next/image"
import { User } from "lucide-react"
import Badge from "@/components/ui/Badge"
import type { LeaderItem } from "@/lib/data/content"

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

/** A photo-ready person card. Falls back to initials / icon before a headshot. */
export default function LeaderCard({ leader }: { leader: LeaderItem }) {
  const { name, photoUrl, title, ukEquivalent, blurb, sdg } = leader

  return (
    <div className="flex h-full flex-col rounded-2xl border border-canopy/10 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full ring-2 ring-gold-400/40">
          {photoUrl ? (
            <Image src={photoUrl} alt={name ?? title} fill className="object-cover" />
          ) : name ? (
            <div className="flex h-full w-full items-center justify-center bg-canopy font-display text-lg font-semibold text-gold-300">
              {initials(name)}
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-canopy-50 text-canopy/40">
              <User size={26} />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate font-display text-base font-semibold text-canopy">
            {name ?? "To be appointed"}
          </p>
          <p className="text-sm font-medium text-ink/70">{title}</p>
          {ukEquivalent && <p className="text-xs text-ink/45">{ukEquivalent}</p>}
        </div>
      </div>

      {blurb && (
        <p className="mt-4 flex-1 text-sm leading-relaxed text-ink/60">{blurb}</p>
      )}

      {sdg.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {sdg.map((g) => (
            <Badge key={g} tone="gold">
              SDG {g}
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
