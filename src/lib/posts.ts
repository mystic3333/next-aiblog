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
}

export interface Post extends PostMeta {
  content: string
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

function readPostMeta(fullPath: string): PostMeta {
  const source = fs.readFileSync(fullPath, "utf-8")
  const { data } = matter(source)
  const slug = path.basename(fullPath).replace(/\.(mdx|md)$/, "")
  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    featured: data.featured || false,
  }
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

  return {
    slug,
    title: data.title || slug,
    description: data.description || "",
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    featured: data.featured || false,
    content,
  }
}
