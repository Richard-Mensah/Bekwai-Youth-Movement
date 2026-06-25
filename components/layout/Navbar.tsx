"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown, Menu, X } from "lucide-react"
import { PUBLIC_NAV, ORG, isDropdown } from "@/constants/nav"
import NavDropdown from "@/components/layout/NavDropdown"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

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
        "sticky top-0 z-50 bg-white/90 backdrop-blur transition-shadow",
        scrolled ? "shadow-card border-b border-canopy/5" : "border-b border-canopy/10"
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
            <span className="block font-display text-[15px] font-semibold text-canopy sm:text-base">
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
              <NavDropdown key={item.label} label={item.label} items={item.children} />
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:text-canopy"
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        {/* Desktop auth */}
        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-red-600"
          >
            Join BYM
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open ? "true" : "false"}
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-canopy lg:hidden"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>
      </header>

      {/* Mobile drawer — rendered as a sibling of <header> so position:fixed
          resolves against the viewport, not the header's backdrop-filter
          containing block (which would otherwise collapse the panel height). */}
      <div
        className={cn(
          "fixed inset-x-0 top-[4.5rem] bottom-0 z-40 overflow-y-auto bg-white lg:hidden",
          open ? "block" : "hidden"
        )}
      >
        <div className="container-content flex flex-col gap-1 py-4">
          {PUBLIC_NAV.map((item) =>
            isDropdown(item) ? (
              <div key={item.label} className="border-b border-canopy/5 py-1">
                <button
                  type="button"
                  onClick={() =>
                    setExpanded((cur) => (cur === item.label ? null : item.label))
                  }
                  aria-expanded={expanded === item.label ? "true" : "false"}
                  className="flex w-full items-center justify-between px-2 py-2.5 text-left text-base font-semibold text-canopy"
                >
                  {item.label}
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
                        className="block rounded-lg px-3 py-2 text-sm text-ink/70 hover:bg-paper hover:text-canopy"
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
                className="border-b border-canopy/5 px-2 py-3 text-base font-semibold text-canopy"
              >
                {item.label}
              </Link>
            )
          )}

          <div className="mt-4 flex gap-3">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full border border-canopy/25 px-4 py-3 text-center text-sm font-semibold text-canopy"
            >
              Sign in
            </Link>
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-full bg-brand-red px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Join BYM
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
