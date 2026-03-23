# Crestwell

Premium UK finance publishing platform for business owners, finance teams, and compliance-focused operators.

## Overview

Crestwell is a production-grade editorial web platform built with Next.js and Supabase.  
It combines a polished public knowledge hub with an internal admin CMS for publishing, categorization, SEO, and subscriber management.

The project is designed to be:

- brand-consistent and enterprise-ready
- SEO-focused (metadata, sitemap, RSS, structured data)
- operationally simple to deploy
- safe for real editorial workflows (draft/publish, role-based access, sanitized content rendering)

## Core Capabilities

- Public article hub with category pages and article detail pages
- Admin dashboard for content operations
- Rich article authoring (Tiptap visual editor + HTML mode)
- Category management with integrity checks
- Subscriber collection and CSV export
- Dynamic SEO metadata and social tags
- RSS feed and XML sitemap generation
- Supabase-backed auth, storage, and row-level security

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, design tokens in global CSS |
| UI | shadcn/ui, lucide-react icons |
| Editor | Tiptap |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS) |
| SEO | Next Metadata API, JSON-LD, sitemap, RSS |
| Runtime | Node.js |

## Project Structure

```text
crestwell/
├── app/
│   ├── page.tsx                         # Homepage
│   ├── about/page.tsx                   # Company/editorial page
│   ├── [category]/                      # Category listing pages
│   ├── [category]/[slug]/               # Article detail pages
│   ├── admin/                           # Admin CMS area
│   ├── sitemap.ts                       # Dynamic sitemap
│   ├── robots.ts                        # Robots directives
│   └── rss.xml/route.ts                 # RSS feed
├── components/
│   ├── home/                            # Homepage sections
│   ├── articles/                        # Article display components
│   ├── layout/                          # Navbar, footer, logo
│   ├── admin/                           # Admin components
│   └── ui/                              # Reusable UI primitives
├── lib/
│   ├── constants.ts                     # Category and site constants
│   └── supabase/                        # Client/server/admin Supabase setup
├── supabase/schema.sql                  # Database schema + RLS + seeds
├── types/index.ts                       # Shared TypeScript types
└── middleware.ts                        # Auth-protected admin routes
```

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- Supabase project

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment variables

Create `.env.local` in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://crestwell.uk
```

### 3) Initialize database

Run `supabase/schema.sql` in the Supabase SQL Editor.

This sets up:

- tables: `articles`, `categories`, `tags`, `article_tags`, `article_categories`, `subscribers`
- indexes for public and admin query paths
- row-level security policies
- default category seed data
- storage bucket policies for article images

### 4) Create storage bucket

In Supabase Storage, create a public bucket named `article-images`.

### 5) Create admin user

Create an admin user in Supabase Auth dashboard and sign in at:

- `/admin/login`

### 6) Run development server

```bash
npm run dev
```

App URLs:

- Public: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start local dev server |
| `npm run build` | Create production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## SEO and Discovery

Crestwell includes built-in search/discovery assets:

- metadata per route and article
- canonical URLs via `NEXT_PUBLIC_SITE_URL`
- `sitemap.xml` generated from published content
- `robots.txt` for crawler policy
- `rss.xml` feed for subscribers and syndication
- JSON-LD structured data in root layout and article pages

## Branding and UX Standards

- Primary brand: `Crestwell`
- Tone: professional, high-trust, compliance-friendly
- No placeholder/generic copy in public-facing content
- No gradients or decorative animations in core brand surfaces
- Premium, clean UI suitable for Sage-adjacent review workflows

## Deployment

Recommended: Vercel deployment connected to this repository.

Set the same environment variables in the deployment environment, then run:

```bash
npm run build
```

## Security Notes

- Never commit secrets (`.env.local`, service keys)
- Admin credentials should only be created in Supabase Auth UI
- Keep RLS enabled in production
- Use least-privilege keys in all environments

## License

Private repository. All rights reserved.
