import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="font-serif text-6xl font-bold text-brand-green">404</p>
      <h1 className="mt-4 text-2xl font-bold text-brand-green-700">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-gray-600">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-brand-green px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-green-600"
      >
        Back to home
      </Link>
    </main>
  )
}
