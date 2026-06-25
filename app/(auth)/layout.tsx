import Link from "next/link"
import Image from "next/image"
import { ORG } from "@/constants/nav"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="flex min-h-screen flex-col bg-paper">
      <div className="container-content py-6">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <Image
            src="/images/logo.jpg"
            alt="Bekwai Youth Movement logo"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-sm font-bold text-brand-green-700">
            {ORG.shortName} — {ORG.assembly}
          </span>
        </Link>
      </div>
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </main>
  )
}
