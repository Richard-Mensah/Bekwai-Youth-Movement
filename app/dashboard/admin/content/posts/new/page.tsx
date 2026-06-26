import Link from "next/link"
import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import PostForm from "../PostForm"

export const metadata = { title: "New post" }

export default function NewPostPage() {
  return (
    <>
      <Link
        href="/dashboard/admin/content/posts"
        className="mb-3 inline-block text-sm text-brand-green hover:underline"
      >
        ← Posts
      </Link>
      <DashboardHeading title="New post" subtitle="Write a new article" />
      <PostForm />
    </>
  )
}
