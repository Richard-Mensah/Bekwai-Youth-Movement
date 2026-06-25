import Link from "next/link"
import { Landmark, Vote, Radar } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"

const ARMS = [
  {
    icon: Landmark,
    title: "Youth General Assembly",
    tag: "Executive",
    href: "/leadership",
    body: "A 19-member Civic Cabinet led by the Director-General, modelled on the UK Cabinet system, delivering policy and community development across 7 Units.",
  },
  {
    icon: Vote,
    title: "Bekwai Youth Parliament",
    tag: "Legislative",
    href: "/parliament",
    body: "A Speaker-led chamber giving legislative voice to youth, with bills, motions, debates, and Youth Recommendations — one Member per community.",
  },
  {
    icon: Radar,
    title: "Community Intelligence Network",
    tag: "Intelligence",
    href: "/cin",
    body: "32 Community Intelligence Officers gather monthly evidence on health, education, employment, and infrastructure to drive data-led governance.",
  },
]

export default function ThreeArms() {
  return (
    <section className="container-content py-16">
      <SectionHeading
        eyebrow="How BYM is organised"
        title="Three arms of youth governance"
        description="A separation of powers adapted to the Ghanaian community context — executive, legislative, and a grassroots intelligence network."
        centered
      />
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {ARMS.map(({ icon: Icon, title, tag, body, href }) => (
          <Link
            key={title}
            href={href}
            className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-brand-green hover:shadow-md"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-green-50 text-brand-green">
              <Icon size={24} />
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-brand-red">
              {tag}
            </p>
            <h3 className="mt-1 text-lg font-bold text-brand-green-700">
              {title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{body}</p>
            <span className="mt-4 inline-block text-sm font-medium text-brand-green group-hover:underline">
              Explore →
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
