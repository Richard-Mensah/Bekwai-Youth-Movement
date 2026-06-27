import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { getAllPartners } from "@/lib/data/content"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import PartnerRowActions from "./PartnerRowActions"

export const metadata = { title: "Partners & Sponsors" }

export default async function PartnersListPage() {
  const partners = await getAllPartners()
  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <DashboardHeading title="Partners & Sponsors" subtitle="Logos shown on the site" />
        <Button href="/dashboard/admin/content/partners/new">
          <Plus size={16} /> Add partner
        </Button>
      </div>

      {partners.length === 0 ? (
        <Card>
          <p className="text-sm text-ink/55">No partners yet. Add one to start.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {partners.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  {p.logoUrl ? (
                    <Image
                      src={p.logoUrl}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-lg border border-canopy/10 object-contain p-1"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg border border-dashed border-canopy/20" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-canopy">{p.name}</span>
                      {!p.isPublished && <Badge tone="gray">hidden</Badge>}
                    </div>
                    <p className="text-xs capitalize text-ink/50">{p.tier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/admin/content/partners/${p.id}/edit`}
                    className="text-xs font-semibold text-canopy hover:underline"
                  >
                    Edit
                  </Link>
                  <PartnerRowActions id={p.id} published={p.isPublished} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
