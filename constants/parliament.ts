import type { BillStatus } from "@/types"

type Tone = "gray" | "blue" | "amber" | "green" | "red"

/** Ordered legislative lifecycle (Standing Orders Art. 26). */
export const BILL_FLOW: BillStatus[] = [
  "draft",
  "first_reading",
  "second_reading",
  "committee",
  "third_reading",
  "passed",
]

export const BILL_STATUS_META: Record<BillStatus, { label: string; tone: Tone }> = {
  draft: { label: "Draft", tone: "gray" },
  first_reading: { label: "First Reading", tone: "blue" },
  second_reading: { label: "Second Reading", tone: "blue" },
  committee: { label: "Committee Stage", tone: "amber" },
  third_reading: { label: "Third Reading", tone: "amber" },
  passed: { label: "Passed", tone: "green" },
  rejected: { label: "Rejected", tone: "red" },
}

/** Next stage in the lifecycle, or null at the end. */
export function nextStage(status: BillStatus): BillStatus | null {
  const i = BILL_FLOW.indexOf(status)
  if (i < 0 || i >= BILL_FLOW.length - 1) return null
  return BILL_FLOW[i + 1]
}

export const VOTE_CHOICES = [
  { value: "aye", label: "Aye", color: "#1F4D3F" },
  { value: "no", label: "No", color: "#8E1B1B" },
  { value: "abstain", label: "Abstain", color: "#6B7280" },
] as const

export type VoteChoice = (typeof VOTE_CHOICES)[number]["value"]
