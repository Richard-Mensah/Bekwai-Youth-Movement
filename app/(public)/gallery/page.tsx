import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import GalleryGrid from "@/components/features/public/GalleryGrid"
import { getGallery } from "@/lib/data/content"

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from the Bekwai Youth Movement — community activities, leadership, and volunteering.",
}

export default async function GalleryPage() {
  const items = await getGallery()
  const images = items.map((i) => ({ url: i.url, caption: i.caption }))

  return (
    <>
      <PageHeader
        eyebrow="In pictures"
        title="Gallery"
        description="Community activities, leadership, and volunteering across Sefwi Bekwai."
      />

      <section className="container-content section">
        <GalleryGrid images={images} />
      </section>
    </>
  )
}
