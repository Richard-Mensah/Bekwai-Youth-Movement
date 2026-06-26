import Link from "next/link"
import { Plus } from "lucide-react"
import { getAllLeaders } from "@/lib/data/content"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import LeaderRowActions from "./LeaderRowActions"

export const metadata = { title: "Leadership" }

const TIER_LABEL: Record<string, string> = {
  cabinet: "Executive Cabinet",
  parliament: "Youth Parliament",
  cin: "Community Intelligence",
  tac: "Traditional Advisory Council",
}

export default async function LeadersListPage() {
  const leaders = await getAllLeaders()
  const tiers = ["cabinet", "parliament", "cin", "tac"]

  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <DashboardHeading title="Leadership & Team" subtitle="People shown on the Leadership page" />
        <Button href="/dashboard/admin/content/leaders/new">
          <Plus size={16} /> Add person
        </Button>
      </div>

      {leaders.length === 0 ? (
        <Card>
          <p className="text-sm text-ink/55">
            No leaders yet. Add people, or import current content from the Content
            Studio.
          </p>
        </Card>
      ) : (
        <div className="space-y-8">
          {tiers.map((tier) => {
            const group = leaders.filter((l) => l.tier === tier)
            if (group.length === 0) return null
            return (
              <div key={tier}>
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold-600">
                  {TIER_LABEL[tier] ?? tier}
                </h3>
                <div className="space-y-2">
                  {group.map((l) => (
                    <Card key={l.id}>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-canopy">
                              {l.name ?? "To be appointed"}
                            </span>
                            {!l.isPublished && <Badge tone="gray">hidden</Badge>}
                          </div>
                          <p className="text-xs text-ink/55">{l.title}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <Link
                            href={`/dashboard/admin/content/leaders/${l.id}/edit`}
                            className="text-xs font-semibold text-canopy hover:underline"
                          >
                            Edit
                          </Link>
                          <LeaderRowActions id={l.id} published={l.isPublished} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
