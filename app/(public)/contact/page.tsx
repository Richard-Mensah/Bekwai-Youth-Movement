import type { Metadata } from "next"
import { Mail, MapPin, Users } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import Reveal from "@/components/ui/Reveal"
import Button from "@/components/ui/Button"
import ContactForm from "@/components/features/public/ContactForm"
import { ORG } from "@/constants/nav"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Bekwai Youth Movement Secretariat in Sefwi Bekwai, Western North Region, Ghana, for partnerships, media, or membership.",
}

const INFO = [
  { icon: MapPin, title: "Location", body: ORG.region },
  { icon: Mail, title: "Email", body: ORG.email },
  {
    icon: Users,
    title: "Membership",
    body: "Open to youth across all 32 communities.",
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact the Secretariat"
        description="For partnerships, media, membership, or community engagement enquiries. We'd love to hear from you."
      />

      <section className="section">
        <div className="container-content grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          {/* Info column */}
          <Reveal className="space-y-4">
            {INFO.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canopy-50 text-canopy">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-semibold text-canopy">{title}</h3>
                  <p className="mt-0.5 text-sm text-ink/65">{body}</p>
                </div>
              </div>
            ))}

            <div className="rounded-2xl bg-canopy p-6 text-white canopy-texture">
              <h3 className="font-display text-lg font-semibold text-white">
                Partner with the movement
              </h3>
              <p className="mt-2 text-sm text-white/75">
                We work with NGOs, the Municipal Assembly, diaspora networks, and
                development partners to deliver SDG-aligned community impact.
              </p>
              <div className="mt-4">
                <Button
                  href="/join"
                  size="sm"
                  className="bg-gold-400 text-canopy hover:bg-gold-300 focus-visible:ring-gold"
                >
                  Become a member
                </Button>
              </div>
            </div>
          </Reveal>

          {/* Form column */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-canopy/10 bg-white p-6 shadow-card sm:p-8">
              <h2 className="font-display text-2xl font-semibold text-canopy">
                Send us a message
              </h2>
              <p className="mt-1 text-sm text-ink/60">
                Tell us how we can help and the Secretariat will get back to you.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
