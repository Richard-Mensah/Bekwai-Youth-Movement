import Link from "next/link"
import Image from "next/image"
import { ORG } from "@/constants/nav"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="console-bg relative flex min-h-screen flex-col overflow-hidden">
      {/* Canopy wash behind the card so the page has a horizon rather than
          being a single flat slab of paper. */}
      <div
        aria-hidden
        className="canopy-texture pointer-events-none absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-canopy to-transparent opacity-[0.07] dark:opacity-25"
      />

      <div className="container-content relative py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2.5 rounded-full transition-opacity hover:opacity-80"
        >
          <Image
            src="/images/logo.jpg"
            alt=""
            width={36}
            height={36}
            className="rounded-full ring-1 ring-gold-400/40"
          />
          <span className="leading-tight">
            <span className="block font-display text-sm font-bold text-canopy dark:text-paper">
              {ORG.shortName} — {ORG.assembly}
            </span>
            <span className="block text-[10px] uppercase tracking-[0.14em] text-gold-600 dark:text-gold-300/80">
              {ORG.motto}
            </span>
          </span>
        </Link>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md animate-fade-up">{children}</div>
      </div>
    </main>
  )
}
