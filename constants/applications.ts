/**
 * The application lifecycle, mirroring the appointment stages set out in
 * Article 30.2 of the BYM Constitution:
 *
 *   (1) the formal opening of nominations by the Secretary-General
 *   (2) the receipt of nominations within the prescribed window
 *   (3) the vetting of all nominees by the Vetting Panel
 *   (4) the recommendation of qualified candidates to the appointing authority
 *   (5) the appointment and the issuance of a Letter of Appointment
 *   (6) the swearing-in of the appointee in accordance with Schedule I
 */

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "received"
  | "vetting"
  | "recommended"
  | "appointed"
  | "sworn_in"
  | "rejected"
  | "withdrawn"
  | "archived"

export type StageKey = Extract<
  ApplicationStatus,
  "submitted" | "received" | "vetting" | "recommended" | "appointed" | "sworn_in"
>

export type Stage = {
  key: StageKey
  label: string
  /** What the applicant should understand is happening right now. */
  blurb: string
  citation?: string
}

/** The happy path, in order. Drives the applicant's stage tracker. */
export const APPLICATION_STAGES: Stage[] = [
  {
    key: "submitted",
    label: "Submitted",
    blurb: "Your application is with the Secretariat. Nothing more to do for now.",
  },
  {
    key: "received",
    label: "Nomination received",
    blurb:
      "The Secretary-General has formally received your nomination within the prescribed window.",
    citation: "Article 30.2(2)",
  },
  {
    key: "vetting",
    label: "Vetting Panel",
    blurb:
      "The Vetting Panel is reviewing your application. You may be invited to meet them in person in Sefwi Bekwai, or online.",
    citation: "Article 30.1 · 30.2(3)",
  },
  {
    key: "recommended",
    label: "Recommended",
    blurb:
      "The Panel has recommended you to the appointing authority. A decision follows.",
    citation: "Article 30.2(4)",
  },
  {
    key: "appointed",
    label: "Appointed",
    blurb: "Congratulations — your Letter of Appointment has been issued.",
    citation: "Article 30.2(5)",
  },
  {
    key: "sworn_in",
    label: "Sworn in",
    blurb:
      "You have taken the Oath of Service and are formally in office. Welcome.",
    citation: "Schedule I",
  },
]

export const STAGE_ORDER: StageKey[] = APPLICATION_STAGES.map((s) => s.key)

/** Statuses that end the process without an appointment. */
export const CLOSED_STATUSES: ApplicationStatus[] = [
  "rejected",
  "withdrawn",
  "archived",
]

export type StatusTone = "green" | "red" | "blue" | "gray" | "amber" | "gold" | "canopy"

export const STATUS_META: Record<
  ApplicationStatus,
  { label: string; tone: StatusTone; description: string }
> = {
  draft: {
    label: "Draft",
    tone: "gray",
    description: "Not submitted yet — only you can see this.",
  },
  submitted: {
    label: "Submitted",
    tone: "amber",
    description: "With the Secretariat, awaiting first review.",
  },
  received: {
    label: "Nomination received",
    tone: "blue",
    description: "Formally received by the Secretary-General.",
  },
  vetting: {
    label: "Vetting Panel",
    tone: "blue",
    description: "Before the Vetting Panel.",
  },
  recommended: {
    label: "Recommended",
    tone: "gold",
    description: "Recommended to the appointing authority.",
  },
  appointed: {
    label: "Appointed",
    tone: "green",
    description: "Letter of Appointment issued.",
  },
  sworn_in: {
    label: "Sworn in",
    tone: "green",
    description: "Oath of Service taken — formally in office.",
  },
  rejected: {
    label: "Not successful",
    tone: "red",
    description: "Not taken forward on this occasion.",
  },
  withdrawn: {
    label: "Withdrawn",
    tone: "gray",
    description: "Withdrawn by the applicant.",
  },
  archived: {
    label: "Archived",
    tone: "gray",
    description: "Closed and filed.",
  },
}

/** Stages the Secretariat can move an application into, in board order. */
export const ADMIN_PIPELINE: ApplicationStatus[] = [
  "submitted",
  "received",
  "vetting",
  "recommended",
  "appointed",
  "sworn_in",
]

/**
 * How far along the happy path a status sits.
 * -1 for draft and for the closed statuses, which sit outside the ladder.
 */
export function stageIndex(status: string): number {
  return STAGE_ORDER.indexOf(status as StageKey)
}

export function isClosed(status: string): boolean {
  return CLOSED_STATUSES.includes(status as ApplicationStatus)
}

export function statusMeta(status: string) {
  return STATUS_META[status as ApplicationStatus] ?? STATUS_META.submitted
}

/** The wizard's seven steps. Shared by the step rail and the resume banner. */
export const WIZARD_STEPS = [
  { n: 1, title: "The office", hint: "Which role you want to serve in" },
  { n: 2, title: "About you", hint: "How we reach you" },
  { n: 3, title: "Your background", hint: "All optional" },
  { n: 4, title: "Why this office", hint: "In your own words" },
  { n: 5, title: "Documents", hint: "Optional — a CV helps but isn't required" },
  { n: 6, title: "Vetting", hint: "In person or online" },
  { n: 7, title: "Review & submit", hint: "Check everything over" },
] as const

export const TOTAL_STEPS = WIZARD_STEPS.length

export const VETTING_OPTIONS = [
  { value: "in_person", title: "In-person", body: "I'll be in Sefwi Bekwai" },
  { value: "virtual", title: "Virtual", body: "I'll be away from home" },
  { value: "either", title: "Either", body: "Whatever works best" },
] as const

export const VETTING_LABEL: Record<string, string> = {
  in_person: "In-person (Sefwi Bekwai)",
  virtual: "Virtual (online)",
  either: "Either / not sure yet",
}

/** Upload rules, shared by the client uploader and the server action. */
export const DOC_BUCKET = "applications"
export const DOC_MAX_BYTES = 5 * 1024 * 1024
export const DOC_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "odt",
  "rtf",
  "jpg",
  "jpeg",
  "png",
]

export const DOC_KINDS = [
  { value: "cv", label: "CV or résumé" },
  { value: "id_document", label: "Photo ID" },
  { value: "endorsement", label: "Endorsement or nomination letter" },
  { value: "consent", label: "Parental / guardian consent" },
  { value: "other", label: "Other supporting document" },
] as const

export function docKindLabel(kind: string): string {
  return DOC_KINDS.find((k) => k.value === kind)?.label ?? "Document"
}
