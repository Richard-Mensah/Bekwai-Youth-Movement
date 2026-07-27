import { CABINET_POSITIONS } from "@/constants/cabinet"

/**
 * The canonical catalogue of every office a young person can apply to serve in,
 * from Director-General down to the community-level seats.
 *
 * Duties, eligibility, age bands and terms are sourced from the BYM
 * Constitution (First Edition, 2026): Article 15 (Cabinet offices),
 * Article 19.3 (Officers of Parliament), Article 25.3 (Community Intelligence
 * Network) and Schedule III (age range, term and SDG focus per Cabinet office).
 *
 * `title` is the canonical string stored in `leadership_applications.role_applied`
 * and must stay byte-identical to the titles in `constants/cabinet.ts` and
 * `constants/leadership.ts`. Where the Constitution names an office differently
 * (e.g. "President of the Youth General Assembly" for the Director-General),
 * that name is carried in `constitutionalTitle` and shown as a secondary line.
 *
 * The Traditional Advisory Council is honorary — appointed, never applied for —
 * and is deliberately absent from this catalogue.
 */

export type RoleArm = "cabinet" | "parliament" | "cin" | "community"

/** Icon keys resolved to lucide components in `components/features/apply/OfficeIcon.tsx`. */
export type OfficeIcon =
  | "crown"
  | "shield"
  | "network"
  | "scroll"
  | "laptop"
  | "wallet"
  | "receipt"
  | "graduation"
  | "heart"
  | "briefcase"
  | "leaf"
  | "megaphone"
  | "lock"
  | "handshake"
  | "venus"
  | "landmark"
  | "calendar"
  | "map"
  | "users"
  | "gavel"
  | "mic"
  | "scale"
  | "clipboard"
  | "radar"
  | "database"
  | "seat"

export type Office = {
  /** URL segment — stable, kebab-case. */
  slug: string
  /** Canonical title. Must equal the value stored in `role_applied`. */
  title: string
  arm: RoleArm
  /** Schedule III number (Cabinet offices only). */
  no?: number
  /** The office's name in the Constitution, where it differs from `title`. */
  constitutionalTitle?: string
  /** Where the duties and qualifications come from. */
  citation?: string
  /** Westminster / Ghana equivalent, shown as a subtle subtitle. */
  ukEquivalent?: string
  reportsTo?: string
  /** One sentence for the catalogue card. */
  summary: string
  responsibilities: string[]
  eligibility: string[]
  /** Inclusive age band from Schedule III. Advisory only — never enforced. */
  ageRange?: [number, number]
  term?: string
  /** How many people hold this office across the Movement. */
  seats: number
  /** Matches a `name` in `constants/units.ts`. */
  unit?: string
  sdg?: number[]
  icon: OfficeIcon
}

export const ARM_META: Record<
  RoleArm,
  { label: string; short: string; description: string }
> = {
  cabinet: {
    label: "Civic Cabinet (Executive)",
    short: "Cabinet",
    description:
      "The 19-member executive of the Youth General Assembly, headed by the Director-General and holding collective, portfolio-based accountability.",
  },
  parliament: {
    label: "Bekwai Youth Parliament (Legislature)",
    short: "Parliament",
    description:
      "The deliberative chamber of the Movement, presided over by an elected Speaker and voicing the concerns of all 33 communities.",
  },
  cin: {
    label: "Community Intelligence Network",
    short: "CIN",
    description:
      "The evidence arm — turning lived community experience into monthly data the Cabinet can act on.",
  },
  community: {
    label: "Community-level seats",
    short: "Community",
    description:
      "One seat of each kind in every one of the 33 communities. This is where most people begin serving.",
  },
}

/** Schedule III terms, keyed by the shorthand used in the Constitution. */
const TERM_TWICE = "2 years, renewable twice (maximum 3 terms)"
const TERM_ONCE = "2 years, renewable once (maximum 2 terms)"
const TERM_OPEN = "2 years, renewable without limit"

/** Applies to every Cabinet office (Article 13.2). */
const CABINET_BASELINE = [
  "Aged between 18 and 45 at the time of appointment (Article 13.2)",
  "A member in good standing of the Bekwai Youth Movement",
  "Resident in, or genuinely connected to, one of the 33 communities",
  "Willing to swear the Oath of Service and abide by the Code of Conduct",
]

