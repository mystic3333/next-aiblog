import Link from "next/link"

interface Props {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: Props) {
  return (
    <nav className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`/blog?page=${currentPage - 1}`}
          className="rounded-lg border px-4 py-2 text-sm transition-all hover:opacity-70"
          style={{ borderColor: "var(--border)" }}
        >
          上一页
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={`/blog?page=${page}`}
          className="rounded-lg border px-3 py-2 text-sm transition-all hover:opacity-70"
          style={{
            borderColor: page === currentPage ? "var(--foreground)" : "var(--border)",
            background: page === currentPage ? "var(--foreground)" : "transparent",
            color: page === currentPage ? "var(--background)" : "var(--foreground)",
          }}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className="rounded-lg border px-4 py-2 text-sm transition-all hover:opacity-70"
          style={{ borderColor: "var(--border)" }}
        >
          下一页
        </Link>
      )}
    </nav>
  )
}
