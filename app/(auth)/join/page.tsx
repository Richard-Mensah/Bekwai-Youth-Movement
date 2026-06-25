import type { Metadata } from "next"
import SignupForm from "@/components/features/auth/SignupForm"

export const metadata: Metadata = {
  title: "Join BYM",
  description: "Register as a member of the Bekwai Youth Movement.",
}

export default function JoinPage() {
  return <SignupForm />
}