/**
 * Per-office detail from Article 15 and Schedule III, keyed by the Schedule III
 * number so it stays aligned with `CABINET_POSITIONS`.
 */
const CABINET_DETAIL: Record<
  number,
  {
    slug: string
    constitutionalTitle?: string
    citation: string
    summary: string
    responsibilities: string[]
    eligibility?: string[]
    ageRange: [number, number]
    term: string
    unit?: string
    icon: OfficeIcon
  }
> = {
  1: {
    slug: "director-general",
    constitutionalTitle: "President of the Youth General Assembly",
    citation: "Article 15.1 · Schedule III",
    summary:
      "Principal executive officer of the Movement — chairs the Cabinet, leads the Annual General Assembly and represents BYM to the world.",
    responsibilities: [
      "Preside over all sittings of the Cabinet and of the Annual General Assembly",
      "Represent the Movement at all formal occasions",
      "Sign every document executed in the name of the Movement, jointly with the Secretary-General",
      "Appoint the Secretaries of State, with the advice of the Founding Leadership",
      "Convene meetings of the Cabinet and of the Annual General Assembly",
      "Hold the casting vote where the Cabinet is evenly divided",
    ],
    eligibility: [
      "A member of the Movement for not less than two (2) years",
      "Resident of a community for not less than two (2) years",
      "Of demonstrated leadership capacity",
      "Elected by secret ballot of Ordinary Members at the Annual General Assembly",
    ],
    ageRange: [22, 35],
    term: TERM_ONCE,
    unit: "Governance & Civic Affairs Unit",
    icon: "crown",
  },
  2: {
    slug: "first-deputy-director-general",
    constitutionalTitle: "First Vice President",
    citation: "Article 15.2 · Schedule III",
    summary:
      "Deputises the Director-General and holds the Cabinet together across every portfolio.",
    responsibilities: [
      "Deputise the Director-General in all functions and assume their duties in their absence",
      "Chair the Cabinet when the Director-General is absent",
      "Oversee cross-portfolio coordination of all Secretaries of State",
      "Exercise such other functions as the Director-General may delegate",
    ],
    eligibility: [
      "A member of the Movement for not less than one (1) year",
      "Resident of a community for not less than two (2) years",
      "Elected by secret ballot at the Annual General Assembly",
    ],
    ageRange: [20, 33],
    term: TERM_ONCE,
    unit: "Governance & Civic Affairs Unit",
    icon: "shield",
  },
  3: {
    slug: "second-deputy-director-general",
    constitutionalTitle: "Second Vice President",
    citation: "Article 15.3 · Schedule III",
    summary:
      "Owns the evidence base — oversees the Community Intelligence Network and every data operation of the Movement.",
    responsibilities: [
      "Oversee the Community Intelligence Network and all data operations",
      "Manage the Director of Community Intelligence and the Data Quality Officer",
      "Ensure the timely compilation and submission of the Monthly Community Reports",
      "Exercise such other functions as the Director-General may delegate",
    ],
    eligibility: [
      "A member of the Movement for not less than one (1) year",
      "Resident of a community for not less than two (2) years",
      "A data, research or analytical background is desirable but not required",
    ],
    ageRange: [20, 33],
    term: TERM_ONCE,
    unit: "Community Intelligence & Data Unit",
    icon: "network",
  },
  4: {
    slug: "secretary-general",
    constitutionalTitle: "Cabinet Secretary / Chief of Staff",
    citation: "Article 15.4 · Schedule III",
    summary:
      "Chief administrative officer and custodian of the Movement's records, registers and Official Seal.",
    responsibilities: [
      "Act as custodian of all official records, documents and registers",
      "Record the minutes of every Cabinet sitting and Annual General Assembly",
      "Manage all official correspondence of the Movement",
      "Register new members and maintain the Members' Register",
      "Keep custody of the Official Seal",
      "Open nominations for every office of the Movement",
    ],
    eligibility: [
      "A member of the Movement for not less than one (1) year",
      "Strong writing and administrative skills",
    ],
    ageRange: [20, 35],
    term: TERM_OPEN,
    unit: "Governance & Civic Affairs Unit",
    icon: "scroll",
  },
  5: {
    slug: "deputy-secretary-general",
    citation: "Article 15.5 · Schedule III",
    summary:
      "Assists the Secretary-General and runs the Movement's digital communications and records.",
    responsibilities: [
      "Assist the Secretary-General in all administrative functions",
      "Manage digital communications of the Movement",
      "Maintain the BYM website and all digital records",
    ],
    eligibility: ["Digital literacy — comfortable working online day to day"],
    ageRange: [18, 33],
    term: TERM_TWICE,
    unit: "Governance & Civic Affairs Unit",
    icon: "laptop",
  },
  6: {
    slug: "chief-financial-officer",
    constitutionalTitle: "Treasurer (Chancellor of the Exchequer)",
    citation: "Article 15.6 · Schedule III",
    summary:
      "Chief financial officer — guards every cedi that passes through the Movement and reports on it publicly.",
    responsibilities: [
      "Manage all funds, accounts and financial records of the Movement",
      "Prepare and present the quarterly and annual financial reports",
      "Countersign all financial transactions above the Cabinet's prescribed threshold",
      "Maintain the Financial Register",
    ],
    eligibility: [
      "A member of the Movement for not less than one (1) year",
      "Financial literacy and a trustworthy track record",
    ],
    ageRange: [20, 40],
    term: TERM_ONCE,
    unit: "Governance & Civic Affairs Unit",
    icon: "wallet",
  },
  7: {
    slug: "deputy-financial-secretary",
    constitutionalTitle: "Deputy Treasurer (Financial Secretary to the Treasury)",
    citation: "Article 15.7 · Schedule III",
    summary:
      "Keeps project money honest — petty cash, project spend and community budget reconciliation.",
    responsibilities: [
      "Assist the Chief Financial Officer in all financial functions",
      "Manage petty cash",
      "Track project-level expenditure",
      "Reconcile community project budgets",
    ],
    ageRange: [18, 35],
    term: TERM_TWICE,
    unit: "Governance & Civic Affairs Unit",
    icon: "receipt",
  },
  8: {
    slug: "secretary-for-education-and-youth",
    citation: "Article 15.8 · Schedule III",
    summary:
      "Leads the Education & Youth Development Unit and the Youth Development Academy.",
    responsibilities: [
      "Lead the Education and Youth Development Unit",
      "Oversee the Youth Parliament programme in conjunction with the Speaker",
      "Manage school partnerships across the communities",
      "Run the Youth Development Academy",
    ],
    ageRange: [20, 38],
    term: TERM_TWICE,
    unit: "Education & Youth Development Unit",
    icon: "graduation",
  },
  9: {
    slug: "secretary-for-health-and-welfare",
    citation: "Article 15.9 · Schedule III",
    summary:
      "Leads community health campaigns, child protection and social welfare across all 33 communities.",
    responsibilities: [
      "Lead the Health and Social Welfare Unit",
      "Coordinate community health campaigns",
      "Manage child protection protocols",
      "Oversee the social welfare volunteer teams",
    ],
    ageRange: [22, 40],
    term: TERM_TWICE,
    unit: "Health & Social Welfare Unit",
    icon: "heart",
  },
  10: {
    slug: "secretary-for-economic-affairs",
    citation: "Article 15.10 · Schedule III",
    summary:
      "Opens doors to work — apprenticeships, microfinance and youth enterprise in every community.",
    responsibilities: [
      "Lead the Economic Empowerment and Employment Unit",
      "Coordinate apprenticeship programmes",
      "Build microfinance linkages for young people",
      "Run youth entrepreneurship programmes across all communities",
    ],
    ageRange: [22, 40],
    term: TERM_TWICE,
    unit: "Economic Empowerment & Employment Unit",
    icon: "briefcase",
  },
  11: {
    slug: "secretary-for-environment",
    constitutionalTitle: "Secretary for Environment, Sanitation and Climate",
    citation: "Article 15.11 · Schedule III",
    summary:
      "Leads sanitation, tree-planting and climate education through the Volunteer Action Teams.",
    responsibilities: [
      "Lead the Environment, Sanitation and Climate Unit",
      "Manage Volunteer Action Teams for sanitation and tree-planting",
      "Run climate education across the communities",
      "Coordinate the Movement's response to environmental challenges",
    ],
    ageRange: [18, 38],
    term: TERM_TWICE,
    unit: "Environment, Sanitation & Climate Unit",
    icon: "leaf",
  },
  12: {
    slug: "secretary-for-communications",
    constitutionalTitle: "Secretary for Communications, Media and Partnerships",
    citation: "Article 15.12 · Schedule III",
    summary:
      "The voice of the Movement — press, social media, the website and diaspora outreach.",
    responsibilities: [
      "Lead the Communications, Media and Partnerships Unit",
      "Manage all public communications, social media and newsletters",
      "Issue press releases on behalf of the Movement",
      "Maintain the BYM website",
      "Coordinate diaspora outreach",
    ],
    ageRange: [18, 35],
    term: TERM_TWICE,
    unit: "Communications, Media & Partnerships Unit",
    icon: "megaphone",
  },
  13: {
    slug: "home-secretary",
    constitutionalTitle: "Secretary of State for the Interior",
    citation: "Article 15.13 · Schedule III",
    summary:
      "Guardian of conduct — resolves conflict, investigates grievances and chairs the Disciplinary Sub-Committee.",
    responsibilities: [
      "Manage internal security, conflict resolution and member conduct",
      "Enforce the Code of Conduct in Schedule IV",
      "Investigate grievances and misconduct reports",
      "Chair the Disciplinary Sub-Committee",
      "Sit on the Vetting Panel for every office of the Movement",
    ],
    eligibility: [
      "A member of the Movement for not less than two (2) years",
      "Of strong integrity and respected by peers",
    ],
    ageRange: [22, 40],
    term: TERM_TWICE,
    unit: "Governance & Civic Affairs Unit",
    icon: "lock",
  },
  14: {
    slug: "secretary-for-regional-affairs-and-partnerships",
    constitutionalTitle: "Secretary for Foreign Affairs and Partnerships",
    citation: "Article 15.14 · Schedule III",
    summary:
      "Builds the Movement's alliances — NGOs, government bodies, diaspora networks and international partners.",
    responsibilities: [
      "Manage all external partnerships with non-governmental organisations and government bodies",
      "Build relationships with diaspora networks and international organisations",
      "Lead partnership negotiations",
      "Execute memoranda of understanding on behalf of the Movement",
      "Maintain the Traditional Authority and Partnership Register",
    ],
    ageRange: [22, 40],
    term: TERM_TWICE,
    unit: "Communications, Media & Partnerships Unit",
    icon: "handshake",
  },
  15: {
    slug: "secretary-for-women-and-gender-equality",
    constitutionalTitle: "Minister for Women and Equalities",
    citation: "Article 15.15 · Schedule III",
    summary:
      "Holds the Movement to its representation thresholds for women and leads women-focused programmes.",
    responsibilities: [
      "Ensure the minimum representation thresholds for women are met across every structure of the Movement",
      "Lead women-focused development programmes",
      "Report gender equality metrics to the Cabinet each quarter",
    ],
    ageRange: [18, 40],
    term: TERM_TWICE,
    unit: "Health & Social Welfare Unit",
    icon: "venus",
  },
  16: {
    slug: "secretary-for-youth-parliament-affairs",
    constitutionalTitle: "Leader of the House",
    citation: "Article 15.16 · Schedule III",
    summary:
      "The bridge between the Cabinet and the Youth Parliament, and the keeper of parliamentary procedure.",
    responsibilities: [
      "Manage the relationship between the Cabinet and the Bekwai Youth Parliament",
      "Schedule parliamentary sessions in consultation with the Speaker",
      "Convey Cabinet decisions to Parliament",
      "Facilitate parliamentary procedure",
    ],
    ageRange: [20, 38],
    term: TERM_TWICE,
    unit: "Governance & Civic Affairs Unit",
    icon: "landmark",
  },
  17: {
    slug: "civic-organiser",
    constitutionalTitle: "The Organiser (Chief Whip)",
    citation: "Article 15.17 · Schedule III",
    summary:
      "Makes things actually happen — every event, sitting and outreach across the communities.",
    responsibilities: [
      "Coordinate all events, sittings and community outreach of the Movement",
      "Manage logistics for every gathering",
      "Ensure the attendance of members at meetings",
      "Maintain attendance records",
      "Appoint Volunteer Action Team Leads with the relevant Secretary",
    ],
    ageRange: [20, 35],
    term: TERM_TWICE,
    unit: "Governance & Civic Affairs Unit",
    icon: "calendar",
  },
  18: {
    slug: "deputy-organiser",
    constitutionalTitle: "Deputy Chief Whip",
    citation: "Article 15.18 · Schedule III",
    summary:
      "Assists the Civic Organiser and runs event coordination at sub-community level.",
    responsibilities: [
      "Assist the Civic Organiser in all functions",
      "Manage sub-community event coordination",
    ],
    ageRange: [18, 33],
    term: TERM_TWICE,
    unit: "Governance & Civic Affairs Unit",
    icon: "map",
  },
  19: {
    slug: "inter-community-liaison-officer",
    constitutionalTitle: "Nasara / Inter-Community Liaison Officer",
    citation: "Article 15.19 · Schedule III",
    summary:
      "Makes sure no group is left outside — relations with Muslim, Zongo and minority communities.",
    responsibilities: [
      "Manage the Movement's relations with Muslim, Zongo and minority communities",
      "Ensure every sub-group is represented and heard within the Assembly",
      "Carry minority community concerns directly to the Home Secretary",
    ],
    ageRange: [20, 40],
    term: TERM_TWICE,
    unit: "Governance & Civic Affairs Unit",
    icon: "users",
  },
}

