import type { Metadata } from "next"
import Link from "next/link"
import { MailCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Verification pending",
  robots: { index: false },
}

export default function VerifyPendingPage() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-green-50 text-brand-green">
        <MailCheck size={28} />
      </div>
      <h1 className="mt-5 text-2xl font-bold text-brand-green-700">
        Account created
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        Thank you for registering with the Bekwai Youth Movement. If email
        confirmation is enabled, please confirm via the link sent to your inbox.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-gray-600">
        Your membership is now <strong>pending verification</strong> by an
        administrator. Once verified, your role-based dashboard will unlock.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/login"
          className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-green-600"
        >
          Go to sign in
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-brand-green px-5 py-2.5 text-sm font-medium text-brand-green hover:bg-brand-green-50"
        >
          Back to home
        </Link>
      </div>
    </div>
  )
}
