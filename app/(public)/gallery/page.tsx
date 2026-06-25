import type { Metadata } from "next"
import PageHeader from "@/components/layout/PageHeader"
import GalleryGrid from "@/components/features/public/GalleryGrid"

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Moments from the Bekwai Youth Movement — community activities, leadership, and volunteering from 2021 to 2024.",
}

const PHOTOS = [
  "472533608_1643728982885427_6727051425384547508_n.jpg",
  "472766257_1643725496219109_5142496528883252813_n.jpg",
  "472658272_1643725659552426_3841496885343756339_n.jpg",
  "472537382_1644476426144016_8168085223803727278_n.jpg",
  "472570418_1644476379477354_4699580759498771881_n.jpg",
  "472398995_1644476392810686_855021471226072194_n.jpg",
  "472434052_1644476419477350_7263677863074049163_n.jpg",
  "472553374_1644476432810682_750361780948123598_n.jpg",
  "472596113_1644476416144017_2816265135506099950_n.jpg",
  "472684894_1643943256197333_8817376945635694744_n.jpg",
  "472779477_1643750209549971_4852660761104952962_n.jpg",
  "when we first started with an interview.jpg",
  "484805464_1201043848408947_1782099523686643406_n.jpg",
  "484767834_1201043795075619_1990743517891773622_n.jpg",
  "482247163_1201043701742295_4815130360104201400_n.jpg",
]

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="In pictures"
        title="Gallery"
        description="Community activities, leadership, and volunteering across Sefwi Bekwai — 2021 to 2024."
      />

      <section className="container-content section">
        <GalleryGrid photos={PHOTOS} />
      </section>
    </>
  )
}
