import Link from "next/link"

export const metadata = { title: "Offline" }

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <h1 className="font-serif text-2xl font-bold text-brand-green-700">
        You&apos;re offline
      </h1>
      <p className="mt-2 max-w-md text-gray-600">
        The Bekwai Youth Movement app needs a connection for this page. Please
        reconnect and try again.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-green-600"
      >
        Retry home
      </Link>
    </main>
  )
}
