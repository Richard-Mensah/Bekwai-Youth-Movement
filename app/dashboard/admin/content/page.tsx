import Link from "next/link"
import {
  FileText,
  Users,
  ImageIcon,
  CalendarDays,
  Handshake,
  Settings,
  MapPin,
  FolderOpen,
  History,
} from "lucide-react"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import StatCard from "@/components/ui/StatCard"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import ImportButton from "@/components/features/cms/ImportButton"
import { getContentCounts } from "@/lib/data/content"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import { emailEnabled } from "@/lib/email"

export const metadata = { title: "Content Studio" }

const MODULES: [string, string, string, typeof FileText][] = [
  ["Posts & Blog", "Write and publish news/blog articles.", "/dashboard/admin/content/posts", FileText],
  ["Leadership & Team", "Manage people, photos, and tiers.", "/dashboard/admin/content/leaders", Users],
  ["Gallery", "Upload, caption, and order photos.", "/dashboard/admin/content/gallery", ImageIcon],
  ["Events", "Durbars, sittings, and the launch.", "/dashboard/admin/content/events", CalendarDays],
  ["Partners & Sponsors", "Logos and partner links.", "/dashboard/admin/content/partners", Handshake],
  ["Communities", "Edit the 32 community names.", "/dashboard/admin/content/communities", MapPin],
  ["Site settings", "Hero text, stats, and org details.", "/dashboard/admin/content/settings", Settings],
  ["Media library", "Upload and reuse images.", "/dashboard/admin/content/media", FolderOpen],
  ["Activity log", "Who changed what, and when.", "/dashboard/admin/content/audit", History],
]

export default async function ContentStudioPage() {
  const counts = await getContentCounts()
  const configured = isSupabaseConfigured()
  const total =
    counts.posts + counts.leaders + counts.gallery + counts.events + counts.partners

  return (
    <>
      <DashboardHeading
        title="Content Studio"
        subtitle="Manage everything that appears on the public site — no code required"
      />

      {/* Setup status */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge tone={configured ? "green" : "amber"}>
          {configured ? "Supabase connected" : "Supabase not configured"}
        </Badge>
        <Badge tone={emailEnabled() ? "green" : "gray"}>
          {emailEnabled() ? "Email (Resend) enabled" : "Email not configured"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Posts" value={counts.posts} />
        <StatCard label="Leaders" value={counts.leaders} accent="gold" />
        <StatCard label="Gallery" value={counts.gallery} accent="blue" />
        <StatCard label="Events" value={counts.events} />
        <StatCard label="Partners" value={counts.partners} accent="red" />
      </div>

      {/* First-run import */}
      {configured && total === 0 && (
        <Card className="mt-6" accent="gold">
          <h3 className="font-display text-base font-semibold text-canopy">
            Start with your current content
          </h3>
          <p className="mt-1 text-sm text-ink/65">
            Import the site&apos;s existing posts, leadership, gallery, and settings
            into the CMS so you can edit them. Safe to run once.
          </p>
          <div className="mt-4">
            <ImportButton />
          </div>
        </Card>
      )}

      {/* Module grid */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map(([title, desc, href, Icon]) => (
          <Link
            key={href}
            href={href}
            className="group flex items-start gap-4 rounded-2xl border border-canopy/10 bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-canopy-50 text-canopy">
              <Icon size={20} />
            </span>
            <div>
              <h3 className="font-display text-base font-semibold text-canopy">
                {title}
              </h3>
              <p className="mt-1 text-sm text-ink/60">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
