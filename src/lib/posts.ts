import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/posts")

export interface PostMeta {
  slug: string
  title: string
  description: string
  date: string
  tags: string[]
  featured?: boolean
  seriesSlug?: string
  seriesName?: string
}

export interface Post extends PostMeta {
  content: string
}

export interface Series {
  slug: string
  name: string
  description: string
  postCount: number
}

function findPostFiles(dir: string): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const files: string[] = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findPostFiles(fullPath))
    } else if (entry.name.endsWith(".mdx") || entry.name.endsWith(".md")) {
      files.push(fullPath)
    }
  }
  return files
}

function getSeriesSlug(fullPath: string): string | undefined {
  const rel = path.relative(postsDirectory, path.dirname(fullPath))
  return rel && rel !== "." ? rel : undefined
}

function readSeriesMeta(dir: string): { name: string; description: string } {
  const metaPath = path.join(dir, "series.json")
  if (fs.existsSync(metaPath)) {
    try {
      const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"))
      return { name: meta.name || "", description: meta.description || "" }
    } catch {}
  }
  return { name: "", description: "" }
}

function guessSeriesName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")
}

function readPostMeta(fullPath: string): PostMeta {
  const source = fs.readFileSync(fullPath, "utf-8")
  const { data } = matter(source)
  const slug = path.basename(fullPath).replace(/\.(mdx|md)$/, "")
  const seriesSlug = getSeriesSlug(fullPath)

  const meta: PostMeta = {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    featured: data.featured || false,
  }

  if (seriesSlug) {
    meta.seriesSlug = seriesSlug
    const seriesDir = path.join(postsDirectory, seriesSlug)
    const seriesMeta = readSeriesMeta(seriesDir)
    meta.seriesName = seriesMeta.name || guessSeriesName(seriesSlug)
  }

  return meta
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return []

  const files = findPostFiles(postsDirectory)
  const posts = files
    .map(readPostMeta)
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return posts
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(postsDirectory)) return null

  const files = findPostFiles(postsDirectory)
  const match = files.find(
    (f) => path.basename(f).replace(/\.(mdx|md)$/, "") === slug
  )
  if (!match) return null

  const source = fs.readFileSync(match, "utf-8")
  const { data, content } = matter(source)
  const seriesSlug = getSeriesSlug(match)

  const post: Post = {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    featured: data.featured || false,
    content,
  }

  if (seriesSlug) {
    post.seriesSlug = seriesSlug
    const seriesDir = path.join(postsDirectory, seriesSlug)
    const seriesMeta = readSeriesMeta(seriesDir)
    post.seriesName = seriesMeta.name || guessSeriesName(seriesSlug)
  }

  return post
}

export function getAllSeries(): Series[] {
  if (!fs.existsSync(postsDirectory)) return []

  const entries = fs.readdirSync(postsDirectory, { withFileTypes: true })
  const allPosts = getAllPosts()

  return entries
    .filter((e) => e.isDirectory())
    .map((dir) => {
      const seriesPosts = allPosts.filter((p) => p.seriesSlug === dir.name)
      const meta = readSeriesMeta(path.join(postsDirectory, dir.name))
      return {
        slug: dir.name,
        name: meta.name || guessSeriesName(dir.name),
        description: meta.description || `${seriesPosts.length} 篇文章`,
        postCount: seriesPosts.length,
      }
    })
    .filter((s) => s.postCount > 0)
}

export function getPostsBySeries(seriesSlug: string): PostMeta[] {
  return getAllPosts().filter((p) => p.seriesSlug === seriesSlug)
}
