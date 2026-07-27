import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import ApplicationWizard from "@/components/features/apply/ApplicationWizard"
import { startDraft } from "@/app/dashboard/apply/actions"
import {
  getApplication,
  getApplicationDocuments,
} from "@/lib/data/applications"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import { officeBySlug } from "@/constants/offices"

export const metadata = { title: "Apply for an Office" }

type Search = { searchParams: Promise<{ role?: string; id?: string }> }

export default async function NewApplicationPage({ searchParams }: Search) {
  const { role, id } = await searchParams

  if (!isSupabaseConfigured()) {
    return (
      <>
        <DashboardHeading
          title="Apply for an office"
          subtitle="Connect Supabase to accept applications"
        />
        <div className="rounded-2xl border border-dashed border-amber-300 bg-amber-50 p-8 text-center">
          <p className="text-sm text-amber-800">
            Demo mode — applications are stored in Supabase, which isn&apos;t
            connected. You can still{" "}
            <Link
              href="/dashboard/apply/roles"
              className="font-semibold underline"
            >
              browse every office
            </Link>
            .
          </p>
        </div>
      </>
    )
  }

  // Resolve the draft: an explicit id, or the applicant's open draft (created
  // on the spot, preselecting the office they clicked through from).
  let applicationId = id
  if (!applicationId) {
    const started = await startDraft(role && officeBySlug(role) ? role : undefined)
    if (!started.ok) redirect("/dashboard/apply?error=draft")
    applicationId = started.data.id
  }

  const application = await getApplication(applicationId)
  if (!application) redirect("/dashboard/apply")
  if (application.status !== "draft") redirect(`/dashboard/apply/${application.id}`)

  const documents = await getApplicationDocuments(application.id)

  return (
    <>
      <Link
        href="/dashboard/apply"
        className="mb-3 inline-flex items-center gap-1.5 text-sm text-brand-green hover:underline dark:text-brand-green-100"
      >
        <ArrowLeft size={14} /> Back to my applications
      </Link>
      <DashboardHeading
        title="Put your name forward"
        subtitle="About five minutes. Everything saves as you go — you can stop and come back."
      />
      <ApplicationWizard
        application={application}
        documents={documents}
        membershipId={application.membershipId}
      />
    </>
  )
}
