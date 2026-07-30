import { ORG } from "@/constants/nav"
import { SITE_URL } from "@/lib/site"

/**
 * Schema.org JSON-LD for the organisation and the site.
 *
 * There was none, which for BYM specifically is a real loss rather than a
 * checkbox: search engines treat a recognised `Organization` as an entity —
 * eligible for a knowledge panel, and able to carry a logo, a founding date and
 * an area served into the result itself. A youth movement whose credibility with
 * chiefs, district assemblies and donors depends on looking like an institution
 * gets more from this than from any amount of keyword tuning.
 *
 * `NGO` rather than the broader `Organization`: it is the accurate type, and it
 * is what tells a crawler this is a civic body and not a business.
 *
 * Emitted from the root layout so it appears once per page. Rendered with
 * `JSON.stringify` rather than a template literal, so a stray quote in a
 * constant cannot break out of the script tag.
 */
export default function StructuredData() {
  const organisation = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: ORG.name,
    alternateName: ORG.shortName,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.jpg`,
    email: ORG.email,
    slogan: ORG.motto,
    foundingDate: ORG.foundingDate,
    description:
      "A non-political youth governance institution in Sefwi Bekwai, Western North Region, Ghana — comprising a Youth General Assembly, Youth Parliament, and Community Intelligence Network, aligned with the UN Sustainable Development Goals.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sefwi Bekwai",
      addressRegion: "Western North Region",
      addressCountry: "GH",
    },
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Sefwi Bekwai and its sub-communities",
    },
    sameAs: [ORG.medium],
  }

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: ORG.name,
    url: SITE_URL,
    publisher: { "@type": "NGO", name: ORG.name },
    inLanguage: "en-GH",
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organisation) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  )
}
