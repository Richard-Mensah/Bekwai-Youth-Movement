import type { SeatType } from "@/types"

export type NominationStage =
  | "nominated"
  | "residency_check"
  | "vetting"
  | "interview"
  | "appointed"
  | "rejected"

/** Ordered 5-step pipeline (Governance Doc §4.3) — rejected is a side-state. */
export const NOMINATION_FLOW: NominationStage[] = [
  "nominated",
  "residency_check",
  "vetting",
  "interview",
  "appointed",
]

export const NOMINATION_META: Record<
  NominationStage,
  { label: string; tone: "gray" | "blue" | "amber" | "green" | "red" }
> = {
  nominated: { label: "Nominated", tone: "gray" },
  residency_check: { label: "Residency Check", tone: "blue" },
  vetting: { label: "Vetting", tone: "blue" },
  interview: { label: "Interview", tone: "amber" },
  appointed: { label: "Appointed", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
}

export function nextNominationStage(s: NominationStage): NominationStage | null {
  const i = NOMINATION_FLOW.indexOf(s)
  if (i < 0 || i >= NOMINATION_FLOW.length - 1) return null
  return NOMINATION_FLOW[i + 1]
}

export const SEAT_LABEL: Record<SeatType, string> = {
  mp: "Youth MP (10–45)",
  council_rep: "Council Rep (18–45)",
  cin_officer: "CIN Officer (18+)",
}

export const SEAT_TYPES: SeatType[] = ["mp", "council_rep", "cin_officer"]

/** Three-tier interim protocol (Governance Doc §4.4). */
export const INTERIM_TIERS = [
  { tier: 1, name: "Neighbouring Community Advocate", note: "Nearest community's Council Rep serves as interim dual representative." },
  { tier: 2, name: "BYM Caretaker Representative", note: "Home Secretary appoints a trusted volunteer (max 6 months)." },
  { tier: 3, name: "Traditional Authority Liaison", note: "Sub-chief designates a liaison (observer, non-voting)." },
]
