import { MapPin, ExternalLink } from "lucide-react"

// Sefwi Bekwai, Western North Region, Ghana (approx).
const LAT = 6.2014
const LNG = -2.3266
// Bounding box around the town for the embedded map view.
const BBOX = [LNG - 0.5, LAT - 0.4, LNG + 0.5, LAT + 0.4]
const EMBED = `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX.join(
  ","
)}&layer=mapnik&marker=${LAT},${LNG}`
const LARGE = `https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=10/${LAT}/${LNG}`

/** Real, zoomable OpenStreetMap embed centred on Sefwi Bekwai. */
export default function WesternNorthMap() {
  return (
    <div className="overflow-hidden rounded-3xl border border-canopy/10 bg-white shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-canopy/10 px-5 py-3">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-canopy">
          <MapPin size={16} className="text-gold-500" />
          Sefwi Bekwai · Western North Region, Ghana
        </p>
        <a
          href={LARGE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:underline"
        >
          View larger map <ExternalLink size={12} />
        </a>
      </div>
      <iframe
        title="Map of Sefwi Bekwai, Western North Region, Ghana"
        src={EMBED}
        loading="lazy"
        className="h-[320px] w-full border-0 sm:h-[420px]"
      />
    </div>
  )
}
