import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import PageHeader from "@/components/layout/PageHeader"
import Badge from "@/components/ui/Badge"
import { getPublishedPosts } from "@/lib/data/content"
import { ORG } from "@/constants/nav"

export const metadata: Metadata = {
  title: "News & Press",
  description:
    "Bekwai Youth Movement on the local and global stage — summits, partnerships, and stories from our communities.",
}

function formatDate(iso: string | null) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function NewsPage() {
  const posts = await getPublishedPosts()

  return (
    <>
      <PageHeader
        eyebrow="Media"
        title="News & press"
        description="From grassroots Sefwi Bekwai to international summits — a record of where the movement has shown up and what we've learned."
      />

      <section className="section">
        <div className="container-content grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
            >
              {post.coverUrl && (
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={post.coverUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                    {post.tags[0] ?? "News"}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-ink/30 transition-colors group-hover:text-canopy"
                  />
                </div>
                <h2 className="mt-3 font-display text-xl font-semibold leading-snug text-canopy">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/65">
                    {post.excerpt}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-ink/45">{formatDate(post.publishedAt)}</span>
                  {post.tags[0] && <Badge tone="canopy">{post.tags[0]}</Badge>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="container-content mt-12 text-center">
          <a
            href={ORG.medium}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy hover:text-canopy-600"
          >
            Read more on our Medium publication
            <ArrowUpRight size={16} />
          </a>
        </div>
      </section>
    </>
  )
}