/** The 19 Cabinet offices, derived from CABINET_POSITIONS so the two stay in step. */
const CABINET_OFFICES: Office[] = CABINET_POSITIONS.map((p) => {
  const d = CABINET_DETAIL[p.no]
  return {
    slug: d.slug,
    title: p.title,
    arm: "cabinet" as const,
    no: p.no,
    constitutionalTitle: d.constitutionalTitle,
    citation: d.citation,
    ukEquivalent: p.ukEquivalent,
    reportsTo: p.reportsTo,
    summary: d.summary,
    responsibilities: d.responsibilities,
    eligibility: [...(d.eligibility ?? []), ...CABINET_BASELINE],
    ageRange: d.ageRange,
    term: d.term,
    seats: 1,
    unit: d.unit,
    sdg: p.sdg,
    icon: d.icon,
  }
})

/** Officers of Parliament — Article 19.3. Elected by Parliament from its own members. */
const PARLIAMENT_ELIGIBILITY = [
  "Already a serving Member of the Bekwai Youth Parliament",
  "Elected by Parliament from amongst its members at its first sitting",
  "Committed to attending every sitting of the chamber",
]

const PARLIAMENT_OFFICES: Office[] = [
  {
    slug: "speaker-of-the-youth-parliament",
    title: "Speaker of the Youth Parliament",
    arm: "parliament",
    citation: "Article 19.3 · Standing Orders BYP/SO/2025",
    summary:
      "Principal presiding officer of Parliament — keeps order and certifies Youth Recommendations to the Cabinet.",
    responsibilities: [
      "Preside over all sittings of the Bekwai Youth Parliament",
      "Maintain order and enforce the Standing Orders",
      "Certify Youth Recommendations before they go to the Cabinet",
      "Agree the parliamentary calendar with the Secretary for Youth Parliament Affairs",
      "Invite Cabinet members to attend sittings where appropriate",
    ],
    eligibility: PARLIAMENT_ELIGIBILITY,
    term: "1 year, renewable",
    seats: 1,
    unit: "Governance & Civic Affairs Unit",
    sdg: [16],
    icon: "gavel",
  },
  {
    slug: "deputy-speaker",
    title: "Deputy Speaker",
    arm: "parliament",
    citation: "Article 19.3(b)",
    summary:
      "Deputises the Speaker and keeps the chamber's procedure clean.",
    responsibilities: [
      "Preside over sittings in the absence of the Speaker",
      "Oversee procedural compliance with the Standing Orders",
      "Support the Speaker in maintaining order",
    ],
    eligibility: PARLIAMENT_ELIGIBILITY,
    term: "1 year, renewable",
    seats: 1,
    unit: "Governance & Civic Affairs Unit",
    sdg: [16],
    icon: "scale",
  },
  {
    slug: "majority-leader",
    title: "Majority Leader",
    arm: "parliament",
    ukEquivalent: "Civic Frontbench Lead",
    citation: "Article 19.3(c)",
    summary: "Leads the majority caucus and schedules the business of the House.",
    responsibilities: [
      "Lead the majority caucus of the chamber",
      "Schedule debates and manage the order of business",
      "Marshal support for Youth Recommendations",
    ],
    eligibility: PARLIAMENT_ELIGIBILITY,
    term: "1 year, renewable",
    seats: 1,
    unit: "Governance & Civic Affairs Unit",
    sdg: [16],
    icon: "mic",
  },
  {
    slug: "minority-opposition-leader",
    title: "Minority / Opposition Leader",
    arm: "parliament",
    ukEquivalent: "Shadow Leader of the House",
    citation: "Article 19.3(d)",
    summary:
      "Leads the minority caucus and guarantees that every debate hears the other side.",
    responsibilities: [
      "Lead the minority caucus of the chamber",
      "Ensure balanced debate and put alternative perspectives on the record",
      "Hold the majority to account on behalf of the communities",
    ],
    eligibility: PARLIAMENT_ELIGIBILITY,
    term: "1 year, renewable",
    seats: 1,
    unit: "Governance & Civic Affairs Unit",
    sdg: [16],
    icon: "scale",
  },
  {
    slug: "parliament-clerk",
    title: "Parliament Clerk",
    arm: "parliament",
    citation: "Article 19.3(e)",
    summary:
      "Chief recorder of the chamber — minutes, documentation and the filing of Youth Recommendations.",
    responsibilities: [
      "Record the minutes of every sitting of Parliament",
      "Manage all documentation of the chamber",
      "File Youth Recommendations and transmit them to the Cabinet",
      "Maintain the Hansard record",
    ],
    eligibility: PARLIAMENT_ELIGIBILITY,
    term: "1 year, renewable",
    seats: 1,
    unit: "Governance & Civic Affairs Unit",
    sdg: [16, 17],
    icon: "clipboard",
  },
]

