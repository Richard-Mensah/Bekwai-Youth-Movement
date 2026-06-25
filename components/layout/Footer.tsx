import Link from "next/link"
import Image from "next/image"
import { Mail, MapPin, ArrowRight } from "lucide-react"
import { FOOTER_NAV, ORG } from "@/constants/nav"

const TRUST = [
  "Aligned with UN SDGs 2030",
  "Strictly non-political",
  "Endorsed by Traditional Authority",
  "Serving 32 communities",
]

export default function Footer() {
  return (
    <footer className="canopy-texture bg-canopy text-white/70">
      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-content grid gap-6 py-12 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h3 className="font-display text-2xl font-semibold text-white">
              Stay close to the movement
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/70">
              Get community reports, programme news, and updates on the road to
              Founding Day — straight to your inbox.
            </p>
          </div>
          <form
            className="flex w-full max-w-md gap-2 md:ml-auto"
            action={`mailto:${ORG.email}`}
            method="post"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="you@example.com"
              className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm text-white placeholder:text-white/40 focus:border-gold-400/60 focus:outline-none"
            />
            <button
              type="submit"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gold-400 px-5 py-3 text-sm font-semibold text-canopy transition-colors hover:bg-gold-300"
            >
              Subscribe <ArrowRight size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Main */}
      <div className="container-content grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full ring-2 ring-gold-400/40">
              <Image
                src="/images/logo.jpg"
                alt={`${ORG.name} logo`}
                width={48}
                height={48}
                className="rounded-full"
              />
            </span>
            <div>
              <p className="font-display text-lg font-semibold text-white">
                {ORG.name}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-gold-300">
                {ORG.motto}
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
            A non-political youth governance movement harnessing the potential of
            every young person in Sefwi Bekwai and its 31 sub-communities — through
            the Youth General Assembly, Bekwai Youth Parliament, and Community
            Intelligence Network.
          </p>
          <a
            href={ORG.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-gold-300 hover:text-gold-200"
          >
            Read our stories on Medium <ArrowRight size={15} />
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Explore
          </h3>
          <ul className="mt-4 grid grid-cols-1 gap-2.5 text-sm">
            {FOOTER_NAV.map((item) => (
              <li key={item.href + item.label}>
                <Link href={item.href} className="text-white/65 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li className="flex gap-2.5">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-300" />
              <span>{ORG.region}</span>
            </li>
            <li className="flex gap-2.5">
              <Mail size={16} className="mt-0.5 shrink-0 text-gold-300" />
              <a href={`mailto:${ORG.email}`} className="hover:text-white">
                {ORG.email}
              </a>
            </li>
            <li className="pt-1">
              <Link
                href="/join"
                className="inline-flex items-center gap-1.5 font-semibold text-gold-300 hover:text-gold-200"
              >
                Become a member <ArrowRight size={15} />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Trust marks */}
      <div className="border-t border-white/10">
        <div className="container-content flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-5 text-xs font-medium text-white/55">
          {TRUST.map((t) => (
            <span key={t} className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/45 sm:flex-row">
          <p>
            © {ORG.established} {ORG.name}. Aligned with the UN SDGs 2030.
          </p>
          <p>Sefwi Bekwai · Western North Region · Republic of Ghana</p>
        </div>
      </div>
    </footer>
  )
}
