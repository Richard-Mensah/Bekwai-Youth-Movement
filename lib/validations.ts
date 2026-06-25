import { z } from "zod"

/** Membership registration form (public "Join BYM"). */
export const registerSchema = z.object({
  fullName: z.string().min(3, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  gender: z.enum(["male", "female", "other"], {
    message: "Select your gender",
  }),
  dob: z.string().min(1, "Enter your date of birth"),
  phone: z
    .string()
    .min(9, "Enter a valid phone number")
    .regex(/^[0-9+\s-]+$/, "Digits only"),
  communityId: z.coerce.number().int().min(1, "Select your community"),
})

export type RegisterInput = z.infer<typeof registerSchema>

/** CIN monthly report submission. */
export const cinReportSchema = z.object({
  category: z.string().min(1, "Select a category"),
  severity: z.enum(["low", "medium", "high", "critical"], {
    message: "Select a severity",
  }),
  description: z.string().min(10, "Describe the issue (min 10 characters)"),
  communityId: z.coerce.number().int().min(1, "Select a community"),
  gpsLat: z.coerce.number().optional(),
  gpsLng: z.coerce.number().optional(),
})

export type CinReportInput = z.infer<typeof cinReportSchema>

/** A new Bill submitted to Parliament. */
export const billSchema = z.object({
  title: z.string().min(6, "Enter a bill title (min 6 characters)"),
  summary: z.string().min(10, "Add a short summary (min 10 characters)"),
})
export type BillInput = z.infer<typeof billSchema>

/** A new Motion. */
export const motionSchema = z.object({
  title: z.string().min(6, "Enter a motion title (min 6 characters)"),
  body: z.string().min(10, "Describe the motion (min 10 characters)"),
})
export type MotionInput = z.infer<typeof motionSchema>

/** A Youth Recommendation forwarded to Cabinet. */
export const recommendationSchema = z.object({
  title: z.string().min(6, "Enter a title (min 6 characters)"),
  body: z.string().min(10, "Describe the recommendation (min 10 characters)"),
  communityId: z.coerce.number().int().optional(),
})
export type RecommendationInput = z.infer<typeof recommendationSchema>

/** A new community development project. */
export const projectSchema = z.object({
  name: z.string().min(6, "Enter a project name (min 6 characters)"),
  description: z.string().min(10, "Add a short description (min 10 characters)"),
  communityId: z.coerce.number().int().min(1, "Select a community"),
  unitId: z.coerce.number().int().optional(),
  budgetGhs: z.coerce.number().min(0, "Budget cannot be negative").default(0),
})
export type ProjectInput = z.infer<typeof projectSchema>

/** A recorded expenditure against a project. */
export const expenditureSchema = z.object({
  projectId: z.string().min(1),
  amountGhs: z.coerce.number().positive("Enter an amount greater than 0"),
  payee: z.string().min(2, "Enter the payee"),
  purpose: z.string().min(3, "Enter the purpose"),
})
export type ExpenditureInput = z.infer<typeof expenditureSchema>

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
})

export type LoginInput = z.infer<typeof loginSchema>
