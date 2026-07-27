"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2, Paperclip, Upload, X } from "lucide-react"
import {
  DOC_EXTENSIONS,
  DOC_KINDS,
  DOC_MAX_BYTES,
  docKindLabel,
} from "@/constants/applications"
import type { ApplicationDocument } from "@/lib/data/applications"
import { removeDocument, uploadDocument } from "@/app/dashboard/apply/actions"
import { cn } from "@/lib/utils"

type Props = {
  applicationId: string
  documents: ApplicationDocument[]
}

function humanSize(bytes: number | null) {
  if (!bytes) return null
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function DocumentUploader({ applicationId, documents }: Props) {
  const [kind, setKind] = useState<string>("cv")
  const [dragging, setDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  function send(file: File) {
    setError(null)
    if (file.size > DOC_MAX_BYTES) {
      setError("That file is larger than 5 MB. Please choose a smaller one.")
      return
    }
    const ext = (file.name.split(".").pop() || "").toLowerCase()
    if (!DOC_EXTENSIONS.includes(ext)) {
      setError("Please upload a PDF, Word document or image.")
      return
    }

    const data = new FormData()
    data.set("applicationId", applicationId)
    data.set("kind", kind)
    data.set("file", file)

    startTransition(async () => {
      const res = await uploadDocument(data)
      if (!res.ok) setError(res.error)
      else router.refresh()
      if (inputRef.current) inputRef.current.value = ""
    })
  }

  function drop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) send(file)
  }

  function remove(id: string) {
    setError(null)
    setBusyId(id)
    startTransition(async () => {
      const res = await removeDocument(id)
      if (!res.ok) setError(res.error)
      else router.refresh()
      setBusyId(null)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="doc-kind"
          className="block text-sm font-medium text-ink/75 dark:text-paper/75"
        >
          What are you attaching?
        </label>
        <select
          id="doc-kind"
          value={kind}
          onChange={(e) => setKind(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-canopy/20 bg-white px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy dark:border-white/10 dark:bg-canopy-700 dark:text-paper sm:max-w-xs"
        >
          {DOC_KINDS.map((k) => (
            <option key={k.value} value={k.value}>
              {k.label}
            </option>
          ))}
        </select>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={DOC_EXTENSIONS.map((e) => `.${e}`).join(",")}
        className="sr-only"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) send(file)
        }}
      />

      <button
        type="button"
        disabled={pending}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={drop}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-9 text-center transition-colors disabled:opacity-60",
          dragging
            ? "border-gold-400 bg-gold-50 dark:bg-gold-400/10"
            : "border-canopy/25 bg-paper/60 hover:border-canopy/50 hover:bg-canopy-50/40 dark:border-white/15 dark:bg-white/5 dark:hover:border-white/30"
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-canopy-50 text-canopy dark:bg-white/10 dark:text-gold-200">
          {pending ? (
            <Loader2 size={20} className="animate-spin" />
          ) : (
            <Upload size={20} />
          )}
        </span>
        <span className="text-sm font-semibold text-canopy dark:text-paper">
          {pending ? "Uploading…" : "Drop a file here, or click to choose"}
        </span>
        <span className="text-xs text-ink/50 dark:text-paper/50">
          PDF, Word or image · up to 5 MB · all optional
        </span>
      </button>

      {error && (
        <p className="rounded-lg bg-brand-red/10 px-4 py-3 text-sm text-brand-red">
          {error}
        </p>
      )}

      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-canopy/15 bg-white px-4 py-3 dark:border-white/10 dark:bg-canopy-700/50"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <FileText size={16} className="shrink-0 text-canopy dark:text-gold-200" />
                <span className="min-w-0">
                  <span className="block truncate text-sm text-ink/80 dark:text-paper/80">
                    {d.filename}
                  </span>
                  <span className="block text-[11px] text-ink/45 dark:text-paper/45">
                    {docKindLabel(d.kind)}
                    {humanSize(d.sizeBytes) ? ` · ${humanSize(d.sizeBytes)}` : ""}
                  </span>
                </span>
              </span>
              <button
                type="button"
                disabled={busyId === d.id}
                onClick={() => remove(d.id)}
                className="inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-brand-red transition-colors hover:bg-brand-red/10 disabled:opacity-50"
              >
                {busyId === d.id ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <X size={13} />
                )}
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {documents.length === 0 && !pending && (
        <p className="flex items-center gap-2 text-xs text-ink/45 dark:text-paper/45">
          <Paperclip size={13} />
          Nothing attached yet — that is completely fine. A CV is not required.
        </p>
      )}
    </div>
  )
}
