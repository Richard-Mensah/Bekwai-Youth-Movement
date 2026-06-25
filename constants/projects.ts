import type { ProjectStatus } from "@/types"

type Tone = "gray" | "blue" | "amber" | "green" | "red"

/** Forward lifecycle for advancement (suspended is a manual side-state). */
export const PROJECT_FLOW: ProjectStatus[] = [
  "proposed",
  "approved",
  "in_progress",
  "completed",
]

export const PROJECT_STATUS_META: Record<
  ProjectStatus,
  { label: string; tone: Tone }
> = {
  proposed: { label: "Proposed", tone: "gray" },
  approved: { label: "Approved", tone: "blue" },
  in_progress: { label: "In Progress", tone: "amber" },
  completed: { label: "Completed", tone: "green" },
  suspended: { label: "Suspended", tone: "red" },
}

/** Next lifecycle status, or null at the end. */
export function nextProjectStatus(status: ProjectStatus): ProjectStatus | null {
  const i = PROJECT_FLOW.indexOf(status)
  if (i < 0 || i >= PROJECT_FLOW.length - 1) return null
  return PROJECT_FLOW[i + 1]
}

/** Currency formatting for Ghana Cedis. */
export function ghs(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    maximumFractionDigits: 0,
  }).format(amount)
}
