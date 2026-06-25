"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { PUBLIC_NAV, ORG } from "@/constants/nav"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      <nav className="container-content flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/images/logo.jpg"
            alt="Bekwai Youth Movement logo"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <span className="hidden sm:block">
            <span className="block text-sm font-bold leading-tight text-brand-green-700">
              {ORG.shortName} — {ORG.assembly}
            </span>
            <span className="block text-[11px] text-gray-500">{ORG.motto}</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-green-50 hover:text-brand-green-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-brand-green hover:bg-brand-green-50"
          >
            Sign in
          </Link>
          <Link
            href="/join"
            className="rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-600"
          >
            Join BYM
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="rounded-md p-2 text-gray-700 lg:hidden"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <div className={cn("border-t border-gray-100 lg:hidden", open ? "block" : "hidden")}>
        <div className="container-content flex flex-col gap-1 py-3">
          {PUBLIC_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-green-50"
            >
              {item.label}
            </Link>
          ))}
          <div className="mt-2 flex gap-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg border border-brand-green px-4 py-2 text-center text-sm font-medium text-brand-green"
            >
              Sign in
            </Link>
            <Link
              href="/join"
              onClick={() => setOpen(false)}
              className="flex-1 rounded-lg bg-brand-green px-4 py-2 text-center text-sm font-medium text-white"
            >
              Join BYM
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
