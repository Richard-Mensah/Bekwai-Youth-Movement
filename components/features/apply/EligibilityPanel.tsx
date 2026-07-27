import { CheckCircle2, Info } from "lucide-react"
import { ageFitsOffice, type Office } from "@/constants/offices"
import { cn } from "@/lib/utils"

type Props = {
  office: Office
  age: number | null
  className?: string
}

/**
 * Advisory eligibility summary shown beside the applicant's details.
 *
 * The age bands come from Schedule III of the Constitution and are guidance
 * only — nothing here ever blocks a submission. If someone falls outside the
 * band we say so plainly and invite them to apply anyway; the Vetting Panel
 * decides, not this form.
 */
export default function EligibilityPanel({ office, age, className }: Props) {
  const fits = ageFitsOffice(office, age)

  return (
    <div
      className={cn(
        "rounded-2xl border p-4",
        fits === false
          ? "border-gold-300 bg-gold-50 dark:border-gold-400/25 dark:bg-gold-400/10"
          : "border-canopy/[0.12] bg-paper/70 dark:border-white/10 dark:bg-white/5",
        className
      )}
    >
      <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink/45 dark:text-paper/45">
        <Info size={13} />
        What this office asks for
      </p>

      <ul className="mt-2.5 space-y-1.5">
        {office.ageRange && (
          <li className="flex items-start gap-2 text-xs leading-relaxed">
            <CheckCircle2
              size={13}
              className={cn(
                "mt-0.5 shrink-0",
                fits === true
                  ? "text-brand-green"
                  : fits === false
                    ? "text-gold-600 dark:text-gold-300"
                    : "text-ink/30 dark:text-paper/30"
              )}
            />
            <span className="text-ink/70 dark:text-paper/65">
              Ages {office.ageRange[0]}–{office.ageRange[1]}
              {office.term ? ` · ${office.term}` : ""}
            </span>
          </li>
        )}
        {office.eligibility.slice(0, 3).map((e) => (
          <li key={e} className="flex items-start gap-2 text-xs leading-relaxed">
            <CheckCircle2
              size={13}
              className="mt-0.5 shrink-0 text-ink/30 dark:text-paper/30"
            />
            <span className="text-ink/70 dark:text-paper/65">{e}</span>
          </li>
        ))}
      </ul>

      {fits === false && age != null && (
        <p className="mt-3 rounded-lg bg-white/70 px-3 py-2.5 text-xs leading-relaxed text-ink/70 dark:bg-canopy-900/30 dark:text-paper/70">
          You are {age}, and the Constitution sets this office at{" "}
          {office.ageRange![0]}–{office.ageRange![1]}. You can still apply — the
          Vetting Panel considers every application on its merits, and your
          second choice may be a closer fit.
        </p>
      )}
    </div>
  )
}
