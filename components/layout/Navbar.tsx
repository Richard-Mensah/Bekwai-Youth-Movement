"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X, Search } from "lucide-react"
import { PUBLIC_NAV, ORG, isDropdown } from "@/constants/nav"
import { NAV_LABEL_KEYS } from "@/constants/i18n"
import NavDropdown from "@/components/layout/NavDropdown"
import LanguageToggle from "@/components/i18n/LanguageToggle"
import { useLanguage } from "@/components/i18n/LanguageProvider"
import ThemeToggle from "@/components/theme/ThemeToggle"
import { useCommandPalette } from "@/components/features/public/CommandPalette"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const { t } = useLanguage()
  const { open: openPalette } = useCommandPalette()
  const navT = (label: string) => {
    const key = NAV_LABEL_KEYS[label]
    return key ? t(key) : label
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  return (
    <>
    <header
      className={cn(
        "sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow dark:bg-canopy-900/90",
        scrolled
          ? "shadow-card border-b border-canopy/5 dark:border-white/5"
          : "border-b border-canopy/10 dark:border-white/10"
      )}
    >
      <nav className="container-content flex h-[4.5rem] items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3" aria-label={`${ORG.name} home`}>
          <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-full ring-2 ring-gold-400/40">
            <Image
              src="/images/logo.jpg"
              alt={`${ORG.name} logo`}
              width={44}
              height={44}
              className="rounded-full"
              priority
            />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[15px] font-semibold text-canopy sm:text-base dark:text-paper">
              {ORG.name}
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.14em] text-gold-600">
              {ORG.motto}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {PUBLIC_NAV.map((item) =>
            isDropdown(item) ? (
              <NavDropdown key={item.label} label={navT(item.label)} items={item.children} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-canopy dark:text-paper/70 dark:hover:text-paper"
              >
                {navT(item.label)}
              </Link>
            )
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 lg:flex">
          <LanguageToggle />
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50 dark:text-paper dark:hover:bg-white/10"
          >
            {t("nav.signIn")}
          </Link>
          <Link
            href="/join"
            className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-red-600"
          >
            {t("nav.join")}
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={openPalette}
            aria-label="Open search"
            className="rounded-md p-2 text-canopy dark:text-paper"
          >
            <Search size={22} />
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open ? "true" : "false"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-canopy dark:text-paper"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>
      </header>

      {/* Mobile drawer — rendered as a sibling of <header> so position:fixed
          resolves against the viewport, not the header's backdrop-filter
          containing block (which would otherwise collapse the panel height). */}
      <div
        className={cn(
          "fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-white dark:bg-canopy-900 lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="container-content flex flex-col gap-1 py-4">
          <div className="mb-2 px-2">
            <LanguageToggle />
          </div>
          {PUBLIC_NAV.map((item) =>
            isDropdown(item) ? (
              <div key={item.label} className="border-b border-canopy/5 py-1">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((cur) => (cur === item.label ? null : item.label))
                  }
                  aria-expanded={expanded === item.label ? "true" : "false"}
                  className="flex w-full items-center justify-between px-2 py-2.5 text-left text-base font-semibold text-canopy dark:text-paper"
                >
                  {navT(item.label)}
                  <ChevronDown
                    size={18}
                    className={cn(
                      "transition-transform",
                      expanded === item.label && "rotate-180 text-gold-500"
                    )}
                  />
                </button>
                {expanded === item.label && (
                  <div className="pb-2 pl-2">
                    {item.children.map((child) => (
                      <Link
                        key={child.href + child.label}
                        href={child.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-lg px-3 py-2 text-sm text-ink/70 hover:bg-paper hover:text-canopy dark:text-paper/70 dark:hover:bg-white/5 dark:hover:text-paper"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-canopy/5 px-2 py-3 text-base font-semibold text-canopy dark:border-white/5 dark:text-paper"
              >
                {navT(item.label)}
              </Link>
            )
          )}

          <div className="mt-4 flex gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-canopy/25 px-4 py-3 text-center text-sm font-semibold text-canopy"
            >
              {t("nav.signIn")}
            </Link>
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white"
            >
              {t("nav.join")}
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
