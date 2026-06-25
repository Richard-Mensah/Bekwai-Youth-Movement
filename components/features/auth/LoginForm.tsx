"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { loginSchema } from "@/lib/validations"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import AuthNotice from "./AuthNotice"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

export default function LoginForm() {
  const router = useRouter()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError("")
    const form = new FormData(e.currentTarget)
    const parsed = loginSchema.safeParse(Object.fromEntries(form.entries()))

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        fieldErrors[issue.path[0] as string] = issue.message
      }
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword(parsed.data)
    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }
    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-brand-green-700">Sign in</h1>
      <p className="mt-1 text-sm text-gray-500">
        Access your BYM dashboard.
      </p>

      {!SUPABASE_READY && <div className="mt-4"><AuthNotice /></div>}
      {serverError && (
        <p className="mt-4 rounded-lg bg-brand-red-50 p-3 text-sm text-brand-red-700">
          {serverError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input name="email" type="email" label="Email" error={errors.email} />
        <Input name="password" type="password" label="Password" error={errors.password} />
        <Button type="submit" disabled={!SUPABASE_READY || loading} className="w-full">
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-gray-500">
        Not a member yet?{" "}
        <Link href="/join" className="font-medium text-brand-green hover:underline">
          Join BYM
        </Link>
      </p>
    </div>
  )
}
