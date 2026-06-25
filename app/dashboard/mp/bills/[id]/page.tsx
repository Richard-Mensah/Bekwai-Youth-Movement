import Link from "next/link"
import { notFound } from "next/navigation"
import { getBillById, getVoteTally } from "@/lib/data/parliament"
import { BILL_STATUS_META } from "@/constants/parliament"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ReadingsProgress from "@/components/features/parliament/ReadingsProgress"
import AdvanceStageButton from "@/components/features/parliament/AdvanceStageButton"
import VotePanel from "@/components/features/parliament/VotePanel"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const bill = await getBillById(id)
  if (!bill) notFound()

  const tally = await getVoteTally(bill.id)
  const meta = BILL_STATUS_META[bill.status]

  return (
    <>
      <Link
        href="/dashboard/mp"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Back to Parliament
      </Link>
      <DashboardHeading title={bill.title} subtitle={bill.reference ?? undefined} />

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <div className="flex items-center gap-3">
            <Badge tone={meta.tone}>{meta.label}</Badge>
            <span className="text-xs text-ink/45">
              Introduced {formatDate(bill.createdAt)}
            </span>
          </div>

          <div className="mt-5">
            <ReadingsProgress status={bill.status} />
          </div>

          <h3 className="mt-6 text-sm font-bold text-canopy">Summary</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink/65">
            {bill.summary ?? "No summary provided."}
          </p>

          <div className="mt-6 border-t border-gray-100 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/45">
              Presiding actions
            </p>
            <AdvanceStageButton billId={bill.id} status={bill.status} />
          </div>
        </Card>

        <Card>
          <VotePanel billId={bill.id} initial={tally} />
        </Card>
      </div>
    </>
  )
}
