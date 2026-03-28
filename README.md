# Finlytic

**Smart accounting software reviews for UK small businesses.**

Finlytic is an independent UK review and comparison site for small business accounting software — Sage, Xero, and QuickBooks. The product is a Next.js + Supabase editorial platform with a public site and an admin CMS.

## Overview

- Public article and category pages, SEO (metadata, sitemap, RSS, JSON-LD)
- Admin dashboard for articles, categories, and subscribers
- Supabase (PostgreSQL, Auth, Storage, RLS)

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js (App Router), React, TypeScript |
| Styling | Tailwind CSS, design tokens in `app/globals.css` |
| Backend | Supabase |
| Analytics | Vercel Analytics (optional), Google Ads tag in root layout |

## Project structure

```text
finlytic/
├── app/                 # Routes, metadata, RSS, sitemap
├── components/          # UI, layout, home, articles, admin
├── lib/constants.ts     # Categories, site name, URLs, copy
├── supabase/schema.sql  # Schema, RLS, seeds
└── middleware.ts        # Admin route protection
```

## Local setup

### Prerequisites

- Node.js 18+
- npm
- Supabase project

### 1) Install

```bash
npm install
```

### 2) Environment

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL=https://finlytic.uk
```

### 3) Database

Run `supabase/schema.sql` in the Supabase SQL Editor.

### 4) Storage

Create a public bucket `article-images` in Supabase Storage.

### 5) Admin user

Create a user in Supabase Auth; sign in at `/admin/login`.

### 6) Dev server

```bash
npm run dev
```

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/login`

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |

## Branding

- **Name:** Finlytic
- **Tagline:** Smart accounting software reviews for UK small businesses.
- **Meta description:** Finlytic is an independent UK review and comparison site for small business accounting software — Sage, Xero, and QuickBooks.

Site-wide strings live in `lib/constants.ts` (`SITE_NAME`, `SITE_META_DESCRIPTION`, `SITE_URL_FALLBACK`, etc.).

## Deployment

Deploy on Vercel (or similar). Set the same env vars as production, then:

```bash
npm run build
```

## Security

- Do not commit `.env.local` or service role keys.
- Keep RLS enabled in production.

## License

Private repository. All rights reserved.

## Design reference

See `FINLYTIC-UI-UX-BLUEPRINT.md` for UI/UX direction.
