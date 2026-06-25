import { SDG_GOALS } from "@/constants/sdgs"

/** Compact strip of the 12 aligned SDG goal chips. */
export default function SdgStrip() {
  return (
    <div className="flex flex-wrap gap-2">
      {SDG_GOALS.map((sdg) => (
        <span
          key={sdg.goal}
          className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-white"
          style={{ backgroundColor: sdg.color }}
          title={`SDG ${sdg.goal}: ${sdg.title}`}
        >
          SDG {sdg.goal}
          <span className="hidden font-normal opacity-90 sm:inline">
            {sdg.title}
          </span>
        </span>
      ))}
    </div>
  )
}
