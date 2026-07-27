"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Input from "./Input"

type Props = Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string
  error?: string
  hint?: React.ReactNode
}

/**
 * Password field with a show/hide toggle.
 *
 * Revealing a password is a deliberate, per-field action: the toggle always
 * starts hidden and resets to hidden on every mount, so a value is never
 * exposed on a fresh page load. The button is `type="button"` so it can never
 * submit the form, and it stays in the tab order with `aria-pressed` so
 * keyboard and screen-reader users get the same control as everyone else.
 */
export default function PasswordInput({ label, error, hint, ...props }: Props) {
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <Input
      {...props}
      type={visible ? "text" : "password"}
      label={label}
      error={error}
      hint={hint}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-pressed={visible}
          aria-label={visible ? "Hide password" : "Show password"}
          title={visible ? "Hide password" : "Show password"}
          className="flex h-8 w-8 items-center justify-center rounded-md text-ink/45 transition-colors hover:bg-canopy/5 hover:text-canopy focus:outline-none focus-visible:ring-1 focus-visible:ring-canopy dark:text-paper/45 dark:hover:bg-white/10 dark:hover:text-paper"
        >
          <Icon size={16} aria-hidden />
        </button>
      }
    />
  )
}
