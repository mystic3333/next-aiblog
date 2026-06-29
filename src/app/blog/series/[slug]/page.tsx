import { notFound } from "next/navigation"
import Link from "next/link"
import { getAllSeries, getPostsBySeries } from "@/lib/posts"
import BlogCard from "@/components/BlogCard"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSeries().map((s) => ({ slug: s.slug }))
}

export default async function SeriesPostPage({ params }: Props) {
  const { slug } = await params
  const series = getAllSeries().find((s) => s.slug === slug)
  if (!series) notFound()

  const posts = getPostsBySeries(slug)

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Link
        href="/blog/series"
        className="text-sm transition-all hover:opacity-70"
        style={{ color: "var(--muted)" }}
      >
        ← 所有专栏
      </Link>

      <div className="mt-4 flex items-baseline gap-4">
        <h1 className="text-4xl font-bold tracking-tight">{series.name}</h1>
        <span className="text-sm" style={{ color: "var(--muted)" }}>
          共 {series.postCount} 篇
        </span>
      </div>
      <p className="mt-2" style={{ color: "var(--muted)" }}>
        {series.description}
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {posts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  )
}
