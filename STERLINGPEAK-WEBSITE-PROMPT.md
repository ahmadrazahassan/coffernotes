# SterlingPeak.uk — Complete Website Development Prompt

---

## ROLE AND PERSONA

You are a **senior full-stack developer with 20+ years of professional experience** building modern, unique, and pixel-perfect websites. You have built hundreds of production-grade web applications — from editorial platforms and SaaS dashboards to complex CMS-driven content sites. You do NOT build generic, template-looking websites. Every project you deliver looks custom-crafted, premium, and distinctly different from anything built with a drag-and-drop builder. You write clean, scalable, production-ready code with zero shortcuts.

---

## PROJECT OVERVIEW

- **Website Name:** SterlingPeak
- **Domain:** https://sterlingpeak.uk/
- **Locale:** en-GB (United Kingdom)
- **Type:** Independent UK editorial/review website for accounting software, small business finance, tax compliance, and B2B software comparisons — like NerdWallet or Wirecutter but for UK SMEs.
- **Tone:** Authoritative, professional, trustworthy, modern — NOT generic blog vibes.
- The website must look like a **premium, bespoke editorial platform** — think Bloomberg/The Verge meets UK B2B niche. NOT a generic WordPress theme.

---

## TECH STACK

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16+ (App Router, Server Components default) |
| **Language** | TypeScript 5+ strict |
| **React** | React 19+ |
| **Styling** | Tailwind CSS 4+ with `@tailwindcss/postcss` |
| **UI Components** | shadcn/ui latest (Dialog, Select, Table, Badge, Input, Button, Tabs, Sheet, Separator, Sonner) |
| **Icons** | Lucide React (only) |
| **Fonts** | Google Sans (headings `--font-heading`) + Inter (body `--font-sans`) via `next/font/google` |
| **Backend** | Supabase (Auth + PostgreSQL + RLS) |
| **Images** | Cloudinary (all thumbnails/media). Configure `next.config.ts` remotePatterns for `res.cloudinary.com` |
| **Rich Text Editor** | Tiptap (StarterKit + Link, Image, Table, Placeholder, Underline) |
| **Analytics** | Vercel Analytics (`@vercel/analytics`) |
| **Toasts** | Sonner |
| **Utilities** | clsx, tailwind-merge, class-variance-authority, tw-animate-css |
| **Sanitization** | isomorphic-dompurify |
| **Deployment** | Vercel |

---

## ENV VARIABLES (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=https://www.sterlingpeak.uk
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

---

## FONTS

- **Inter** — body, UI, nav, buttons. Variable: `--font-sans`. Weights: 400-700.
- **Headings** — Inter 600-900 weights as `--font-heading` (or self-host Google Sans).
- `h1-h4`: `font-family: var(--font-heading)`, `line-height: 1.2`, `letter-spacing: -0.02em`
- `body`: `font-family: var(--font-sans)`, `16px`, `line-height: 1.75`

---

## COLOR SYSTEM

Light mode ONLY. Monochromatic black/white/gray. No bright brand colors.

```css
:root {
  --background: #FFFFFF; --foreground: #0F172A;
  --primary: #1A1A1A; --primary-foreground: #FFFFFF;
  --secondary: #F8FAFC; --muted: #F8FAFC; --muted-foreground: #64748B;
  --border: #E2E8F0; --destructive: #dc2626; --radius: 0.75rem;
  --color-surface: #F8FAFC; --color-text-primary: #0F172A;
  --color-text-secondary: #64748B; --color-brand-accent: #1A1A1A;
  --color-accent-hover: #111111; --color-tag-bg: #F5F5F5;
}
```

Contact page is the ONLY page with a dark panel + neon-lime `#E8FF00` accent on form focus.

---

## SITE CONSTANTS (`lib/constants.ts`)

```ts
export const SITE_NAME = "SterlingPeak";
export const SITE_TAGLINE = "Smart accounting software reviews for UK small businesses.";
export const SITE_META_DESCRIPTION = "SterlingPeak is an independent UK review and comparison site for small business accounting software — Sage, Xero, and QuickBooks.";
export const SITE_URL_FALLBACK = "https://www.sterlingpeak.uk";
export const SITE_CONTACT_EMAIL = "info@sterlingpeak.uk";
export const LEGAL_EFFECTIVE_DATE = "1 May 2026";
export const FOOTER_TAGLINE = "Independent accounting software reviews for UK businesses.";
export const THUMBNAIL_IMAGE_QUALITY = 90;
export const CATEGORIES = [
  { name: "Accounting", slug: "accounting", description: "Bookkeeping, cloud software, bank reconciliation, digital records." },
  { name: "Getting Paid", slug: "getting-paid", description: "Invoicing, payment terms, collection strategies." },
  { name: "Comparisons", slug: "comparisons", description: "Head-to-head reviews for Sage, Xero, QuickBooks." },
  { name: "Payroll", slug: "payroll", description: "PAYE, RTI, pensions, wage calculations." },
  { name: "People & Leave", slug: "people-leave", description: "Leave tracking, statutory pay, HR compliance." },
  { name: "Numbers & Insights", slug: "numbers-insights", description: "P&L, cash flow, financial dashboards." },
  { name: "Tax & MTD", slug: "tax-mtd", description: "VAT, Making Tax Digital, Self Assessment." },
] as const;
```

---

## DATABASE SCHEMA (Supabase PostgreSQL)

**Tables:** categories, articles, tags, article_tags (junction), article_categories (junction), subscribers, banners, redirect_links, redirect_clicks.

**articles:** id(UUID PK), title, slug(UNIQUE), excerpt, content, thumbnail_url(Cloudinary), author_name(default 'Editorial Team'), author_avatar, status('draft'|'published'), featured(bool), read_time(int), meta_title, meta_description, published_at, created_at, updated_at(auto-trigger).

**categories:** id(UUID PK), name(UNIQUE), slug(UNIQUE), description, sort_order, created_at.

**article_categories:** article_id + category_id (composite PK, both FK with CASCADE).

**subscribers:** id(UUID PK), email(UNIQUE), subscribed(bool), created_at.

**banners:** id(UUID PK), slot_key, name, html, embed_mode('iframe'|'inline'), enabled, priority, starts_at, ends_at, target_paths(TEXT[]), exclude_paths(TEXT[]), device('all'|'desktop'|'mobile'), notes, created_at, updated_at.

**redirect_links:** id(UUID PK), slug(UNIQUE), destination, label, nofollow, sponsored, click_count, created_at, updated_at.

**redirect_clicks:** id(UUID PK), link_id(FK), clicked_at, referrer_path, user_agent, ip_hash.

**RLS:** Public reads published articles only. Anon can subscribe. Authenticated has full CRUD on everything. Seed the 7 categories.

---

## MIDDLEWARE (`middleware.ts`)

- Non-admin routes: pass through, set `x-pathname` header.
- `/admin/*` (except `/admin/login`): check Supabase auth, redirect to `/admin/login` if no user.
- `/admin/login`: redirect to `/admin` if already logged in.
- Use `@supabase/ssr` `createServerClient` with cookie handling.

---

## DETAILED PAGE SPECIFICATIONS

See **STERLINGPEAK-WEBSITE-PROMPT-PART2.md** for complete section-by-section UI/UX specs for every page.
