import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import MediaManager from "./MediaManager"
import { listMedia } from "@/lib/storage"
import { isSupabaseConfigured } from "@/lib/supabase/server"

export const metadata = { title: "Media library" }

export default async function MediaPage() {
  const items = isSupabaseConfigured() ? await listMedia() : []
  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <DashboardHeading
        title="Media library"
        subtitle="All uploaded images — upload, copy a URL, or delete"
      />
      <MediaManager items={items} />
    </>
  )
}
