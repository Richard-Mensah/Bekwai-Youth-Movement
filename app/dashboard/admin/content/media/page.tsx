import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import MediaManager from "./MediaManager"
import { listMedia } from "@/lib/storage"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export const metadata = { title: "Media library" }

export default async function MediaPage() {
  const items = isSupabaseConfigured() ? await listMedia() : []
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content"
        backLabel="Content Studio"
        title="Media library"
        subtitle="All uploaded images — upload, copy a URL, or delete"
      />
      <MediaManager items={items} />
    </>
  )
}
