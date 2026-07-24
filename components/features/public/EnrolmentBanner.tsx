import Link from "next/link"
import Image from "next/image"
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
          <div className="relative overflow-hidden rounded-3xl bg-canopy text-white canopy-texture">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold-400/15 blur-3xl" />
            <div className="relative grid items-stretch gap-0 lg:grid-cols-[1.15fr_0.85fr]">
              {/* Copy + CTA */}
              <div className="p-8 sm:p-10 lg:p-12">
                <span className="inline-flex items-center gap-2 rounded-full bg-gold-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold-200 ring-1 ring-inset ring-gold-400/30">
                  <Megaphone size={14} />
                  Leadership enrolment is open
                </span>
                <h2 className="mt-4 font-display text-2xl font-semibold text-white sm:text-3xl">
                  Ready to serve? Apply to lead the movement.
                </h2>
                <p className="mt-2 max-w-xl text-white/75">
                  Every office is open, from Director-General to community seats.
                  Create your free account, get your unique BYM ID, and put your
                  name forward. No CV required.
                </p>
                <Link
                  href="/leadership/apply"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-400 px-6 py-3.5 text-sm font-semibold text-canopy shadow-lg transition-all hover:-translate-y-0.5 hover:bg-gold-300"
                >
                  Start your application
                  <ArrowRight size={16} />
                </Link>
              </div>

              {/* Photo */}
              <div className="relative min-h-[220px] overflow-hidden lg:min-h-full">
                <Image
                  src="/images/history/IMG-20211210-WA0013.jpg"
                  alt="Bekwai Youth Movement members together in the community"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                {/* Blend the photo into the canopy panel */}
                <div className="absolute inset-0 bg-gradient-to-t from-canopy/70 via-canopy/10 to-transparent lg:bg-gradient-to-r lg:from-canopy lg:via-canopy/20 lg:to-transparent" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
