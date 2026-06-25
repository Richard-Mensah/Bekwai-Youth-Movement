"use client"

import { motion, useReducedMotion } from "framer-motion"
import type { ElementType, ReactNode } from "react"

type Props = {
  children: ReactNode
  className?: string
  /** Stagger delay in seconds. */
  delay?: number
  /** Animate as a stagger container (children should be <Reveal.Item>). */
  as?: "div" | "section" | "li" | "ul"
  y?: number
}

/** Scroll-reveal wrapper. Fades/translates content into view once. */
export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  y = 16,
}: Props) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as ElementType

  return (
    <MotionTag
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  )
}
