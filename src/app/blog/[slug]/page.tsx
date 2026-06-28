import { notFound } from "next/navigation"
import { getPostBySlug } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import MDXContent from "@/components/MDXContent"
import CommentSection from "@/components/CommentSection"
import ViewCounter from "@/components/ViewCounter"
import type { Metadata } from "next"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  return {
    title: post.title,
    description: post.description,
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <header>
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="mt-4 flex items-center gap-4 text-sm" style={{ color: "var(--muted)" }}>
          <time>{formatDate(post.date)}</time>
          <ViewCounter slug={slug} />
          {post.tags.length > 0 && (
            <div className="flex gap-2">
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
        </div>
      </header>

      <div className="mt-12">
        <MDXContent source={post.content} />
      </div>

      <CommentSection postSlug={slug} />
    </article>
  )
}
