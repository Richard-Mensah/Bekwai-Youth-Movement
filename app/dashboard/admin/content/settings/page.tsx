import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import SettingsForm from "./SettingsForm"
import { getSettings } from "@/lib/data/content"

export const metadata = { title: "Site settings" }

export default async function SettingsPage() {
  const settings = await getSettings()
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content"
        backLabel="Content Studio"
        title="Site settings"
        subtitle="Hero text, impact stats, and organisation details"
      />
      <SettingsForm settings={settings} />
    </>
  )
}
