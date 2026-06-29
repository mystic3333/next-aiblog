import Link from "next/link"
import { formatDate } from "@/lib/utils"
import type { PostMeta } from "@/lib/posts"

export default function BlogCard({ post }: { post: PostMeta }) {
  return (
    <article
      className="group rounded-xl border p-6 transition-all hover:opacity-80"
      style={{ borderColor: "var(--border)", background: "var(--card)" }}
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="flex items-center gap-2">
          {post.featured && (
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
              置顶
            </span>
          )}
          {post.seriesName && (
            <Link
              href={`/blog/series/${post.seriesSlug}`}
              className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400 transition-all hover:opacity-70"
              onClick={(e) => e.stopPropagation()}
            >
              {post.seriesName}
            </Link>
          )}
          <time className="text-sm" style={{ color: "var(--muted)" }}>
            {formatDate(post.date)}
          </time>
        </div>
        <h2 className="mt-2 text-xl font-semibold">{post.title}</h2>
        <p className="mt-2 line-clamp-2 text-sm" style={{ color: "var(--muted)" }}>
          {post.description}
        </p>
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full px-2.5 py-0.5 text-xs"
                style={{
                  background: "var(--border)",
                  color: "var(--muted)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  )
}
