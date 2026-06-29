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
  subtitle = "A non-political youth movement building structured governance, community intelligence, and volunteerism across 32 communities, aligned with the UN Sustainable Development Goals.",
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
            className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-white text-balance sm:text-5xl lg:text-6xl"
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
            <Button href="/join" size="lg" variant="primary" className="bg-brand-red hover:bg-brand-red-600 focus-visible:ring-brand-red">
              {t("hero.ctaJoin")} <ArrowRight size={18} />
            </Button>
            <Button href="/about" size="lg" variant="light">
              {t("hero.ctaExplore")}
            </Button>
          </motion.div>

          {/* Founding Day ribbon */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between"
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
          className="hidden items-center justify-center md:flex"
        >
          <HeroCarousel images={heroImages} />
        </motion.div>
      </motion.div>
    </section>
  )
}
