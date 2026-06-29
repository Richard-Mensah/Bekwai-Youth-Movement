import Link from "next/link"
import Image from "next/image"
import { ArrowUpRight } from "lucide-react"
import SectionHeading from "@/components/ui/SectionHeading"
import Reveal from "@/components/ui/Reveal"
import Badge from "@/components/ui/Badge"
import { getPublishedPosts } from "@/lib/data/content"

function formatDate(iso: string | null) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" })
}

/** "BYM on the global stage" — latest published posts from the CMS. */
export default async function NewsHighlights() {
  const posts = await getPublishedPosts(4)
  if (posts.length === 0) return null

  return (
    <section className="section bg-paper dark:bg-canopy-900">
      <div className="container-content">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading
            eyebrow="On the global stage"
            title="Youth from Sefwi Bekwai, engaging the world"
            description="Stories, summits, and milestones from the movement, published straight from our newsroom."
          />
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-canopy hover:text-canopy-600 dark:text-paper dark:hover:text-gold-200"
          >
            All news & press
            <ArrowUpRight size={16} />
          </Link>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 4) * 0.06}>
              <Link
                href={`/news/${post.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-canopy/10 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover dark:border-white/10 dark:bg-canopy-800"
              >
                {post.coverUrl && (
                  <div className="relative aspect-[16/10] overflow-hidden">
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
                  <h3 className="mt-3 font-display text-base font-semibold leading-snug text-canopy">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-ink/60 dark:text-paper/60">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-ink/45 dark:text-paper/45">{formatDate(post.publishedAt)}</span>
                    {post.tags[0] && <Badge tone="canopy">{post.tags[0]}</Badge>}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
