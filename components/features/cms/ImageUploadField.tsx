"use client"

import { useState } from "react"

type Props = {
  name: string
  label: string
  currentUrl?: string | null
  hint?: string
}

/** File input with a live preview. The file is uploaded server-side from the
 * form's FormData; this component is purely presentational. */
export default function ImageUploadField({ name, label, currentUrl, hint }: Props) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null)

  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-ink/75">
        {label}
      </label>
      <div className="mt-2 flex items-center gap-4">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Preview"
            className="h-16 w-16 rounded-lg border border-canopy/10 object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-canopy/20 text-[10px] text-ink/40">
            No image
          </div>
        )}
        <input
          id={name}
          name={name}
          type="file"
          accept="image/*"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) setPreview(URL.createObjectURL(f))
          }}
          className="block w-full text-sm text-ink/65 file:mr-3 file:rounded-full file:border-0 file:bg-canopy file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-canopy-600"
        />
      </div>
      {hint && <p className="mt-1 text-xs text-ink/45">{hint}</p>}
    </div>
  )
}
