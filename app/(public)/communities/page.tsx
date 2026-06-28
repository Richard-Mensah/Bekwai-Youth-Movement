import type { Metadata } from "next"
import Link from "next/link"
import { MapPin, ArrowUpRight } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import { getAllCommunities } from "@/lib/data/content"

export const metadata: Metadata = {
  title: "Communities",
  description:
    "Explore all of BYM's communities across the Sefwi Bekwai Traditional Area — each with its chief, elders, and BYM representatives.",
}

export default async function CommunitiesPage() {
  const communities = await getAllCommunities()

  return (
    <>
      <PageHeader
        eyebrow="Our reach"
        title="Our communities"
        description="From Sefwi Bekwai town to the furthest sub-community, every community has a seat at the table. Explore each one — its chief and elders, and its BYM representatives."
      />

      <section className="container-content py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {communities.map((c) => (
            <Link
              key={c.id}
              href={`/communities/${c.slug}`}
              className="group flex items-center justify-between gap-3 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    c.isTown ? "bg-gold-400 text-canopy" : "bg-canopy-50 text-canopy"
                  }`}
                >
                  <MapPin size={18} />
                </span>
                <div>
                  <h3 className="font-semibold text-canopy">{c.name}</h3>
                  <p className="text-xs text-ink/50">
                    {c.isTown ? "Town · seat of the Assembly" : "Sub-community"}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                size={18}
                className="text-ink/30 transition-colors group-hover:text-gold-500"
              />
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
