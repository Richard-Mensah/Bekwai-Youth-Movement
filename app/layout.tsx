import type { Metadata, Viewport } from "next"
import { Public_Sans, Fraunces } from "next/font/google"
import "./globals.css"
import { ORG } from "@/constants/nav"
import { SITE_URL } from "@/lib/site"
import PwaRegister from "@/components/PwaRegister"
import StructuredData from "@/components/StructuredData"

const sans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})
const display = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz"],
})

const siteUrl = SITE_URL

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  // Every page declares itself canonical at its own path on the *current* origin.
  // This matters now rather than in the abstract: bekwai-youth-movement.vercel.app
  // stays reachable after the move to bekwaiyouthmovement.org, and has to — old
  // links and un-propagated DNS still resolve there. Without a canonical, the two
  // hosts serve identical content and compete with each other for it, splitting
  // whatever ranking the site earns. `alternates.canonical: "./"` resolves each
  // page against metadataBase, so one line covers every route.
  alternates: { canonical: "./" },
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
  /**
   * Two icons, deliberately, because two different consumers look for two
   * different things.
   *
   * `/favicon.ico` is the one Google Search fetches when it decides whether to
   * show a site icon beside a result — and it was returning 404, so BYM appeared
   * with the blank default page glyph. It carries 16/32/48px in a single file
   * and weighs 5 KB against the 45 KB JPEG the browser was previously
   * downloading just to draw a 16px tab icon.
   *
   * It is generated from `public/images/logo.jpg` — the BYM logo — but cropped
   * to the emblem. The full lockup wraps "BEKWAI YOUTH MOVEMENT" around the mark
   * and carries a "VOLUNTEERING FOR CHANGE" banner, and neither survives below
   * about 64px: rendered at 16 they are grey smear, and the whole icon reads as
   * a smudge. The emblem alone keeps the three brand colours and the figure, so
   * the tab is recognisably BYM at the size a tab is actually drawn.
   * Regenerate with the script recorded in `scripts/generate-favicon.mjs`.
   *
   * The full logo is what appears everywhere it has room to be read: the
   * apple-touch-icon, the Android home screen, the social preview card and the
   * `NGO` structured data Google reads for the knowledge panel.
   */
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/images/logo.jpg", type: "image/jpeg" },
    ],
    apple: "/images/logo.jpg",
  },
  appleWebApp: { capable: true, title: ORG.shortName, statusBarStyle: "default" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${ORG.name} — ${ORG.motto}`,
    description:
      "Youth governance for Sefwi Bekwai and its 32 sub-communities. Aligned with the UN SDGs 2030.",
    url: siteUrl,
    siteName: ORG.name,
    // 1050, not 1042. The file is 1050×1050 and the declared size was wrong,
    // which matters because WhatsApp and Facebook lay the card out from these
    // numbers before the image arrives — and a link to /join shared into a
    // WhatsApp group is how most of this drive's members will actually arrive.
    images: [
      {
        url: "/images/logo.jpg",
        width: 1050,
        height: 1050,
        alt: `${ORG.name} — ${ORG.motto}`,
        type: "image/jpeg",
      },
    ],
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

export const viewport: Viewport = {
  themeColor: "#14342B",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/* No-flash theme: apply the saved/system preference before first paint. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('bym-theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}var d=document.documentElement;d.classList.toggle('dark',t==='dark');d.style.colorScheme=t;}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <StructuredData />
        {children}
        <PwaRegister />
      </body>
    </html>
  )
}
