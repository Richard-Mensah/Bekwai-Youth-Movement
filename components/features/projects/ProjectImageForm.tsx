"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import ImageUploadField from "@/components/features/cms/ImageUploadField"
import Button from "@/components/ui/Button"
import { updateProjectImage } from "@/app/dashboard/cabinet/actions"

export default function ProjectImageForm({
  projectId,
  currentUrl,
}: {
  projectId: string
  currentUrl?: string | null
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMsg(null)
    const form = e.currentTarget
    const fd = new FormData(form)
    fd.set("projectId", projectId)
    start(async () => {
      const res = await updateProjectImage(fd)
      setMsg(
        res.ok
          ? { ok: true, text: "Cover image updated." }
          : { ok: false, text: res.error ?? "Failed to update." }
      )
      if (res.ok) {
        form.reset()
        router.refresh()
      }
    })
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <ImageUploadField name="cover" label="Cover image" currentUrl={currentUrl} />
      {msg && (
        <p className={msg.ok ? "text-xs text-brand-green" : "text-xs text-brand-red"}>
          {msg.text}
        </p>
      )}
      <Button type="submit" size="sm" disabled={pending}>
        {pending ? "Uploading…" : "Save image"}
      </Button>
    </form>
  )
}
