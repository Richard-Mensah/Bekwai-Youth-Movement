"use client"

import { useState, useTransition } from "react"
import { Download } from "lucide-react"
import Button from "@/components/ui/Button"
import { importStarterContent } from "@/app/dashboard/admin/content/actions"

export default function ImportButton() {
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<string | null>(null)

  return (
    <div>
      <Button
        variant="gold"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await importStarterContent()
            setMsg(
              r.ok
                ? r.error ?? "Imported the current site content into the CMS."
                : r.error ?? "Import failed."
            )
          })
        }
      >
        <Download size={16} /> {pending ? "Importing…" : "Import current site content"}
      </Button>
      {msg && <p className="mt-2 text-sm text-ink/65">{msg}</p>}
    </div>
  )
}
