import type { Severity, CinStatus } from "@/types"

/** Standard CIN issue categories (Governance Doc §3 / CIN module). */
export const CIN_CATEGORIES = [
  "Employment",
  "Health",
  "Sanitation",
  "Education",
  "Infrastructure",
  "Water",
  "Security",
  "Grievance",
] as const

export type CinCategory = (typeof CIN_CATEGORIES)[number]

export const SEVERITIES: { value: Severity; label: string; weight: number }[] = [
  { value: "low", label: "Low", weight: 1 },
  { value: "medium", label: "Medium", weight: 2 },
  { value: "high", label: "High", weight: 4 },
  { value: "critical", label: "Critical", weight: 8 },
]

export const SEVERITY_COLOR: Record<Severity, string> = {
  low: "#3C6E9F",
  medium: "#FD9D24",
  high: "#E5243B",
  critical: "#8E1B1B",
}

export const STATUS_TONE: Record<CinStatus, "amber" | "green" | "red"> = {
  open: "amber",
  resolved: "green",
  escalated: "red",
}

/** Maps a development score (0–100) to a heatmap colour band. */
export function scoreColor(score: number): string {
  if (score >= 80) return "#1F4D3F" // strong
  if (score >= 65) return "#4C9F38"
  if (score >= 50) return "#FD9D24"
  if (score >= 35) return "#E5243B"
  return "#8E1B1B" // critical need
}
