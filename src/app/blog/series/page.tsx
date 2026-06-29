import Link from "next/link"
import { getAllSeries } from "@/lib/posts"

export const metadata = {
  title: "专栏",
}

export default function SeriesPage() {
  const series = getAllSeries()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-bold tracking-tight">专栏</h1>
      <p className="mt-2" style={{ color: "var(--muted)" }}>
        按系列浏览所有文章
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {series.map((s) => (
          <Link
            key={s.slug}
            href={`/blog/series/${s.slug}`}
            className="rounded-xl border p-6 transition-all hover:opacity-80"
            style={{ borderColor: "var(--border)", background: "var(--card)" }}
          >
            <h2 className="text-xl font-semibold">{s.name}</h2>
            <p className="mt-2 text-sm line-clamp-2" style={{ color: "var(--muted)" }}>
              {s.description}
            </p>
            <span className="mt-4 block text-xs" style={{ color: "var(--muted)" }}>
              {s.postCount} 篇文章
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
