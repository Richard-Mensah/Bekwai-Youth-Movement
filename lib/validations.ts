import { z } from "zod"

/**
 * Shortest password we accept, in one place.
 *
 * **Keep this equal to "Minimum password length" in Supabase** (Authentication
 * → Sign In / Providers → Email). Supabase is the real enforcement, server-side;
 * this number is what the member is told. If this one is the smaller of the two,
 * the form accepts a password and Supabase then rejects it with a raw error the
 * member can do nothing about — so if the two ever drift, drift this one higher.
 *
 * Length is doing the work here, not symbols: a passphrase like
 * "sefwi bekwai palm" resists guessing far better than "P@ss1!" and is easier to
 * type on a phone. Refusing passwords found in real breaches is a separate,
 * stronger control — the "leaked passwords" toggle on that same Supabase page.
 */
export const PASSWORD_MIN = 10

const passwordField = z
  .string()
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)

/**
 * An email address as a phone keyboard actually produces one.
 *
 * Android capitalises the first letter and autofill pastes a trailing space, so
 * a mass enrolment drive delivers " Kofi@Gmail.com " many times over. Untrimmed,
 * `.email()` refuses it and the applicant is told their own address is invalid —
 * with no visible reason, because the space does not render. Lower-casing
 * matters for a second reason: Supabase treats the address as the account key,
 * and someone who registers as `Kofi@` then signs in as `kofi@` must land on the
 * same account.
 *
 * The checks run in order, so `.email()` validates the already-normalised value
 * and the parsed output is the normalised string — meaning callers get the
 * cleaned address without having to remember to clean it.
 */
const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email")

/** Membership registration form (public "Join BYM"). */
export const registerSchema = z
  .object({
    fullName: z.string().trim().min(3, "Enter your full name"),
    email: emailField,
    password: passwordField,
    confirmPassword: z.string().min(1, "Re-enter your password to confirm"),
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
  // Reported against the confirm field so the error lands under the box the
  // applicant needs to retype, not under the one they got right.
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

export type RegisterInput = z.infer<typeof registerSchema>

/** Choosing a new password — from the reset link, or from account settings. */
export const newPasswordSchema = z
  .object({
    password: passwordField,
    confirmPassword: z.string().min(1, "Re-enter your password to confirm"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

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

/** A nomination entering the vetting pipeline. */
export const nominationSchema = z.object({
  fullName: z.string().min(3, "Enter the nominee's full name"),
  communityId: z.coerce.number().int().min(1, "Select a community"),
  seatType: z.enum(["mp", "council_rep", "cin_officer"], {
    message: "Select the seat",
  }),
  nominatedBy: z.string().optional(),
})
export type NominationInput = z.infer<typeof nominationSchema>

export const loginSchema = z.object({
  // Normalised exactly as at registration, so the address someone types on a
  // phone reaches the same account they created on a laptop.
  email: emailField,
  password: z.string().min(1, "Enter your password"),
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * A completed leadership application, validated at submit time.
 * Drafts are deliberately not validated — the wizard autosaves partial work,
 * and only `submitDraft` requires the whole shape to hold together.
 */
export const applicationSchema = z.object({
  fullName: z.string().trim().min(3, "Enter your full name"),
  email: z.string().trim().email("Enter a valid email"),
  roleApplied: z.string().trim().min(1, "Choose the office you are applying for"),
  motivation: z
    .string()
    .trim()
    .min(20, "Tell us in a sentence or two why you want to serve"),
  age: z.coerce
    .number()
    .int()
    .min(10, "Enter a valid age")
    .max(120, "Enter a valid age")
    .nullable()
    .optional(),
  consent: z.literal(true, {
    message: "Please confirm the declaration to submit your application",
  }),
})

export type ApplicationInput = z.infer<typeof applicationSchema>
