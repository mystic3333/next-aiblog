import { getAllPosts } from "@/lib/posts"
import BlogCard from "@/components/BlogCard"
import Pagination from "@/components/Pagination"

export const metadata = {
  title: "Blog",
}

const POSTS_PER_PAGE = 6

export default async function BlogPage(props: {
  searchParams?: Promise<{ page?: string }>
}) {
  const searchParams = await props.searchParams
  const currentPage = Math.max(1, Number(searchParams?.page) || 1)
  const allPosts = getAllPosts()
  const totalPages = Math.max(1, Math.ceil(allPosts.length / POSTS_PER_PAGE))
  const posts = allPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="flex items-baseline gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Blog</h1>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          共 {allPosts.length} 篇
        </span>
      </div>
      <p className="mt-2" style={{ color: "var(--muted)" }}>
        Thoughts on code, design, and beyond.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {posts.length > 0 ? (
          posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))
        ) : (
          <p className="col-span-2 text-sm" style={{ color: "var(--muted)" }}>
            No posts yet. Check back soon!
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      )}
    </div>
  )
}
