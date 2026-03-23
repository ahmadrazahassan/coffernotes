# Crestwell

**UK small business finance, explained properly.**

Crestwell is a B2B editorial article platform built for publishing long-form finance guides aimed at UK small business owners. It covers accounting, invoicing, payroll, people management, financial reporting, and tax compliance.

---

## Tech Stack

| Layer          | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| Framework      | Next.js 15 (App Router, TypeScript strict)                        |
| React          | React 19                                                          |
| Styling        | Tailwind CSS v4 + CSS custom properties                           |
| Components     | shadcn/ui v4 (base-nova style)                                    |
| Backend / DB   | Supabase (PostgreSQL, Auth, Storage, Row Level Security)           |
| Auth           | Supabase Auth (email + password, admin only)                      |
| Rich Text      | Tiptap editor with visual + raw HTML editing                      |
| Deployment     | Vercel                                                            |

---

## Project Structure

```
crestwell/
├── app/
│   ├── layout.tsx                          # Root layout (Inter font, metadata, nav, footer)
│   ├── page.tsx                            # Homepage (8 sections)
│   ├── sitemap.ts                          # Dynamic sitemap generation
│   ├── about/page.tsx                      # About page
│   ├── rss.xml/route.ts                    # RSS 2.0 feed
│   ├── [category]/
│   │   ├── page.tsx                        # Category listing
│   │   ├── loading.tsx                     # Skeleton loading state
│   │   ├── load-more.tsx                   # Client-side pagination
│   │   └── [slug]/
│   │       ├── page.tsx                    # Single article page
│   │       └── loading.tsx                 # Skeleton loading state
│   ├── admin/
│   │   ├── layout.tsx                      # Admin layout with sidebar
│   │   ├── page.tsx                        # Dashboard (stats + recent articles)
│   │   ├── articles/
│   │   │   ├── page.tsx                    # Articles list (search, filter, CRUD)
│   │   │   ├── new/page.tsx                # Create article (Tiptap + HTML editor)
│   │   │   ├── [id]/page.tsx               # Edit article
│   │   │   └── bulk-upload/page.tsx        # Bulk JSON upload
│   │   ├── categories/page.tsx             # Category management
│   │   └── subscribers/page.tsx            # Subscriber list + CSV export
│   └── (admin-auth)/admin/login/page.tsx   # Admin login (outside admin layout)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                      # Sticky nav with search command palette
│   │   ├── Footer.tsx                      # 4-column footer
│   │   ├── AdminSidebar.tsx                # Admin sidebar navigation
│   │   └── Logo.tsx                        # Open-book SVG logo
│   ├── home/
│   │   ├── HeroSection.tsx
│   │   ├── FeaturedArticles.tsx
│   │   ├── CategoryGrid.tsx
│   │   ├── LatestArticles.tsx
│   │   ├── HowItHelps.tsx
│   │   ├── TrustedTopics.tsx
│   │   ├── NewsletterSection.tsx
│   │   └── FinalCTA.tsx
│   ├── articles/
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleHeader.tsx
│   │   └── ArticleContent.tsx              # DOMPurify-sanitized HTML renderer
│   ├── admin/
│   │   ├── ArticleEditor.tsx               # Tiptap visual + HTML editor
│   │   └── StatsCards.tsx
│   ├── shared/
│   │   ├── CategoryPill.tsx
│   │   ├── ReadTimeBadge.tsx
│   │   └── SubscribeForm.tsx
│   └── ui/                                # shadcn/ui components
├── lib/
│   ├── supabase/
│   │   ├── client.ts                       # Browser Supabase client
│   │   ├── server.ts                       # Server-side Supabase client (SSR)
│   │   └── admin.ts                        # Service-role client (bypasses RLS)
│   ├── utils.ts                            # slugify, calculateReadTime, formatDate, cn
│   └── constants.ts                        # Site metadata, nav links, category definitions
├── types/
│   └── index.ts                            # TypeScript interfaces for all DB tables
├── supabase/
│   └── schema.sql                          # Full database schema, RLS policies, seed data
├── middleware.ts                            # Admin route auth protection
└── .env.local                              # Environment variables (not committed)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- npm

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the `.env.local` file and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://crestwell.co.uk
```

### 3. Set up the database

