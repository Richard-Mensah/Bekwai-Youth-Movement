import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { getPostBySlug } from "@/lib/data/content"
import Badge from "@/components/ui/Badge"
import Markdown from "@/components/features/public/Markdown"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: "Post not found" }
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    openGraph: post.coverUrl ? { images: [post.coverUrl] } : undefined,
  }
}

function formatDate(iso: string | null) {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  return (
    <article className="section">
      <div className="container-content max-w-3xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-canopy hover:underline"
        >
          <ArrowLeft size={16} /> All news
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {post.tags.map((t) => (
            <Badge key={t} tone="gold">
              {t}
            </Badge>
          ))}
          {post.publishedAt && (
            <span className="text-xs text-ink/45">{formatDate(post.publishedAt)}</span>
          )}
        </div>

        <h1 className="mt-3 font-display text-3xl font-semibold text-canopy text-balance sm:text-4xl">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="mt-4 text-lg leading-relaxed text-ink/70">{post.excerpt}</p>
        )}

        {post.coverUrl && (
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl">
            <Image src={post.coverUrl} alt={post.title} fill className="object-cover" />
          </div>
        )}

        {post.body && (
          <div className="mt-8">
            <Markdown>{post.body}</Markdown>
          </div>
        )}

        {post.externalUrl && (
          <a
            href={post.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-canopy px-5 py-3 text-sm font-semibold text-white hover:bg-canopy-600"
          >
            Read the full story <ArrowUpRight size={16} />
          </a>
        )}
      </div>
    </article>
  )
}
