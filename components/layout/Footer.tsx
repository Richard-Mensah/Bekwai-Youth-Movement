import Link from "next/link"
import Image from "next/image"
import { PUBLIC_NAV, ORG } from "@/constants/nav"

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-brand-green-900 text-gray-300">
      <div className="container-content grid gap-10 py-12 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Image
              src="/images/logo.jpg"
              alt="Bekwai Youth Movement logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <p className="font-serif text-lg font-bold text-white">
                {ORG.name}
              </p>
              <p className="text-xs text-gray-400">{ORG.motto}</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-400">
            A non-political youth governance institution harnessing the potential
            of every young person in Sefwi Bekwai and its 31 sub-communities.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Explore
          </h3>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {PUBLIC_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
            Contact
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-gray-400">
            <li>{ORG.region}</li>
            <li>{ORG.email}</li>
            <li className="pt-2">
              <Link
                href="/join"
                className="font-medium text-brand-blue-100 hover:text-white"
              >
                Become a member →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-content flex flex-col items-center justify-between gap-2 py-5 text-xs text-gray-400 sm:flex-row">
          <p>
            © {ORG.established} {ORG.name}. Aligned with the UN SDGs 2030.
          </p>
          <p>Sefwi Bekwai · Western North Region · Republic of Ghana</p>
        </div>
      </div>
    </footer>
  )
}
