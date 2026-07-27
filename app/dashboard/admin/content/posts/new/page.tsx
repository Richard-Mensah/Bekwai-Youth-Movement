import DashboardHeading from "@/components/features/dashboard/DashboardHeading"
import PostForm from "../PostForm"

export const metadata = { title: "New post" }

export default function NewPostPage() {
  return (
    <>
<DashboardHeading
        backHref="/dashboard/admin/content/posts"
        backLabel="Posts" title="New post" subtitle="Write a new article" />
      <PostForm />
    </>
  )
}
