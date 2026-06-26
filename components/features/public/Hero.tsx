"use client"

import Image from "next/image"
import { motion, useReducedMotion, type Variants } from "framer-motion"
import { ArrowRight, CalendarDays } from "lucide-react"
import Button from "@/components/ui/Button"
import Countdown from "@/components/ui/Countdown"
import { ORG } from "@/constants/nav"

type Props = {
  eyebrow?: string
  title?: string
  subtitle?: string
  foundingDate?: string
}

export default function Hero({
  eyebrow = ORG.region,
  title = "Harnessing the potential of every young person in Sefwi Bekwai",
  subtitle = "A non-political youth movement building structured governance, community intelligence, and volunteerism across 32 communities — aligned with the UN Sustainable Development Goals.",
  foundingDate = ORG.foundingDate,
}: Props) {
  const reduce = useReducedMotion()
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
          src="/images/history/472533608_1643728982885427_6727051425384547508_n.jpg"
          alt=""
          fill
          priority
          className="object-cover object-center opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-canopy via-canopy/95 to-canopy-700/95" />
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
            {eyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.05] text-white text-balance sm:text-5xl lg:text-6xl"
          >
            {title}
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-6 max-w-xl text-lg leading-relaxed text-white/75 text-pretty"
          >
            {subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <Button href="/join" size="lg" variant="primary" className="bg-brand-red hover:bg-brand-red-600 focus-visible:ring-brand-red">
              Join the Movement <ArrowRight size={18} />
            </Button>
            <Button href="/about" size="lg" variant="light">
              Explore our work
            </Button>
          </motion.div>

          {/* Founding Day ribbon */}
          <motion.div
            variants={item}
            className="mt-12 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-gold-300">
                <CalendarDays size={14} /> The road to Founding Day
              </p>
              <p className="mt-1.5 text-sm text-white/75">
                Official Launch of the Youth General Assembly —{" "}
                <span className="font-semibold text-white">12 January 2027</span>
              </p>
            </div>
            <Countdown to={foundingDate} />
          </motion.div>
        </div>

        {/* Seal */}
        <motion.div
          variants={item}
          className="hidden items-center justify-center md:flex"
        >
          <div className="relative">
            <div className="absolute -inset-4 rounded-full bg-gold-400/10 blur-2xl" />
            <Image
              src="/images/logo.jpg"
              alt={`${ORG.name} official seal`}
              width={300}
              height={300}
              priority
              className="relative rounded-full ring-1 ring-gold-400/40 ring-offset-4 ring-offset-canopy"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}
