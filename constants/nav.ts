/** A single navigation destination. */
export type NavLink = {
  label: string
  href: string
  description?: string
}

/** A top-level nav item: either a direct link or a dropdown with children. */
export type NavItem = NavLink | { label: string; children: NavLink[] }

export function isDropdown(
  item: NavItem
): item is { label: string; children: NavLink[] } {
  return "children" in item
}

/**
 * Public site primary navigation.
 * Mixes direct links (Home, Contact) and dropdown tabs (About, Our Governance,
 * Our Impact, Media). Data-driven so the header renders dropdowns wherever an
 * item has `children`. Note: joining is handled by the "Join BYM" header button
 * (→ /join), so there is deliberately no duplicate "Get Involved" nav tab.
 */
export const PUBLIC_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    children: [
      { label: "Our Story", href: "/about", description: "Who we are and how we began" },
      {
        label: "Mission & Principles",
        href: "/about#principles",
        description: "Non-political, service over self, inclusion",
      },
      {
        label: "Traditional Authority",
        href: "/about#tac",
        description: "Our Traditional Advisory Council",
      },
      {
        label: "Founding Timeline",
        href: "/about#timeline",
        description: "The road to Founding Day, 12 Jan 2027",
      },
    ],
  },
  {
    label: "Our Governance",
    children: [
      {
        label: "Youth General Assembly",
        href: "/leadership",
        description: "The executive: a 19-member Civic Cabinet",
      },
      {
        label: "Bekwai Youth Parliament",
        href: "/parliament",
        description: "The legislature: Speaker-led, ages 10–45",
      },
      {
        label: "Leadership & Cabinet",
        href: "/leadership",
        description: "Meet the people who lead BYM",
      },
      {
        label: "Community Intelligence Network",
        href: "/cin",
        description: "Evidence from all 33 communities",
      },
      {
        label: "Open Roles",
        href: "/leadership/roles",
        description: "Every office open for application",
      },
    ],
  },
  {
    label: "Our Impact",
    children: [
      {
        label: "SDG Alignment",
        href: "/sdgs",
        description: "Aligned with 12 UN Global Goals",
      },
      { label: "Projects", href: "/projects", description: "Community projects and outcomes" },
      {
        label: "Transparency Portal",
        href: "/transparency",
        description: "Budgets, reports and scorecards",
      },
      {
        label: "Communities",
        href: "/communities",
        description: "Explore all 33 communities and their reps",
      },
      {
        label: "Community Representation",
        href: "/representation",
        description: "No community left without a voice",
      },
    ],
  },
  {
    label: "Media",
    children: [
      {
        label: "News & Press",
        href: "/news",
        description: "BYM on the local and global stage",
      },
      { label: "Events", href: "/events", description: "Durbars, sittings, and launches" },
      { label: "Gallery", href: "/gallery", description: "Moments from our communities" },
    ],
  },
  { label: "Contact", href: "/contact" },
]

/** Flattened list of primary destinations — used by the footer. */
export const FOOTER_NAV: NavLink[] = PUBLIC_NAV.flatMap((item) =>
  isDropdown(item) ? item.children : [item]
).filter(
  (link, i, arr) => arr.findIndex((l) => l.href === link.href) === i
)

export const ORG = {
  name: "Bekwai Youth Movement",
  shortName: "BYM",
  motto: "Volunteering for Change",
  /** Flagship initiative the movement is bringing on board (not the org name). */
  assembly: "Youth General Assembly",
  region: "Sefwi Bekwai · Western North Region · Ghana",
  established: 2026,
  /** Official Launch / Founding Day of the Youth General Assembly. */
  foundingDate: "2027-01-12",
  /**
   * The Movement's own address, on the Movement's own domain.
   *
   * This is the public contact point: the footer, the contact page and the
   * `NGO` structured data all read it from here. It was a gmail.com address,
   * which undercut every other signal on the site — a body that publishes its
   * accounts and its Assembly minutes asking to be written to at a free mailbox
   * reads as smaller than it is, and Gmail itself treats a domain that sends
   * from one place and receives at another with more suspicion.
   *
   * `info@bekwaiyouthmovement.org` is a real mailbox on the Movement's mail
   * server, receiving over IMAP and sending with SPF, DKIM and DMARC aligned.
   * It is also the Reply-To on every auth and welcome email, so a member who
   * simply hits reply reaches the Secretariat rather than a no-reply void.
   */
  email: "info@bekwaiyouthmovement.org",
  medium: "https://bekwaiyouthmovement.medium.com",
} as const
