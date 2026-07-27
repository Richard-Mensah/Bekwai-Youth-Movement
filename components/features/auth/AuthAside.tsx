import Image from "next/image"
import { Landmark, MapPinned, Target } from "lucide-react"
import { ORG } from "@/constants/nav"
import { COMMUNITY_COUNT } from "@/constants/communities"
import { CABINET_POSITIONS } from "@/constants/cabinet"
import { SDG_GOALS } from "@/constants/sdgs"

/** Figures are derived, never typed in, so they cannot drift from the movement. */
const FACTS = [
  {
    icon: MapPinned,
    value: COMMUNITY_COUNT,
    label: "communities represented",
  },
  {
    icon: Landmark,
    value: CABINET_POSITIONS.length,
    label: "Civic Cabinet offices",
  },
  { icon: Target, value: SDG_GOALS.length, label: "UN Global Goals" },
]

/**
 * The standing panel beside every auth form.
 *
 * Signing up was a lone card on an empty field: on a wide screen most of the
 * viewport did nothing, and the page asked for eight pieces of personal
 * information without once saying what the applicant was joining. This carries
 * that argument — who BYM is, and the scale someone is joining — so the form
 * itself can stay short and plain.
 *
 * Hidden below lg: on a phone it would push the form under the fold, and the
 * form is the thing someone came to fill in.
 */
export default function AuthAside() {
  return (
    <aside className="relative hidden overflow-hidden bg-canopy lg:block">
      <Image
        src="/images/history/472533608_1643728982885427_6727051425384547508_n.jpg"
        alt=""
        fill
        priority
        sizes="45vw"
        className="object-cover object-center opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-canopy via-canopy/90 to-canopy-700/85" />
      <div className="canopy-texture absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_30%_20%,transparent_40%,rgba(5,14,11,0.6)_100%)]" />

      <div className="relative flex h-full flex-col justify-between p-10 xl:p-14">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logo.jpg"
            alt=""
            width={44}
            height={44}
            className="rounded-full ring-1 ring-gold-400/40"
          />
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-white">
              {ORG.shortName}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-gold-300/80">
              {ORG.motto}
            </span>
          </span>
        </div>

        <div className="max-w-md">
          <p className="eyebrow-light">
            <span aria-hidden className="h-px w-6 bg-gold-400" />
            {ORG.assembly}
          </p>
          <h2 className="mt-5 font-display text-[2.5rem] font-semibold leading-[1.08] tracking-[-0.02em] text-white text-balance xl:text-5xl">
            Every young person in Sefwi Bekwai deserves a seat.
          </h2>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-white/70">
            A non-political movement building real governance — a Cabinet, a
            Youth Parliament, and evidence from every community — with the
            people it serves.
          </p>
        </div>

        <div>
          <dl className="grid grid-cols-3 gap-3">
            {FACTS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl border border-white/[0.12] bg-white/[0.06] p-4 backdrop-blur-sm"
              >
                <Icon size={16} className="text-gold-300" aria-hidden />
                <dt className="mt-2.5 font-display text-2xl font-semibold leading-none tabular-nums text-white">
                  {value}
                </dt>
                <dd className="mt-1 text-[11px] leading-snug text-white/55">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-xs text-white/45">
            Founding Day · 12 January 2027 · {ORG.region}
          </p>
        </div>
      </div>
    </aside>
  )
}
