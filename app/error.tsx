"use client"

import Link from "next/link"

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <h1 className="text-2xl font-bold text-brand-green-700">
        Something went wrong
      </h1>
      <p className="mt-2 max-w-md text-gray-600">
        An unexpected error occurred. Please try again.
      </p>
      <div className="mt-6 flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-green-600"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-lg border border-brand-green px-5 py-2.5 text-sm font-medium text-brand-green hover:bg-brand-green-50"
        >
          Go home
        </Link>
      </div>
    </main>
  )
}
