import type { Metadata } from "next"
import Link from "next/link"
import { MailCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Verification pending",
  robots: { index: false },
}

export default function VerifyPendingPage() {
  return (
    <div className="surface p-8 text-center shadow-elevated">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-canopy text-gold-300 shadow-card">
        <MailCheck size={28} />
      </div>
      <h1 className="mt-5 font-display text-2xl font-bold text-canopy dark:text-paper">
        Account created
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
        Thank you for registering with the Bekwai Youth Movement. If email
        confirmation is enabled, please confirm via the link sent to your inbox.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
        Your membership is now <strong>pending verification</strong> by an
        administrator. Once verified, your role-based dashboard will unlock.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/login"
          className="rounded-full bg-canopy px-5 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-canopy-600"
        >
          Go to sign in
        </Link>
        <Link
          href="/"
          className="rounded-full border border-canopy/25 px-5 py-2.5 text-sm font-semibold text-canopy transition-colors hover:bg-canopy-50 dark:border-white/15 dark:text-paper dark:hover:bg-white/10"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
