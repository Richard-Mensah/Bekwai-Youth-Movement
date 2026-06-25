"use client"

import { useState, useTransition } from "react"
import { createClient } from "@/lib/supabase/client"
import Input from "@/components/ui/Input"
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
    const data = new FormData(form)
    const password = String(data.get("password") ?? "")
    const confirm = String(data.get("confirm") ?? "")

    if (password.length < 8) {
      setMsg({ ok: false, text: "Password must be at least 8 characters." })
      return
    }
    if (password !== confirm) {
      setMsg({ ok: false, text: "Passwords do not match." })
      return
    }
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
      <Input name="password" type="password" label="New password" autoComplete="new-password" />
      <Input name="confirm" type="password" label="Confirm new password" autoComplete="new-password" />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Updating…" : "Update password"}
      </Button>
    </form>
  )
}
