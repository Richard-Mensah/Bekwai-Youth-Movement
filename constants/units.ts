import type { Unit } from "@/types"

/** The 7 operational Units of the YGA (Governance Doc §1). */
export const UNITS: Unit[] = [
  {
    no: 1,
    name: "Governance & Civic Affairs Unit",
    mandate:
      "Oversees Youth Parliament, civic education, legislative processes, and constitutional compliance.",
    officer: "Secretary-General",
    sdg: [16, 17],
  },
  {
    no: 2,
    name: "Education & Youth Development Unit",
    mandate:
      "School partnerships, literacy support, mentorship, skills training, and the Youth Development Academy.",
    officer: "Secretary for Education",
    sdg: [4, 8],
  },
  {
    no: 3,
    name: "Health & Social Welfare Unit",
    mandate:
      "Community health campaigns, mental health awareness, child protection, and social welfare.",
    officer: "Secretary for Health & Welfare",
    sdg: [3, 5],
  },
  {
    no: 4,
    name: "Economic Empowerment & Employment Unit",
    mandate:
      "Youth entrepreneurship, apprenticeship linkages, microfinance access, and job-readiness.",
    officer: "Secretary for Economic Affairs",
    sdg: [1, 8, 10],
  },
  {
    no: 5,
    name: "Environment, Sanitation & Climate Unit",
    mandate:
      "Sanitation campaigns, tree planting, environmental education, and climate adaptation projects.",
    officer: "Secretary for Environment",
    sdg: [6, 11, 13, 15],
  },
  {
    no: 6,
    name: "Community Intelligence & Data Unit",
    mandate:
      "Operates the Community Intelligence Network (CIN), monthly reporting, database, and impact measurement.",
    officer: "Director of Intelligence",
    sdg: [16, 17],
  },
  {
    no: 7,
    name: "Communications, Media & Partnerships Unit",
    mandate:
      "Public communications, website, social media, media relations, diaspora outreach, and partnerships.",
    officer: "Secretary for Communications",
    sdg: [17],
  },
]
