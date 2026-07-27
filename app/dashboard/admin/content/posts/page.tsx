import Link from "next/link"
import { Plus } from "lucide-react"
import { getAllPosts } from "@/lib/data/content"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import Button from "@/components/ui/Button"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import PostRowActions from "./PostRowActions"
import { formatDate } from "@/lib/utils"

export const metadata = { title: "Posts & Blog" }

export default async function PostsListPage() {
  const posts = await getAllPosts()

  return (
    <>
      <DashboardHeading
        backHref="/dashboard/admin/content"
        backLabel="Content Studio"
        title="Posts & Blog"
        subtitle="Write, edit and publish articles"
        actions={
          <Button href="/dashboard/admin/content/posts/new">
            <Plus size={16} /> New post
          </Button>
        }
      />

      {posts.length === 0 ? (
        <Card>
          <p className="text-sm text-ink/55">
            No posts yet. Click <strong>New post</strong> to write your first
            article, or import current content from the Content Studio.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {posts.map((p) => (
            <Card key={p.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-canopy">{p.title}</h3>
                    <Badge tone={p.status === "published" ? "green" : "amber"}>
                      {p.status}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-ink/50">
                    /news/{p.slug}
                    {p.publishedAt ? ` · ${formatDate(p.publishedAt)}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={`/news/${p.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-canopy hover:underline"
                  >
                    {p.status === "published" ? "View" : "Preview"}
                  </a>
                  <Link
                    href={`/dashboard/admin/content/posts/${p.id}/edit`}
                    className="text-xs font-semibold text-canopy hover:underline"
                  >
                    Edit
                  </Link>
                  <PostRowActions id={p.id} published={p.status === "published"} />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}
