import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"
import { ORG } from "@/constants/nav"
import AuthAside from "@/components/features/auth/AuthAside"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Two panes on a wide screen: the argument for joining on one side, the
    // form on the other. Below lg the aside drops away entirely rather than
    // pushing the form under the fold.
    <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <AuthAside />

      <main className="console-bg relative flex min-h-screen flex-col overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl"
        />

        <header className="relative flex items-center justify-between gap-4 px-5 py-6 sm:px-8">
          {/* On small screens this is the only branding, so it carries the
              full lockup; beside the aside it would just repeat it. */}
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 rounded-full transition-opacity hover:opacity-80 lg:hidden"
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

          <Link
            href="/"
            className="group ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink/50 transition-colors hover:text-canopy dark:text-paper/50 dark:hover:text-paper"
          >
            <ArrowLeft
              size={13}
              aria-hidden
              className="transition-transform duration-200 group-hover:-translate-x-0.5"
            />
            Back to site
          </Link>
        </header>

        <div className="relative flex flex-1 items-center justify-center px-5 pb-16 pt-2 sm:px-8">
          <div className="w-full max-w-md animate-fade-up">{children}</div>
        </div>
      </main>
    </div>
  )
}
