import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import GalleryManager from "./GalleryManager"
import { getAllGallery } from "@/lib/data/content"

export const metadata = { title: "Gallery" }

export default async function GalleryAdminPage() {
  const items = await getAllGallery()
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content"
        backLabel="Content Studio" title="Gallery" subtitle="Photos shown on the public gallery" />
      <GalleryManager items={items} />
    </>
  )
}
