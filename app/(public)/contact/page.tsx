import type { Metadata } from "next"
import { Mail, MapPin, Users } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import SectionHeading from "@/components/ui/SectionHeading"
import Card from "@/components/ui/Card"
import Button from "@/components/ui/Button"
import { ORG } from "@/constants/nav"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Bekwai Youth Movement Secretariat in Sefwi Bekwai, Western North Region, Ghana.",
}

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Contact the Secretariat"
        description="For partnerships, media, membership, or community engagement enquiries."
      />

      <section className="container-content py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card>
            <MapPin className="text-brand-green" />
            <h3 className="mt-3 text-base font-bold text-brand-green-700">Location</h3>
            <p className="mt-1 text-sm text-gray-600">{ORG.region}</p>
          </Card>
          <Card>
            <Mail className="text-brand-green" />
            <h3 className="mt-3 text-base font-bold text-brand-green-700">Email</h3>
            <p className="mt-1 text-sm text-gray-600">{ORG.email}</p>
          </Card>
          <Card>
            <Users className="text-brand-green" />
            <h3 className="mt-3 text-base font-bold text-brand-green-700">Membership</h3>
            <p className="mt-1 text-sm text-gray-600">
              Open to youth across all 32 communities.
            </p>
            <div className="mt-3">
              <Button href="/join" size="sm">
                Join BYM
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-12 rounded-2xl bg-brand-green-900 px-8 py-10 text-center text-white">
          <SectionHeading
            title="Partner with the Movement"
            description="BYM works with NGOs, the Municipal Assembly, diaspora networks, and development partners to deliver SDG-aligned community impact."
            centered
          />
          <div className="mt-6">
            <Button href={`mailto:${ORG.email}`} variant="secondary" size="lg">
              Email the Secretariat
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