/** Community Intelligence Network leadership — Article 25.3(1). */
const CIN_OFFICES: Office[] = [
  {
    slug: "director-of-community-intelligence",
    title: "Director of Community Intelligence",
    arm: "cin",
    citation: "Article 25.3(1)(a) · Article 26.1(b)",
    reportsTo: "2nd Deputy Director-General",
    summary:
      "Runs the evidence engine — 32 community officers, the reporting tools and the Monthly Community Report.",
    responsibilities: [
      "Oversee all 32 Community Intelligence Officers",
      "Prescribe the form of the Monthly Community Intelligence Report",
      "Design the data tools and reporting standards of the Network",
      "Compile the Monthly Community Reports for the Cabinet",
      "Maintain the Community Intelligence Register",
      "Act immediately on urgent issues flagged by officers",
    ],
    eligibility: [
      "Aged 18 or over",
      "Comfortable working with numbers, forms and simple data tools",
      "Able to keep sensitive community information confidential",
      "A member in good standing of the Movement",
    ],
    term: "2 years, renewable",
    seats: 1,
    unit: "Community Intelligence & Data Unit",
    sdg: [16, 17],
    icon: "radar",
  },
  {
    slug: "deputy-director-of-intelligence",
    title: "Deputy Director of Intelligence",
    arm: "cin",
    citation: "Article 25.3(1)(b)",
    reportsTo: "Director of Community Intelligence",
    summary:
      "Trains the officers in the field and verifies what comes back each month.",
    responsibilities: [
      "Field-train Community Intelligence Officers across the communities",
      "Verify monthly data submissions before they reach the Director",
      "Deputise for the Director of Community Intelligence",
    ],
    eligibility: [
      "Aged 18 or over",
      "Willing to travel between communities",
      "Patient teacher — much of this role is training others",
      "A member in good standing of the Movement",
    ],
    term: "2 years, renewable",
    seats: 1,
    unit: "Community Intelligence & Data Unit",
    sdg: [16],
    icon: "network",
  },
  {
    slug: "data-quality-officer",
    title: "Data Quality Officer",
    arm: "cin",
    citation: "Article 25.3(1)(c) · Article 26.2",
    reportsTo: "Director of Community Intelligence",
    summary:
      "Guards the integrity of every number the Movement publishes.",
    responsibilities: [
      "Audit submissions for accuracy and completeness",
      "Maintain the data-integrity standards of the Network",
      "Ensure compliance with the Data Protection Act, 2012 (Act 843)",
      "Check that published community data is properly anonymised",
    ],
    eligibility: [
      "Aged 18 or over",
      "An eye for detail and a habit of checking things twice",
      "Discreet with personal and sensitive data",
      "A member in good standing of the Movement",
    ],
    term: "2 years, renewable",
    seats: 1,
    unit: "Community Intelligence & Data Unit",
    sdg: [16],
    icon: "database",
  },
]

