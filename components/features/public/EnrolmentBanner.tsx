import Link from "next/link"
import { ArrowRight, Megaphone } from "lucide-react"
import Reveal from "@/components/ui/Reveal"

/**
 * Homepage call-to-action inviting qualified youth to apply for leadership
 * roles. Links straight to the application to ease enrolment.
 */
export default function EnrolmentBanner() {
  return (
    <section className="section">
      <div className="container-content">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-canopy p-8 text-white canopy-texture sm:p-10">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/15 blur-3xl" />
            <div className="relative flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-200 ring-1 ring-inset ring-gold-400/30">
                  <Megaphone size={14} />
                  Leadership enrolment is open
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                  Ready to serve? Apply to lead the movement.
                </h2>
                <p className="mt-2 text-white/75">
                  Every office is open, from Director-General to community seats.
                  Create your free account, get your unique BYM ID, and put your
                  name forward. No CV required.
                </p>
              </div>
              <Link
                href="/leadership/apply"
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 text-sm font-semibold text-canopy shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gold-300"
              >
                Start your application
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
