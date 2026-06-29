# Mystic Blog

A personal blog built with **Next.js 16**, **Supabase**, **Three.js**, and **Tailwind CSS**.  

## Features

- **3D Interactive Background** — Particle field with Three.js + React Three Fiber
- **MDX Blog Posts** — Write content in Markdown with frontmatter metadata
- **专栏 Series** — Posts organized into series with dedicated overview pages
- **Pagination** — Blog listing with page navigation and total count
- **Supabase Auth** — GitHub OAuth login
- **Comment System** — Authenticated users can comment on posts
- **View Counter** — Track page views via Supabase
- **Dark Mode** — Toggle between light/dark themes, persisted to localStorage
- **AI Tools Navigation** — Curated directory of AI tools
- **SCL-90 Test** — Psychological self-assessment tool (90 questions, 10 dimensions)
- **Responsive Design** — Mobile-friendly layout
- **ISR** — On-demand revalidation for updated content

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Styling | Tailwind CSS 3 |
| Database & Auth | Supabase (PostgreSQL, Auth, Realtime) |
| 3D Graphics | Three.js + @react-three/fiber + @react-three/drei |
| Content | MDX with gray-matter + next-mdx-remote |
| Language | TypeScript |

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)
- A GitHub OAuth App

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Setup

Run `supabase/schema.sql` in Supabase Dashboard → SQL Editor to create:

- `comments` table — stores post comments with RLS
- `views` table — stores page view counts
- `increment_view` function — atomic view counter

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers) → New OAuth App
2. Set Authorization callback URL to `https://your-project.supabase.co/auth/v1/callback`
3. In Supabase Dashboard → Authentication → Providers → GitHub, enable and paste credentials
4. Add `http://localhost:3000/auth/callback` to Supabase → Authentication → URL Configuration → Redirect URLs

### Development

```bash
# Start dev server
npm run dev

# Clean cache and start (run when you get stale chunk errors)
npm run dev:clean
```

### Production Build

```bash
npm run build
npm run build:clean  # with cache cleaning
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with theme + auth providers
│   ├── page.tsx                # Homepage with Three.js background
│   ├── globals.css             # Global styles + dark mode variables
│   ├── error.tsx               # Error boundary
│   ├── not-found.tsx           # 404 page
│   ├── about/page.tsx          # About page
│   ├── blog/
│   │   ├── page.tsx            # Blog listing grid with pagination
│   │   ├── [slug]/page.tsx     # Blog post with MDX + comments
│   │   └── series/
│   │       ├── page.tsx        # Series overview (all columns)
│   │       └── [slug]/page.tsx # Single series page
│   ├── tools/page.tsx          # AI tools navigation
│   ├── scl-90/page.tsx         # SCL-90 psychological test
│   ├── auth/callback/route.ts  # GitHub OAuth callback
│   └── api/
│       ├── comments/route.ts   # Comment CRUD API
│       ├── views/route.ts      # View counter API
│       └── revalidate/route.ts # On-demand revalidation
├── components/
│   ├── ThreeBackground.tsx      # Three.js particle field
│   ├── ThreeBackgroundWrapper.tsx
│   ├── ThemeProvider.tsx        # Dark mode context
│   ├── SupabaseProvider.tsx     # Auth session context
│   ├── SessionWrapper.tsx       # Server-side session provider
│   ├── Header.tsx              # Nav + theme toggle + auth
│   ├── Footer.tsx
│   ├── BlogCard.tsx            # Post preview card
│   ├── ToolCard.tsx            # AI tool card
│   ├── MDXContent.tsx          # MDX renderer
│   ├── CommentSection.tsx      # Comments list + form
│   ├── ErrorBoundary.tsx       # Class-based error boundary
│   ├── Pagination.tsx          # Page navigation component
│   ├── SCL90Test.tsx           # SCL-90 test interactive form
│   └── ViewCounter.tsx         # View tracking (client)
├── lib/
│   ├── supabase/
│   │   ├── client.ts           # Browser Supabase client
│   │   ├── server.ts           # Server Supabase client
│   │   ├── admin.ts            # Service-role admin client
│   │   └── middleware.ts       # Session refresh proxy
│   ├── posts.ts                # MDX file reader
│   └── utils.ts                # formatDate, cn helper
├── types/index.ts              # TypeScript types
├── proxy.ts                    # Next.js 16 proxy (session refresh, not wired)
├── data/
│   ├── ai-tools.json           # AI tools data
│   └── scl-90.ts               # SCL-90 questions and dimensions
└── content/posts/              # MDX blog posts (supports subdirectories for series)
    ├── build-blog-from-scratch.mdx
    ├── career-switch/
    │   ├── series.json         # Series metadata (name, description)
    │   ├── career-switch-guide-01-*.mdx
    │   └── ...
    └── index-investing/
        ├── series.json
        ├── index-investing-guide-01.mdx
        └── ...
```

## Writing Posts

Create a `.mdx` file in `content/posts/`:

```mdx
---
title: "Your Post Title"
description: "A short summary"
date: "2026-06-28"
tags: ["nextjs", "react"]
---

Your content here with **Markdown** support.
```

### Creating a Series

To group posts into a series, create a subdirectory with a `series.json`:

```
content/posts/my-series/
├── series.json         # { "name": "...", "description": "..." }
├── post-01.mdx
└── post-02.mdx
```

The series page is auto-generated at `/blog/series/my-series`. Each post card shows its series badge linking to the series page.

### Current Series

| Series | Directory | Posts |
|--------|-----------|-------|
| 普通人指数投资指南 | `index-investing/` | 5-part guide from savings to execution |
| 转行面试指南 | `career-switch/` | 10-part interview prep for career switchers |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run dev:clean` | Clear cache and start dev |
| `npm run build` | Production build |
| `npm run build:clean` | Clear cache and build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Code Review

AI agent review commands (run via OpenCode or compatible harness):

| Command | Scope | When to Run |
|---------|-------|-------------|
| `/react-review` | React hooks, JSX, RSC boundaries, a11y, render perf | After modifying `.tsx`/`.jsx` files |
| `/code-review` | General uncommitted changes or PR diff | Before any merge |
| `security-review` | Project-wide security audit (XSS, injection, secrets) | Before deployment |

Review categories: **CRITICAL** (must fix), **HIGH** (should fix), **MEDIUM** (consider).

## Agent Instructions

`AGENTS.md` at the repo root contains guidance for AI coding agents — commands, architecture quirks, Supabase setup, and conventions.
