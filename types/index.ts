// Shared domain types for the BYM Governance Platform.

export type Role =
  | "public"
  | "member"
  | "volunteer"
  | "cin_officer"
  | "mp"
  | "secretary"
  | "elder"
  | "admin"
  | "super_admin"

export type VerificationStatus = "pending" | "verified" | "rejected"

export type Gender = "male" | "female" | "other"

export type ProjectStatus =
  | "proposed"
  | "approved"
  | "in_progress"
  | "completed"
  | "suspended"

export type BillStatus =
  | "draft"
  | "first_reading"
  | "second_reading"
  | "committee"
  | "third_reading"
  | "passed"
  | "rejected"

export type CinStatus = "open" | "resolved" | "escalated"

export type Severity = "low" | "medium" | "high" | "critical"

export type SeatType = "mp" | "council_rep" | "cin_officer"

export interface Community {
  id: number
  name: string
  isTown: boolean
  population?: number
  developmentIndex?: number
}

export interface CabinetPosition {
  no: number
  title: string
  ukEquivalent?: string
  unit?: string
  reportsTo?: string
  sdg: number[]
}

export interface Unit {
  no: number
  name: string
  mandate: string
  officer: string
  sdg: number[]
}

export interface SdgGoal {
  goal: number
  title: string
  color: string
}

export interface Profile {
  id: string
  membershipId: string
  fullName: string
  gender: Gender
  dob: string
  phone?: string
  email?: string
  communityId?: number
  role: Role
  cabinetPositionNo?: number
  verificationStatus: VerificationStatus
  profileImagePath?: string
  termStart?: string
  termEnd?: string
}
