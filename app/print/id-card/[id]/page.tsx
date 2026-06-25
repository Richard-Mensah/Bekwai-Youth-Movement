import Image from "next/image"
import { notFound } from "next/navigation"
import { getTenureById } from "@/lib/data/governance"
import { ORG } from "@/constants/nav"
import { formatDate } from "@/lib/utils"
import PrintButton from "@/components/features/governance/PrintButton"

export const metadata = { title: "Member ID Card", robots: { index: false } }

export default async function IdCard({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const officer = await getTenureById(id)
  if (!officer) notFound()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gray-100 p-6 print:bg-white">
      <div className="print:hidden">
        <PrintButton />
      </div>

      {/* Standard CR80 card ratio (~3.37 x 2.13 in) */}
      <div className="w-[340px] overflow-hidden rounded-xl bg-white shadow-xl ring-1 ring-gray-200">
        <div className="flex items-center gap-2 bg-brand-green px-4 py-2.5 text-white">
          <Image src="/images/logo.jpg" alt="BYM" width={28} height={28} className="rounded-full" />
          <div className="leading-tight">
            <p className="text-[11px] font-bold">{ORG.shortName} — {ORG.assembly}</p>
            <p className="text-[8px] text-brand-blue-100">{ORG.motto}</p>
          </div>
        </div>

        <div className="flex gap-3 p-4">
          <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-md bg-gray-100 text-[9px] text-gray-400">
            PHOTO
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-brand-green-700">{officer.fullName}</p>
            <p className="truncate text-[11px] text-gray-600">{officer.positionTitle}</p>
            <div className="mt-2 space-y-0.5 text-[10px] text-gray-500">
              <p>ID: BYM-{officer.id.slice(0, 6).toUpperCase()}</p>
              <p>Valid to: {officer.termEnd ? formatDate(officer.termEnd) : "—"}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-4 py-1.5 text-[8px] text-gray-400">
          <span>Sefwi Bekwai · Western North · Ghana</span>
          <span>OFFICIAL</span>
        </div>
      </div>

      <p className="max-w-xs text-center text-xs text-gray-400 print:hidden">
        Print double-sided on a CR80 card, or save as PDF.
      </p>
    </main>
  )
}
