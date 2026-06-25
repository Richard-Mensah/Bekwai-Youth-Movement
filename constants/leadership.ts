import { CABINET_POSITIONS } from "@/constants/cabinet"

/**
 * A person occupying a governance role. `name` and `photo` are optional so the
 * page is photo-ready before official appointments — fill them in as the
 * movement confirms each office holder (Cabinet appointments: July 2026).
 *
 * A few names confirmed from BYM's public materials are pre-seeded; replace or
 * extend freely. Drop headshots into /public/images/leaders/ and set `photo`.
 */
export type Leader = {
  title: string
  name?: string
  photo?: string
  /** Westminster/Ghana equivalent, shown as a subtle subtitle. */
  ukEquivalent?: string
  /** Short portfolio description. */
  blurb?: string
  sdg?: number[]
}

export type LeaderTier = {
  id: string
  title: string
  eyebrow: string
  description: string
  members: Leader[]
}

const PORTFOLIO: Record<number, string> = {
  1: "Supreme head of the Assembly; chairs Cabinet and General Assembly sittings; represents BYM externally.",
  2: "Deputises the DG; chairs Cabinet in the DG's absence; oversees cross-portfolio coordination.",
  3: "Oversees the Community Intelligence Network and data operations; ensures monthly reports are delivered.",
  4: "Chief administrative officer; custodian of official documents; records minutes; registers members.",
  5: "Manages digital communications; maintains the website and social media; coordinates digital records.",
  6: "Manages all Assembly funds; presents quarterly financial reports; maintains the financial register.",
  7: "Manages petty cash and project-level expenditure; reconciles community project budgets.",
  8: "Leads the Education & Youth Development Unit and the Youth Development Academy.",
  9: "Leads the Health & Social Welfare Unit; coordinates health campaigns and child protection.",
  10: "Leads the Economic Empowerment & Employment Unit across all 32 communities.",
  11: "Leads the Environment, Sanitation & Climate Unit and Volunteer Action Teams.",
  12: "Leads the Communications Unit; manages public communications, media, and the BYM website.",
  13: "Manages internal security, conflict resolution, member conduct, and the Code of Conduct.",
  14: "Manages external partnerships, NGOs, diaspora, and international organisations.",
  15: "Ensures ≥40% female representation across all arms; leads women-focused programmes.",
  16: "Manages the relationship between the Cabinet and the Youth Parliament.",
  17: "Coordinates all BYM events, sittings, and community outreach; manages logistics.",
  18: "Assists the Organiser; manages sub-community event coordination.",
  19: "Manages relations with minority communities; ensures every sub-group is represented.",
}

// Names confirmed from BYM's public-facing materials. Edit as official.
const CONFIRMED_NAMES: Record<number, string> = {
  1: "Owusu Philip", // President / Director-General
  2: "Owusu Nyame Janet", // Vice — 1st Deputy Director-General
  12: "Kofi Richard", // Public Relations — Secretary for Communications
}

const executiveCabinet: Leader[] = CABINET_POSITIONS.map((p) => ({
  title: p.title,
  ukEquivalent: p.ukEquivalent,
  blurb: PORTFOLIO[p.no],
  sdg: p.sdg,
  name: CONFIRMED_NAMES[p.no],
}))

export const LEADERSHIP_TIERS: LeaderTier[] = [
  {
    id: "cabinet",
    eyebrow: "The Executive",
    title: "Civic Cabinet of the Youth General Assembly",
    description:
      "Modelled on the United Kingdom Cabinet, the 19-member Civic Cabinet is headed by the Director-General and holds collective, portfolio-based accountability to the General Assembly.",
    members: executiveCabinet,
  },
  {
    id: "parliament",
    eyebrow: "The Legislature",
    title: "Bekwai Youth Parliament leadership",
    description:
      "Mirroring the Parliament of Ghana, the Youth Parliament is the deliberative voice of young people aged 10–45, presided over by an elected Speaker.",
    members: [
      {
        title: "Speaker of the Youth Parliament",
        blurb:
          "Presides over all sittings; maintains order; certifies Youth Recommendations to the Cabinet.",
        sdg: [16],
      },
      {
        title: "Deputy Speaker",
        blurb: "Deputises the Speaker; oversees procedural compliance.",
        sdg: [16],
      },
      {
        title: "Majority Leader",
        ukEquivalent: "Civic Frontbench Lead",
        blurb: "Leads the majority caucus; schedules debates.",
        sdg: [16],
      },
      {
        title: "Minority / Opposition Leader",
        ukEquivalent: "Shadow Leader of the House",
        blurb: "Ensures balanced debate and alternative perspectives.",
        sdg: [16],
      },
      {
        title: "Parliament Clerk",
        blurb: "Records minutes; manages documentation; files Youth Recommendations.",
        sdg: [16, 17],
      },
    ],
  },
  {
    id: "cin",
    eyebrow: "The Intelligence",
    title: "Community Intelligence Network leadership",
    description:
      "The CIN turns lived community experience into evidence — coordinating one intelligence officer in each of the 32 communities and a monthly reporting cycle.",
    members: [
      {
        title: "Director of Community Intelligence",
        blurb:
          "Oversees all 32 CIN Officers; designs data tools; compiles the Monthly Community Reports.",
        sdg: [16, 17],
      },
      {
        title: "Deputy Director of Intelligence",
        blurb: "Field-trains CIN Officers; verifies monthly data submissions.",
        sdg: [16],
      },
      {
        title: "Data Quality Officer",
        blurb: "Audits submissions for accuracy; maintains data-integrity standards.",
        sdg: [16],
      },
    ],
  },
  {
    id: "tac",
    eyebrow: "Honorary Guardianship",
    title: "Traditional Advisory Council",
    description:
      "The highest honorary body — holding no executive power but commanding moral authority, community trust, and cultural legitimacy as guardian of BYM's non-political values.",
    members: [
      {
        title: "Patron of the Assembly",
        ukEquivalent: "Paramount Chief of Sefwi Bekwai",
        blurb: "Blesses the Assembly and anchors its standing in tradition.",
      },
      {
        title: "Women's Patron",
        ukEquivalent: "Queenmother of Sefwi Bekwai",
        blurb: "Champions the place of women and girls across the movement.",
      },
      {
        title: "Government Liaison Patron",
        ukEquivalent: "Municipal Chief Executive (MCE)",
        blurb: "Bridges the Assembly with municipal government.",
      },
      {
        title: "Institutional Patron",
        ukEquivalent: "Bibiani-Anhwiaso-Bekwai Municipal Assembly",
        blurb: "Connects BYM to formal local-government institutions.",
      },
    ],
  },
]
