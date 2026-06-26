import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import GalleryManager from "./GalleryManager"
import { getAllGallery } from "@/lib/data/content"

export const metadata = { title: "Gallery" }

export default async function GalleryAdminPage() {
  const items = await getAllGallery()
  return (
    <>
      <Link
        href="/dashboard/admin/content"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Content Studio
      </Link>
      <DashboardHeading title="Gallery" subtitle="Photos shown on the public gallery" />
      <GalleryManager items={items} />
    </>
  )
}
