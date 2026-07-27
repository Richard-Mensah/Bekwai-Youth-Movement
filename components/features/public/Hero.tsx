"use client"

import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ArrowRight, CalendarDays } from "lucide-react"
import Button from "@/components/ui/Button"
import Countdown from "@/components/ui/Countdown"
import HeroCarousel from "@/components/features/public/HeroCarousel"
import { ORG } from "@/constants/nav"
import { GALLERY_PHOTOS } from "@/constants/gallery"
import { useLanguage } from "@/components/i18n/LanguageProvider"

type Props = {
  eyebrow?: string
  title?: string
  subtitle?: string
  foundingDate?: string
  /** Photos for the hero carousel; falls back to the curated gallery. */
  images?: string[]
}

export default function Hero({
  eyebrow = ORG.region,
  title = "Harnessing the potential of every young person in Sefwi Bekwai",
  subtitle = "A non-political youth movement building structured governance, community intelligence, and volunteerism across 33 communities, aligned with the UN Sustainable Development Goals.",
  foundingDate = ORG.foundingDate,
  images,
}: Props) {
  const heroImages =
    images && images.length > 0
      ? images
      : GALLERY_PHOTOS.map((p) => p.path)
  const reduce = useReducedMotion()
  const { lang, t } = useLanguage()
  // In English, show the editable copy from Site Settings; in Twi, show the
  // curated translation from the dictionary.
  const heroEyebrow = lang === "tw" ? t("hero.eyebrow") : eyebrow
  const heroTitle = lang === "tw" ? t("hero.title") : title
  const heroSubtitle = lang === "tw" ? t("hero.subtitle") : subtitle
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  }
  const item: Variants = {
    hidden: { opacity: reduce ? 1 : 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section className="relative overflow-hidden bg-canopy text-white">
      {/* Background photograph */}
      <div className="absolute inset-0">
        <Image
          src="/images/history/482247163_1201043701742295_4815130360104201400_n.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-45"
        />
        {/* Left-dark, right-light overlay keeps the heading readable while
            letting the community photo show through on the right. */}
        <div className="absolute inset-0 bg-gradient-to-r from-canopy via-canopy/85 to-canopy/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-canopy/80 via-transparent to-canopy/30" />
        <div className="absolute inset-0 canopy-texture" />
        {/* Vignette — pulls the eye to the centre and stops the photograph
            bleeding brightly into the corners. */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_45%,rgba(5,14,11,0.55)_100%)]" />
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container-content relative grid items-center gap-12 py-20 md:grid-cols-[1.5fr_1fr] md:py-28"
      >
        <div>
          <motion.p variants={item} className="eyebrow-light">
            <span className="h-px w-6 bg-gold-400" />
            {heroEyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.04] tracking-[-0.02em] text-white text-balance sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
          >
            {heroTitle}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 text-pretty"
          >
            {heroSubtitle}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            {/* `secondary` is the brand red — this was `primary` with the red
                pasted back over it in className, so the variant it declared and
                the colour it rendered disagreed. */}
            <Button
              href="/join"
              size="lg"
              variant="secondary"
              className="group shadow-card hover:shadow-card-hover"
            >
              {t("hero.ctaJoin")}
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Button>
            <Button href="/about" size="lg" variant="light">
              {t("hero.ctaExplore")}
            </Button>
          </motion.div>

          {/* Founding Day ribbon */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-col gap-5 rounded-2xl border border-white/[0.12] bg-white/[0.06] p-5 shadow-elevated backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
                <CalendarDays size={14} /> {t("hero.foundingEyebrow")}
              </p>
              <p className="mt-1.5 text-sm text-white/75">
                Official Launch of the Youth General Assembly on{" "}
                <span className="font-semibold text-white">12 January 2027</span>
              </p>
            </div>
            <Countdown to={foundingDate} />
          </motion.div>
        </div>

        {/* Photo carousel (replaces the static seal) */}
        <motion.div
          variants={item}
          className="flex items-center justify-center"
        >
          <HeroCarousel images={heroImages} />
        </motion.div>
      </motion.div>

      {/* Softens the join between the hero and whatever follows, so the page
          reads as one surface rather than two slabs butted together. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white dark:to-canopy-900"
      />
    </section>
  )
}
