"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Input from "@/components/ui/Input"
import Button from "@/components/ui/Button"
import { updateSettings } from "./actions"
import type { SiteSettings } from "@/lib/data/content"

export default function SettingsForm({ settings }: { settings: SiteSettings }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    start(async () => {
      const res = await updateSettings(fd)
      setMsg(
        res.ok
          ? { ok: true, text: "Settings saved." }
          : { ok: false, text: res.error ?? "Failed to save." }
      )
      if (res.ok) router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      <section className="space-y-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card">
        <h3 className="font-display text-base font-semibold text-canopy">Homepage hero</h3>
        <Input name="heroEyebrow" label="Eyebrow (small label)" defaultValue={settings.heroEyebrow} />
        <div>
          <label htmlFor="heroTitle" className="block text-sm font-medium text-ink/75">
            Headline
          </label>
          <textarea
            id="heroTitle"
            name="heroTitle"
            rows={2}
            defaultValue={settings.heroTitle}
            className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
          />
        </div>
        <div>
          <label htmlFor="heroSubtitle" className="block text-sm font-medium text-ink/75">
            Sub-headline
          </label>
          <textarea
            id="heroSubtitle"
            name="heroSubtitle"
            rows={3}
            defaultValue={settings.heroSubtitle}
            className="mt-1 block w-full rounded-lg border border-canopy/20 px-3 py-2.5 text-sm shadow-sm focus:border-canopy focus:outline-none focus:ring-1 focus:ring-canopy"
          />
        </div>
        <Input
          name="foundingDate"
          label="Founding Day (YYYY-MM-DD)"
          defaultValue={settings.foundingDate}
        />
      </section>

      <section className="space-y-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card">
        <h3 className="font-display text-base font-semibold text-canopy">Impact stats</h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Input name="statCommunities" label="Communities" type="number" defaultValue={String(settings.stats.communities)} />
          <Input name="statCabinet" label="Cabinet" type="number" defaultValue={String(settings.stats.cabinet)} />
          <Input name="statReps" label="Reps / community" type="number" defaultValue={String(settings.stats.reps)} />
          <Input name="statSdgs" label="SDGs" type="number" defaultValue={String(settings.stats.sdgs)} />
          <Input name="statWomen" label="Women %" type="number" defaultValue={String(settings.stats.women)} />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card">
        <h3 className="font-display text-base font-semibold text-canopy">Organisation</h3>
        <Input name="email" label="Contact email" defaultValue={settings.email} />
        <Input name="medium" label="Medium URL" defaultValue={settings.medium} />
      </section>

      {msg && (
        <p className={msg.ok ? "text-sm text-brand-green" : "text-sm text-brand-red"}>
          {msg.text}
        </p>
      )}
      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save settings"}
      </Button>
    </form>
  )
}
