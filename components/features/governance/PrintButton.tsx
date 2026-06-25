"use client"

import { Printer } from "lucide-react"

/** Triggers the browser print dialog (Save as PDF). */
export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-lg bg-brand-green px-4 py-2 text-sm font-medium text-white hover:bg-brand-green-600 print:hidden"
    >
      <Printer size={16} /> Print / Save as PDF
    </button>
  )
}
