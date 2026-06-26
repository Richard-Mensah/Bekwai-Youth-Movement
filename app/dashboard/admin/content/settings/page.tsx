import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import SettingsForm from "./SettingsForm"
import { getSettings } from "@/lib/data/content"

export const metadata = { title: "Site settings" }

export default async function SettingsPage() {
  const settings = await getSettings()
  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <DashboardHeading
        title="Site settings"
        subtitle="Hero text, impact stats, and organisation details"
      />
      <SettingsForm settings={settings} />
    </>
  )
}
