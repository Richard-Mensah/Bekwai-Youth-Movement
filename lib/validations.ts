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

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
})

export type LoginInput = z.infer<typeof loginSchema>
