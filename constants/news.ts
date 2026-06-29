export type NewsItem = {
  title: string
  /** Short outlet/context label, e.g. "Rabat, Morocco · 2023". */
  context: string
  date: string
  summary: string
  href: string
  /** SDG goal numbers this engagement touched. */
  sdg?: number[]
  /** Mark the most significant items for the homepage highlight grid. */
  featured?: boolean
}

/**
 * BYM's real participation record — sourced from the movement's Medium
 * publication (bekwaiyouthmovement.medium.com). Demonstrates grassroots-to-
 * global engagement ahead of the formal Assembly launch.
 */
export const NEWS: NewsItem[] = [
  {
    title:
      "BYM at the 2nd African Youth Summit on Biodiversity (AYSB2023)",
    context: "Rabat, Morocco",
    date: "2023-09-22",
    summary:
      "BYM joined youth delegates across Africa under the theme “From Awareness to Action,” championing sustainable farming, community biodiversity education, and youth-led agricultural change for Sefwi Bekwai.",
    href: "https://bekwaiyouthmovement.medium.com/empowering-youth-for-agricultural-change-bekwai-youth-movements-participation-in-african-youth-b9da8c69a805",
    sdg: [2, 13, 15],
    featured: true,
  },
  {
    title:
      "Championing climate action at MAI Foundation & Sustainability Week",
    context: "West Africa Region",
    date: "2023-09-24",
    summary:
      "Representing the movement at a regional sustainability convening on human capital and climate, BYM pledged to translate insights into practical adaptation and reforestation initiatives back home.",
    href: "https://bekwaiyouthmovement.medium.com/bekwai-youth-movement-champions-climate-change-at-mai-foundation-sustainability-week-a-28d317236752",
    sdg: [13, 8, 17],
    featured: true,
  },
  {
    title:
      "Insights from the Global Symposium on Soils & Water",
    context: "FAO · Global",
    date: "2023-11-04",
    summary:
      "BYM gathered practical knowledge on soil and water stewardship to drive community development initiatives across our 32 communities.",
    href: "https://bekwaiyouthmovement.medium.com/",
    sdg: [6, 15],
    featured: true,
  },
  {
    title: "BYM at the SDG Summit Debrief",
    context: "Global · September 2023",
    date: "2023-09-28",
    summary:
      "Engaging directly with the UN Sustainable Development Goals agenda and bringing the conversation back to grassroots action in Western North Ghana.",
    href: "https://bekwaiyouthmovement.medium.com/",
    sdg: [17],
    featured: true,
  },
  {
    title:
      "Empowering Ukrainian youth through education with GoGlobal",
    context: "International volunteering",
    date: "2023-11-04",
    summary:
      "A BYM delegate took part in international volunteer work focused on youth education empowerment, extending our commitment to young people beyond borders.",
    href: "https://bekwaiyouthmovement.medium.com/",
    sdg: [4],
  },
  {
    title: "Building back from COVID-19 to achieve the SDGs",
    context: "Ghana",
    date: "2023-09-22",
    summary:
      "Contributing youth perspectives on post-pandemic recovery and resilient, sustainable communities.",
    href: "https://bekwaiyouthmovement.medium.com/",
    sdg: [3, 11],
  },
  {
    title: "Fostering peace and sustainable development",
    context: "Ghana",
    date: "2023-09-21",
    summary:
      "Demonstrating BYM's commitment to conflict resolution, strong institutions, and development that lasts.",
    href: "https://bekwaiyouthmovement.medium.com/",
    sdg: [16],
  },
]

export const FEATURED_NEWS = NEWS.filter((n) => n.featured)
