import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import ProgramsGridClient from "@/components/features/public/ProgramsGridClient"
import { UNITS } from "@/constants/units"

/** The 7 operational Units presented as BYM's programme areas. */
export default function ProgramsGrid() {
  return (
    <section className="section bg-paper dark:bg-canopy-900">
      <div className="container-content">
        <Reveal>
          <SectionHeading
            eyebrow="What we do"
            title="Seven programme units, one shared agenda"
            description="Each unit carries a clear mandate, a portfolio officer, and a direct line to the UN Global Goals — turning youth energy into measurable community change."
            centered
          />
        </Reveal>
        <ProgramsGridClient units={UNITS} />
      </div>
    </section>
  )
}
