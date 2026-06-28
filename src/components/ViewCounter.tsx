"use client"

import { useEffect, useState } from "react"

export default function ViewCounter({ slug }: { slug: string }) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const increment = async () => {
      const res = await fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      })
      if (res.ok) {
        const data = await res.json()
        setCount(data.count)
      }
    }
    increment()
  }, [slug])

  if (count === null) return null

  return (
    <span className="text-xs" style={{ color: "var(--muted)" }}>
      {count} {count === 1 ? "view" : "views"}
    </span>
  )
}
