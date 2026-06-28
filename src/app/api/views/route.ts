import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data } = await supabase
    .from("views")
    .select("count")
    .eq("slug", slug)
    .single()

  return NextResponse.json({ count: data?.count ?? 0 })
}

export async function POST(request: Request) {
  const { slug } = await request.json()

  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 })
  }

  const supabase = createAdminClient()
  await supabase.rpc("increment_view", { slug_text: slug })

  const { data } = await supabase
    .from("views")
    .select("count")
    .eq("slug", slug)
    .single()

  return NextResponse.json({ count: data?.count ?? 1 })
}
