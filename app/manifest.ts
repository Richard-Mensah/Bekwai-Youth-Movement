import type { MetadataRoute } from "next"
import { ORG } from "@/constants/nav"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${ORG.name}`,
    short_name: ORG.shortName,
    description:
      "Digital governance platform for the Bekwai Youth Movement — Sefwi Bekwai, Ghana.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#14342B",
    orientation: "portrait",
    // Real files at the sizes declared. These used to point at the 1050×1050
    // JPEG while claiming to be 192 and 512, so a phone picked an icon by size
    // and then downloaded something four times larger than it asked for.
    // PNG because a home-screen icon is composited and JPEG carries no alpha.
    // Regenerate with `node scripts/generate-favicon.mjs`.
    icons: [
      { src: "/images/logo-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/images/logo-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/images/logo-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
