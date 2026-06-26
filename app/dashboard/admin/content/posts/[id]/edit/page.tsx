import Link from "next/link"
import { notFound } from "next/navigation"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import PostForm from "../../PostForm"
import { getPostById } from "@/lib/data/content"

export const metadata = { title: "Edit post" }

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const post = await getPostById(id)
  if (!post) notFound()

  return (
    <>
      <Link
        href="/dashboard/admin/content/posts"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Posts
      </Link>
      <DashboardHeading title="Edit post" subtitle={post.title} />
      <PostForm post={post} />
    </>
  )
}
