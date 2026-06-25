"use client"

import { useState, useTransition } from "react"
import {
  advanceProjectStatus,
  setProjectStatus,
} from "@/app/dashboard/cabinet/actions"
import { nextProjectStatus, PROJECT_STATUS_META } from "@/constants/projects"
import type { ProjectStatus } from "@/types"
import Button from "@/components/ui/Button"

const SUPABASE_READY =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")

type Props = { projectId: string; status: ProjectStatus }

/** Approve/advance lifecycle + suspend or reactivate. */
export default function ProjectControls({ projectId, status }: Props) {
  const [pending, startTransition] = useTransition()
  const [note, setNote] = useState("")
  const next = nextProjectStatus(status)
  const suspended = status === "suspended"

  function guard(fn: () => Promise<{ ok: boolean; error?: string }>) {
    if (!SUPABASE_READY) {
      setNote("Connect Supabase to manage projects.")
      return
    }
    startTransition(async () => {
      const res = await fn()
      if (!res.ok) setNote(res.error ?? "Failed.")
    })
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {next && !suspended && (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => guard(() => advanceProjectStatus(projectId, status))}
          >
            Advance to {PROJECT_STATUS_META[next].label}
          </Button>
        )}
        {!suspended ? (
          <Button
            size="sm"
            variant="outline"
            disabled={pending}
            onClick={() => guard(() => setProjectStatus(projectId, "suspended"))}
          >
            Suspend
          </Button>
        ) : (
          <Button
            size="sm"
            disabled={pending}
            onClick={() => guard(() => setProjectStatus(projectId, "in_progress"))}
          >
            Reactivate
          </Button>
        )}
      </div>
      {note && <p className="text-xs text-gray-500">{note}</p>}
    </div>
  )
}
