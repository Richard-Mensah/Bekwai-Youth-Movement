import type { Metadata } from "next"
import { Suspense } from "react"
import VerifyPending from "@/components/features/auth/VerifyPending"

export const metadata: Metadata = {
  title: "Verification pending",
  robots: { index: false },
}

export default function VerifyPendingPage() {
  return (
    <Suspense>
      <VerifyPending />
    </Suspense>
  )
}
