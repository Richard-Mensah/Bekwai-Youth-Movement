import Image from "next/image"
import { notFound } from "next/navigation"
import { getTenureById } from "@/lib/data/governance"
import { ORG } from "@/constants/nav"
import { formatDate } from "@/lib/utils"
import PrintButton from "@/components/features/governance/PrintButton"

export const metadata = { title: "Letter of Appointment", robots: { index: false } }

export default async function AppointmentLetter({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const officer = await getTenureById(id)
  if (!officer) notFound()

  return (
    <main className="min-h-screen bg-gray-100 py-8 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-3xl justify-end px-4 print:hidden">
        <PrintButton />
      </div>

      <article className="mx-auto max-w-3xl bg-white p-12 shadow-lg print:max-w-none print:p-10 print:shadow-none">
        <header className="flex items-center gap-4 border-b-2 border-brand-green pb-5">
          <Image src="/images/logo.jpg" alt="BYM" width={64} height={64} className="rounded-full" />
          <div>
            <h1 className="font-serif text-xl font-bold text-brand-green-700">{ORG.name}</h1>
            <p className="text-xs text-gray-500">{ORG.assembly} · {ORG.region}</p>
          </div>
          <p className="ml-auto text-right text-xs text-gray-400">
            Ref: BYM-LOA-{officer.id.slice(0, 6).toUpperCase()}
          </p>
        </header>

        <p className="mt-8 text-sm text-gray-500">{formatDate(new Date())}</p>

        <h2 className="mt-6 text-center font-serif text-lg font-bold uppercase tracking-wide text-brand-green-700">
          Letter of Appointment
        </h2>

        <div className="mt-8 space-y-4 text-sm leading-relaxed text-gray-800">
          <p>Dear <strong>{officer.fullName}</strong>,</p>
          <p>
            On behalf of the {ORG.name} {ORG.assembly}, I am pleased to formally
            appoint you to the office of <strong>{officer.positionTitle}</strong>.
          </p>
          <p>
            Your term of service runs from{" "}
            <strong>{officer.termStart ? formatDate(officer.termStart) : "the date of inauguration"}</strong>{" "}
            to <strong>{officer.termEnd ? formatDate(officer.termEnd) : "the end of the term"}</strong>,
            subject to the Constitution and the Code of Conduct of the Movement.
          </p>
          <p>
            In accepting this appointment, you undertake to serve the youth and
            communities of Sefwi Bekwai with integrity, to remain strictly
            non-partisan, and to uphold the principle of service over self.
          </p>
          <p>We congratulate you and look forward to your dedicated service.</p>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-10 text-sm">
          <div>
            <div className="h-12 border-b border-gray-400" />
            <p className="mt-1 font-semibold text-gray-700">Director-General</p>
            <p className="text-xs text-gray-500">BYM Youth General Assembly</p>
          </div>
          <div>
            <div className="h-12 border-b border-gray-400" />
            <p className="mt-1 font-semibold text-gray-700">Secretary-General</p>
            <p className="text-xs text-gray-500">Custodian of Records</p>
          </div>
        </div>

        <footer className="mt-12 border-t border-gray-200 pt-4 text-center text-[11px] text-gray-400">
          {ORG.name} · {ORG.motto} · Official Seal: ____________
        </footer>
      </article>
    </main>
  )
}