/** Community-level seats — one of each in every one of the 33 communities. */
const COMMUNITY_OFFICES: Office[] = [
  {
    slug: "youth-mp",
    title: "Youth MP (ages 10–45)",
    arm: "community",
    citation: "Article 18.3 · Article 19",
    reportsTo: "Speaker of the Youth Parliament",
    summary:
      "Your community's voice in the Bekwai Youth Parliament — one seat in each of the 33 communities.",
    responsibilities: [
      "Represent your community in the Bekwai Youth Parliament",
      "Debate matters of community concern raised in the chamber or referred by the Cabinet",
      "Propose and vote on Youth Recommendations to the Cabinet",
      "Take part in structured civic education and democratic training",
      "Report back to your community on what Parliament has decided",
    ],
    eligibility: [
      "Aged 10 to 45",
      "Resident in — or attending a school serving — the community you wish to represent, for at least six (6) months",
      "Nominated by a headteacher, a teacher, a Sub-Chief or a recognised community elder",
      "Written parental or guardian consent if you are under 18",
      "A short interview with the Secretary for Education & Youth Development",
    ],
    ageRange: [10, 45],
    term: "1 year, renewable",
    seats: 32,
    unit: "Governance & Civic Affairs Unit",
    sdg: [16, 4],
    icon: "seat",
  },
  {
    slug: "community-council-representative",
    title: "Community Council Representative (18–45)",
    arm: "community",
    citation: "Article 13.3(2)",
    reportsTo: "Secretary-General",
    summary:
      "Your community's seat at the Youth General Assembly — one representative per community.",
    responsibilities: [
      "Represent your community within the Youth General Assembly",
      "Carry community priorities into Assembly deliberations",
      "Coordinate BYM activity happening in your community",
      "Work alongside your Sub-Chief and community elders",
      "Report Assembly decisions back to the people you represent",
    ],
    eligibility: [
      "Aged 18 to 45",
      "Resident in the community you wish to represent",
      "Known to community members and to the Sub-Chief",
      "A member in good standing of the Movement",
    ],
    ageRange: [18, 45],
    term: "2 years, renewable",
    seats: 32,
    unit: "Governance & Civic Affairs Unit",
    sdg: [11, 16],
    icon: "users",
  },
  {
    slug: "cin-officer-community",
    title: "CIN Officer — Community (18+)",
    arm: "community",
    citation: "Article 25.3(2)",
    reportsTo: "Director of Community Intelligence",
    summary:
      "The eyes and ears of the Movement in your community — one officer per community, reporting every month.",
    responsibilities: [
      "Submit a Monthly Community Intelligence Report in the form the Director prescribes",
      "Share a summary of that report with the Sub-Chief of your community",
      "Flag urgent issues to the Director immediately",
      "Maintain confidentiality of any sensitive information",
    ],
    eligibility: [
      "Aged 18 or over",
      "Resident in the community you would report on",
      "Able to submit a written report once a month, on time",
      "Trusted to handle sensitive information discreetly",
    ],
    ageRange: [18, 45],
    term: "2 years, renewable",
    seats: 32,
    unit: "Community Intelligence & Data Unit",
    sdg: [16, 17],
    icon: "radar",
  },
]

/** Every office open for application, in constitutional precedence order. */
export const OFFICES: Office[] = [
  ...CABINET_OFFICES,
  ...PARLIAMENT_OFFICES,
  ...CIN_OFFICES,
  ...COMMUNITY_OFFICES,
]

const BY_SLUG = new Map(OFFICES.map((o) => [o.slug, o]))
const BY_TITLE = new Map(OFFICES.map((o) => [o.title, o]))

export function officeBySlug(slug: string): Office | undefined {
  return BY_SLUG.get(slug)
}

export function officeByTitle(title: string): Office | undefined {
  return BY_TITLE.get(title)
}

/**
 * Whether an applicant's age sits inside the office's advisory band.
 * Returns `null` when either the age or the band is unknown — callers should
 * treat that as "no opinion" rather than as a failure. Age is never enforced.
 */
export function ageFitsOffice(
  office: Office,
  age: number | null | undefined
): boolean | null {
  if (!office.ageRange || age == null || Number.isNaN(age)) return null
  return age >= office.ageRange[0] && age <= office.ageRange[1]
}