Open your Supabase project's SQL Editor and run the contents of `supabase/schema.sql`. This creates all tables, enables Row Level Security, seeds the 6 default categories, and sets up the `updated_at` trigger.

### 4. Create a storage bucket

In your Supabase dashboard, go to **Storage** and create a bucket called `article-images` with **public** access enabled. This is used for article thumbnails and in-article images.

### 5. Create an admin user

In your Supabase dashboard, go to **Authentication > Users** and create a user with email and password. This user will have access to the admin panel at `/admin`.

### 6. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the public site and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) to access the admin panel.

---

## Database Schema

| Table          | Purpose                                            |
| -------------- | -------------------------------------------------- |
| `categories`   | 6 article categories (Accounting, Getting Paid, Payroll, People & Leave, Numbers & Insights, Tax & MTD) |
| `articles`     | Full articles with HTML content, metadata, SEO fields |
| `tags`         | Reusable tags                                       |
| `article_tags` | Many-to-many junction between articles and tags     |
| `subscribers`  | Newsletter email subscribers                        |

Row Level Security ensures:

- **Anonymous users** can read published articles, categories, tags, and subscribe
- **Authenticated users** (admin) have full CRUD on all tables

---

## Admin Panel

The admin panel at `/admin` provides:

- **Dashboard** -- article counts, subscriber count, recent articles table
- **Articles** -- searchable and filterable list, create/edit with Tiptap visual editor or raw HTML, thumbnail upload, tags, SEO fields, featured toggle
- **Bulk Upload** -- upload a JSON file to import multiple articles at once
- **Categories** -- add, edit, delete categories (delete is blocked if articles exist)
- **Subscribers** -- view all subscribers with CSV export

### Article Editor

The editor supports two modes that sync bidirectionally:

1. **Visual Editor** -- Tiptap WYSIWYG with toolbar (bold, italic, headings, lists, blockquotes, tables, links, images, code blocks)
2. **HTML Editor** -- raw HTML textarea for pasting pre-written article content

---

## Content Styling

Article HTML content is rendered inside a `.article-content` wrapper that applies editorial typography styles to all standard HTML elements:

- `h2`, `h3` -- section headings with proper spacing
- `p` -- body text at 18px with 1.75 line height
- `ul`, `ol` -- styled lists with proper indentation
- `table` -- full-width bordered tables with header row styling
- `blockquote` -- accent-bordered callouts
- `.highlight`, `.fix`, `.mistake`, `.fine` -- custom callout boxes
- `.grid`, `.card`, `.box` -- layout helpers for structured content

---

## SEO

- Dynamic `<title>` and `<meta>` tags per article using Next.js Metadata API
- Open Graph and Twitter Card tags with article thumbnail, title, description
- Auto-generated `sitemap.xml` from all published articles and categories
- RSS feed at `/rss.xml`

---

## Design System

| Token              | Value     | Usage                            |
| ------------------ | --------- | -------------------------------- |
| `--background`     | `#FFFFFF` | Page background                  |
| `--surface`        | `#F8FAFC` | Card fills, section alternates   |
| `--border`         | `#E2E8F0` | All borders and dividers         |
| `--text-primary`   | `#0F172A` | Headings, body text              |
| `--text-secondary` | `#64748B` | Meta text, captions              |
| `--brand-accent`   | `#00754A` | CTAs, links, active states       |
| `--accent-hover`   | `#005C3A` | Hover state for accent elements  |
| `--tag-bg`         | `#F0FDF4` | Category pill background         |
| `--tag-text`       | `#15803D` | Category pill text               |

- Interactive elements use `12px` border radius (`rounded-xl`)
- Cards use `16px` border radius (`rounded-2xl`)
- Typography is Inter (400, 500, 700, 800)
- No gradients, no dark mode, no decorative icons

---

## Deployment

Deploy to Vercel with zero configuration:

```bash
npm run build
```

Or connect the repository to Vercel and set the environment variables in the Vercel dashboard.

---

## Scripts

| Command         | Description                  |
| --------------- | ---------------------------- |
| `npm run dev`   | Start development server     |
| `npm run build` | Build for production         |
| `npm run start` | Start production server      |
| `npm run lint`  | Run ESLint                   |

---

## License

Private project. All rights reserved.
