import type { MetadataRoute } from "next"
import { ORG } from "@/constants/nav"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${ORG.name} — ${ORG.assembly}`,
    short_name: ORG.shortName,
    description:
      "Digital governance platform for the Bekwai Youth Movement — Sefwi Bekwai, Ghana.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#1F4D3F",
    orientation: "portrait",
    icons: [
      { src: "/images/logo.jpg", sizes: "192x192", type: "image/jpeg", purpose: "any" },
      { src: "/images/logo.jpg", sizes: "512x512", type: "image/jpeg", purpose: "any" },
    ],
  }
}
