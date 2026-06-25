import type { Metadata } from "next"
import { Inter, Source_Serif_4 } from "next/font/google"
import "./globals.css"
import { ORG } from "@/constants/nav"

const sans = Inter({ subsets: ["latin"], variable: "--font-sans" })
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif" })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${ORG.name} — ${ORG.motto}`,
    template: `%s · ${ORG.shortName}`,
  },
  description:
    "The Bekwai Youth Movement (BYM) is a non-political youth governance institution in Sefwi Bekwai, Western North Region, Ghana — Youth General Assembly, Youth Parliament, and Community Intelligence Network, aligned with the UN SDGs.",
  keywords: [
    "Bekwai Youth Movement",
    "Sefwi Bekwai",
    "youth governance",
    "Ghana",
    "Youth Parliament",
    "Community Intelligence Network",
    "SDGs",
    "Volunteering for Change",
  ],
  icons: { icon: "/images/logo.jpg", apple: "/images/logo.jpg" },
  openGraph: {
    title: `${ORG.name} — ${ORG.motto}`,
    description:
      "Youth governance for Sefwi Bekwai and its 31 sub-communities. Aligned with the UN SDGs 2030.",
    url: siteUrl,
    siteName: ORG.name,
    images: [{ url: "/images/logo.jpg", width: 1042, height: 1042 }],
    locale: "en_GH",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: `${ORG.name} — ${ORG.motto}`,
    description: "Youth governance for Sefwi Bekwai. Aligned with the UN SDGs.",
    images: ["/images/logo.jpg"],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  )
}
