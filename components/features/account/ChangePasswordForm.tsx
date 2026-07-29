"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import { newPasswordSchema, PASSWORD_MIN } from "@/lib/validations"
import PasswordInput from "@/components/ui/PasswordInput"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

export default function ChangePasswordForm() {
  const [pending, startTransition] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const parsed = newPasswordSchema.safeParse(
      Object.fromEntries(new FormData(form).entries())
    )

    if (!parsed.success) {
      setMsg({ ok: false, text: parsed.error.issues[0].message })
      return
    }
    const { password } = parsed.data
    if (!SUPABASE_READY) {
      setMsg({ ok: false, text: "Connect Supabase to change your password." })
      return
    }

    startTransition(async () => {
      const { error } = await createClient().auth.updateUser({ password })
      if (error) {
        setMsg({ ok: false, text: error.message })
      } else {
        setMsg({ ok: true, text: "Password updated. Use it next time you sign in." })
        form.reset()
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {msg && (
        <p
          className={
            msg.ok
              ? "rounded-lg bg-brand-green-50 p-3 text-sm text-brand-green-700"
              : "rounded-lg bg-brand-red-50 p-3 text-sm text-brand-red-700"
          }
        >
          {msg.text}
        </p>
      )}
      <PasswordInput
        name="password"
        label="New password"
        autoComplete="new-password"
        hint={`At least ${PASSWORD_MIN} characters.`}
      />
      <PasswordInput
        name="confirmPassword"
        label="Confirm new password"
        autoComplete="new-password"
      />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  )
}
