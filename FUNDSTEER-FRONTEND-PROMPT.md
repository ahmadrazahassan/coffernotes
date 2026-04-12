# FundSteer — Complete Frontend & Homepage Recreation Prompt

> Use this prompt to generate an identical content/blog website frontend (public-facing site) to the Finlytic codebase. Replace all branding with **FundSteer**. This covers every page, component, layout, SEO, data layer, and styling decision.

---

## Tech Stack (MATCH EXACTLY)

- **Next.js 16** (App Router) + **React 19**
- **Supabase** (Auth + Postgres + Storage) via `@supabase/ssr` + `@supabase/supabase-js`
- **Tailwind CSS v4** — postcss plugin only (`@tailwindcss/postcss`), NO `tailwind.config.js` file
- **shadcn/ui** (base-nova theme, `@base-ui/react`, component library via `components.json`)
- **Vercel Analytics** (`@vercel/analytics`)
- **isomorphic-dompurify** for article HTML sanitization
- **lucide-react** for icons
- **sonner** for toast notifications
- **next-themes** (installed but only light mode is used)
- Fonts: **Nunito Sans** (headings, `--font-heading`, weights 600/700/800) + **Open Sans** (body, `--font-sans`, weights 400/500/600/700)
- `reactCompiler: true` in `next.config.ts`
- `babel-plugin-react-compiler` in devDependencies

---

## Design System & Visual Language

### Color Palette (Light-mode only, monochrome neutral)

All colors are defined as CSS custom properties in `globals.css`:

- **Background:** `#FFFFFF`
- **Foreground / text-primary:** `#0F172A`
- **text-secondary:** `#64748B`
- **Surface (subtle bg):** `#F8FAFC`
- **Brand accent:** `#1A1A1A` (near-black, used for primary buttons/CTAs)
- **Accent hover:** `#111111`
- **Tag background:** `#F5F5F5`
- **Tag text:** `#333333`
- **Border:** `#E2E8F0`
- **Destructive:** `#dc2626`
- **Article link color:** `#2563eb` (blue-600), hover `#1d4ed8` (blue-700)

### Typography

- Headings use `font-family: var(--font-heading)` (Nunito Sans), `line-height: 1.2`, `letter-spacing: -0.02em` for h1/h2.
- Body uses `font-family: var(--font-sans)` (Open Sans), `font-size: 16px`, `line-height: 1.75`.
- Hero titles: `font-black` (900 weight), slate-900, tight tracking.
- Section headings: `font-black` or `font-extrabold`, tracking-tight.
- The entire site uses a **newspaper/editorial** aesthetic — bold blacks, clean whites, no gradients, no colored backgrounds except subtle neutrals.

### Border Radius System

- Cards, article containers: `rounded-2xl`
- Buttons/CTAs: `rounded-xl`
- Category pills/tags: `rounded-xl`
- Newsletter card: `rounded-[32px]`
- Footer wrapper: `rounded-2xl`

### Shadows

- Cards: `hover:shadow-sm transition-shadow`
- Newsletter section: no shadows, just `border border-neutral-200/60`
- Navbar pill: `shadow-[0_8px_24px_rgba(0,0,0,0.28)]`
- Exit interstitial card: `shadow-[0_20px_60px_rgba(0,0,0,0.3)]`

---

## Constants File (`lib/constants.ts`)

Define all brand/site constants centrally:

```typescript
export const THUMBNAIL_IMAGE_QUALITY = 90;
export const SITE_NAME = "FundSteer";
export const SITE_TAGLINE = "YOUR_TAGLINE_HERE";
export const SITE_META_DESCRIPTION = "YOUR_META_DESCRIPTION_HERE";
export const SITE_URL_FALLBACK = "https://www.fundsteer.com";
export const SITE_CONTACT_EMAIL = "info@fundsteer.com";
export const LEGAL_EFFECTIVE_DATE = "DD Month YYYY";
export const FOOTER_TAGLINE = "YOUR_FOOTER_TAGLINE_HERE";

export const CATEGORIES = [
  { name: "Category1", slug: "category-1", description: "Description..." },
  { name: "Category2", slug: "category-2", description: "Description..." },
  // ... more categories
] as const;
```

---

## Root Layout (`app/layout.tsx` — Server Component)

The root layout sets up:

1. **Google Fonts:** Nunito Sans (`--font-heading`) + Open Sans (`--font-sans`), applied to `<body>`.
2. **Metadata:** Full SEO metadata object with `title.template: '%s | FundSteer'`, description, icons (16/32/192/512px PNGs + SVG + apple-touch-icon + favicon.ico), `site.webmanifest`, Open Graph (type: website, locale: en_GB), Twitter cards.
3. **Google Tag Manager / Ads script** via `next/script` with `strategy="afterInteractive"`.
4. **JSON-LD schemas** for Organization and WebSite (rendered as `<script type="application/ld+json">`).
5. **Conditional visibility:** `<Navbar>` and `<Footer>` are wrapped in a `<ClientVisibility>` component that hides them on `/admin` paths.
6. **Global providers:** `<Analytics />` (Vercel), `<Toaster />` (sonner).

Layout structure:
```
<html lang="en-GB">
  <head> (scripts) </head>
  <body className="font-sans antialiased">
    <JsonLd data={organizationSchema} />
    <JsonLd data={websiteSchema} />
    <ClientVisibility><Navbar /></ClientVisibility>
    <main>{children}</main>
    <ClientVisibility><Footer /></ClientVisibility>
    <Analytics />
    <Toaster />
  </body>
</html>
```

---

## `ClientVisibility` Component

A client component that checks `usePathname()` and returns `null` if the path starts with any entry in `hideOnPaths` (default: `["/admin"]`). Otherwise renders children. This hides the public Navbar/Footer on admin pages.

---

## Navigation — `Navbar` Component (Client)

A sticky header (`sticky top-0 z-50 bg-transparent`) with:

- **Desktop (xl+):** Logo on the left. On the right, a **dark pill-shaped nav bar** (`bg-neutral-950 rounded-md p-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.28)] ring-1 ring-neutral-900`). Inside: category links rendered from `CATEGORIES` constant. Each link: `text-[11px] font-bold uppercase tracking-[0.06em]`. Active state: `bg-white text-neutral-950`. Inactive: `text-white/90 hover:bg-white/10`. A "Subscribe" button at the end: `bg-white text-neutral-950` linking to `/#newsletter`.
- **Mobile (<xl):** Logo + hamburger button (`bg-neutral-950 text-white size-9 rounded-md`). Opens a `Sheet` (side="right", w-80) with stacked category links (bordered cards, uppercase) + Subscribe button.
- The Navbar returns `null` if `pathname.startsWith("/admin")`.

Container: `max-w-7xl mx-auto h-20 px-6`.

---

## Logo Component

An SVG brand mark (26x26, `fill="currentColor"`) + text wordmark (`text-[17px] font-bold tracking-[0.04em]`), wrapped in a `<Link href="/">`. The SVG path is an abstract leaf/drop shape.

---

## Footer Component

A comprehensive footer wrapped in `<footer className="mt-16">`:

- Outer: `max-w-7xl mx-auto px-6`.
- Inner card: `rounded-2xl border border-neutral-200 bg-neutral-50/80 px-6 py-12 md:px-8`.
- **4-column grid** (`lg:grid-cols-12`):
  1. **Brand column (col-span-4):** Logo, tagline paragraph, description paragraph, location with MapPin icon.
  2. **Topics column (col-span-3):** "Topics" heading (`text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500`), links to each category.
  3. **Governance column (col-span-2):** Links to About, Editorial Standards, Affiliate Disclosure, Contact, Privacy Policy, Terms of Use, RSS Feed, Sitemap.
  4. **Contact column (col-span-3):** Contact us link, email with Mail icon, location with MapPin icon, description text.
- **Newsletter strip:** Below the grid, `border-t border-neutral-200 py-6`. Left: "Weekly finance briefings by email" text. Right: compact `SubscribeForm`.
- **Copyright bar:** Bottom, `border-t border-neutral-200 py-5`. Left: `© {year} FundSteer. All rights reserved.` Right: tagline.

---

## Homepage (`app/page.tsx` — Server Component)

The homepage is composed of these sections in order:

### 1. HeroSection (Server Component)

Fetches **5 featured published articles** from Supabase, ordered by `published_at DESC`.

**If no featured articles exist (fallback state):**
- Left half: tagline badge (small pill with dot), main heading (`text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05]`), subtitle paragraph, two CTAs ("Explore topics" button + "About our editorial process" text link).
- Right half (desktop only): 2x2 grid of topic cards with left border accent.

**If featured articles exist (primary state):**
- **12-column grid layout:** `grid-cols-1 lg:grid-cols-12`.
- **Left (col-span-8):** Lead article with full-width 16:9 thumbnail (priority loading, `quality={90}`, hover scale `1.02`), category pill, read time badge, large title (`text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-[1.08]`), excerpt (line-clamp-2), author + date.
- **Right (col-span-4, border-left):** "Top stories" label with horizontal rule, then 3 secondary articles as numbered list items (number in `text-2xl font-extrabold text-border/70`), each with category label, title, author/date. Below: 5th article with thumbnail.
- Entire section: `border-b border-border`, `max-w-7xl mx-auto px-6 pt-8 pb-12`.

### 2. CategoryArticlesBlock (Server Component, repeated for each category)

Called multiple times on the homepage with different `categorySlug`/`categoryName` props. Fetches **4 published articles** per category from the junction table.

Layout:
- Header row: category name (`text-3xl font-black tracking-tight`) + "View all → " link.
- **2-column grid:** Left = lead article (full thumbnail + "NEW" badge + read time + title + excerpt). Right = up to 3 secondary articles in a stacked list (small thumbnail 128px wide + date + title).
- Section: `py-16 border-b border-border`.

### 3. LatestArticles (Server Component)

Fetches articles 13–24 (`.range(12, 23)`) globally, all published, ordered by `published_at DESC`.

Layout:
- Header: "LATEST FROM THE ARCHIVE" (`text-sm font-bold uppercase tracking-widest text-slate-500`) with horizontal rule + "All articles →" link.
- **12-column grid:** Left (col-span-5, border-right) = highlight article with 3:2 thumbnail, category pill, large title, excerpt, author/date. Right (col-span-7) = text-heavy list with dividers: each item has category label, title, excerpt (1-line), author/date/read-time, and small 128px thumbnail on the right.

### 4. NewsletterSection

A centered section with a large rounded card (`rounded-[32px] bg-[#F2F4F7] border border-neutral-200/60`):
- "Newsletter" pill badge (`rounded-full border bg-white/80 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-[0.15em]`).
- Heading: `text-3xl md:text-5xl font-extrabold tracking-[-0.02em]`.
- Description paragraph.
- `SubscribeForm` component (email input + subscribe button).
- "ZERO SPAM. UNSUBSCRIBE AT ANY TIME." (`text-[11px] font-bold uppercase tracking-widest`).

### 5. FinalCTA

Two-column layout:
- Left (col-span-5): heading, description, "Browse all articles →" link.
- Right (col-span-7): grid of category cards (`grid-cols-2 sm:grid-cols-3`). Each card: `rounded-xl border border-border p-5`, showing category name (`text-sm font-bold`) and description (`text-[11px] text-text-secondary line-clamp-2`).

---

## Category Page (`app/[category]/page.tsx` — Server Component)

- Looks up category by slug, returns `notFound()` if missing.
- Fetches articles via the `article_categories` junction table, published only, ordered by `published_at DESC`, limit 12.
- Renders: heading (`text-4xl font-bold`), description, 3-column grid of `ArticleCard` components.
- If 12+ articles, renders a `LoadMoreButton` client component for pagination.
- Has a `loading.tsx` with skeleton placeholders.
- **generateMetadata** returns title, description, canonical URL, Open Graph.

### LoadMoreButton (Client Component)

- Tracks offset (starts at 12), loads 12 more per click.
- Appends new `ArticleCard` components below existing ones.
- Hides button when fewer than 12 returned.

---

## Article Page (`app/[category]/[slug]/page.tsx` — Server Component)

- Fetches article by slug with junction data, validates that the URL category matches.
- Fetches 3 related articles (same category, excluding current).
- Renders JSON-LD Article schema.
- Layout: `max-w-4xl mx-auto px-6 py-16`.
- Components: `ArticleHeader` → `ArticleContent` → Related articles grid → `NewsletterSection`.
- Has a `loading.tsx` with skeleton placeholders.
- **generateMetadata** returns full SEO: title, description, canonical, Open Graph (type: article, publishedTime, images), Twitter card.

---

## Shared Components

### ArticleCard

A `<Link>` styled as a card: `rounded-2xl border border-border overflow-hidden hover:shadow-sm transition-shadow`.
- Thumbnail: `aspect-video object-cover w-full` using `next/image` with `quality={90}`.
- Body (`p-6`): CategoryPill, title (`text-xl font-bold line-clamp-2`), excerpt (`text-sm text-text-secondary line-clamp-2`), author + date + ReadTimeBadge.

### ArticleHeader

- Category pill (linked), title (`text-4xl md:text-5xl font-extrabold`), meta line (author, date, read time), thumbnail (`rounded-2xl mt-8 aspect-video`, priority).

### ArticleContent (Client Component)

- Uses `isomorphic-dompurify` to sanitize article HTML.
- Registers a DOMPurify hook (`afterSanitizeAttributes`) that detects external links and adds `rel="nofollow sponsored noopener noreferrer"`, `target="_blank"`, and `data-external="true"`.
- Renders sanitized HTML via `dangerouslySetInnerHTML` inside a `div.article-content`.
- Cleans up hooks after each sanitization to prevent stacking.

### CategoryPill

An inline badge: `rounded-xl bg-tag-bg text-tag-text text-xs font-medium px-3 py-1`. Optionally renders as a `<Link>` when `linked` prop is true.

### ReadTimeBadge

Simple: `<span className="text-xs text-text-secondary">{minutes} min read</span>`.

### SubscribeForm (Client Component)

- Email input + Subscribe button in a flex row.
- Validates email with regex, inserts into `subscribers` table via Supabase browser client.
- Handles duplicate email (error code `23505`).
- Has a `compact` prop that reduces height to `h-9`.

### ExitInterstitial (Client Component)

The "leaving site" page (`app/leaving/[slug]/page.tsx`):
- Dark background (`bg-neutral-950`), centered white card (`rounded-3xl p-8`).
- Brand logo at top, external link icon, "You're leaving FundSteer" heading, label/domain display.
- Animated progress bar (3 seconds), countdown timer.
- Auto-redirects via `window.location.href` after 3s.
- "Continue to site" primary button + "Go back to article" secondary button.
- Commission disclosure footnote.

### JsonLd

Renders `<script type="application/ld+json">` with `JSON.stringify(data)`.

---

## Redirect Links (`app/go/[slug]/route.ts` — Route Handler)

A GET route handler that:
1. Looks up `redirect_links` by slug using a lightweight Supabase client (anon key, no cookie writes).
2. If not found, redirects to homepage.
3. Fires analytics: `increment_click_count` RPC + inserts into `redirect_clicks` (with referrer path, user agent, SHA-256 hashed IP).
4. Returns a 302 redirect with security headers: `Cache-Control: private, no-cache`, `X-Robots-Tag: noindex, nofollow`, `Referrer-Policy: no-referrer`.

---

## SEO Infrastructure

### robots.ts
- Allow all, disallow `/admin/`, `/api/`, `/go/`, `/leaving/`.
- Points to sitemap.

### sitemap.ts
- Server component that queries all published articles via junction table.
- Generates URLs as `/{category-slug}/{article-slug}`.
- Includes homepage (priority 1.0), about, contact, affiliate-disclosure, privacy, terms (static pages), all category pages (priority 0.6), all article pages (priority 0.8).

### RSS Feed (`app/rss.xml/route.ts`)
- Generates RSS 2.0 XML with `atom:link` self-reference.
- Fetches published articles via junction table, deduplicates by slug, sorts by date, limits to 50.
- Response: `Content-Type: application/xml`, `Cache-Control: s-maxage=3600, stale-while-revalidate`.

---

## Article Content CSS (`globals.css` — `.article-content` class)

Full typographic styling for rendered article HTML:
- `h2`: 1.875rem, bold, mt-3rem mb-1rem, tight leading.
- `h3`: 1.5rem, bold, mt-2rem mb-0.75rem.
- `p`: 1.125rem, 1.75 line-height, mb-1.25rem.
- `ul`/`ol`: 1.5rem padding-left, disc/decimal list styles.
- `li`: 0.75rem margin-bottom, 1.125rem font-size.
- `table`: full-width, collapsed borders, 0.875rem font.
- `th`: surface background, 600 weight.
- `blockquote`: 4px left border (brand-accent), surface bg, italic.
- `.highlight`: 4px left border, tag-bg, 12px border-radius right.
- `code`: surface bg, 4px radius, smaller font.
- `a`: blue-600, underline, 2px offset. Hover: blue-700.
- External links (`a[data-external="true"]`): adds a small external-link SVG icon via `::after` pseudo-element (0.4 opacity, 0.75 on hover).
- `.mistake`: red left border, red-50 bg.
- `.fix`: brand-accent left border, tag-bg.
- `.fine`: amber left border, amber-50 bg.
- `.grid`: auto-fit grid, min 250px columns.
- `.card`/`.box`: bordered, 12px radius, surface bg.

---

## `globals.css` — Theme Tokens

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-sans);
  --font-heading: var(--font-heading);
  /* ... all shadcn color tokens mapped ... */

  /* Brand tokens */
  --color-surface: #F8FAFC;
  --color-text-primary: #0F172A;
  --color-text-secondary: #64748B;
  --color-brand-accent: #1A1A1A;
  --color-accent-hover: #111111;
  --color-tag-bg: #F5F5F5;
  --color-tag-text: #333333;
}

:root {
  --background: #FFFFFF;
  --foreground: #0F172A;
  --primary: #1A1A1A;
  --primary-foreground: #FFFFFF;
  --secondary: #F8FAFC;
  --muted: #F8FAFC;
  --muted-foreground: #64748B;
  --border: #E2E8F0;
  --input: #E2E8F0;
  --ring: #1A1A1A;
  --radius: 0.75rem;
  /* ... full set ... */
}

@layer base {
  body { font-size: 16px; line-height: 1.75; }
  h1, h2, h3, h4 { font-family: var(--font-heading); line-height: 1.2; }
  h1, h2 { letter-spacing: -0.02em; }
}
```

---

## next.config.ts

```typescript
const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    deviceSizes: [640, 750, 828, 896, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512],
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
      { protocol: "https", hostname: "i.imgur.com" },
      { protocol: "https", hostname: "**.imgur.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.cloudinary.com" },
    ],
  },
};
```

---

## Middleware (`middleware.ts`)

Matches `/admin/:path*`. Uses `@supabase/ssr` `createServerClient` with cookie forwarding:
- If no user on any `/admin/*` (except `/admin/login`) → redirect to `/admin/login`.
- If user is logged in and hits `/admin/login` → redirect to `/admin`.

---

## Database Schema

(Same as admin prompt — 6 core tables + 2 redirect tables, RLS policies, storage bucket.)

Tables: `categories`, `articles`, `tags`, `article_tags`, `article_categories`, `subscribers`, `redirect_links`, `redirect_clicks`.

Key architectural decisions:
- **Many-to-many** relationship between articles and categories via `article_categories` junction table.
- **Many-to-many** between articles and tags via `article_tags`.
- RLS: anon users can SELECT published articles, all categories/tags/junctions, INSERT into subscribers. Authenticated users get full CRUD.
- Public storage bucket `article-images` for article inline images.
- `update_updated_at()` trigger on articles.

---

## TypeScript Types (`types/index.ts`)

```typescript
export interface Category {
  id: string; name: string; slug: string;
  description: string | null; sort_order: number; created_at: string;
}

export interface Article {
  id: string; title: string; slug: string; excerpt: string | null;
  content: string; thumbnail_url: string | null;
  author_name: string; author_avatar: string | null;
  status: "draft" | "published"; featured: boolean;
  read_time: number | null; meta_title: string | null;
  meta_description: string | null; published_at: string | null;
  created_at: string; updated_at: string;
  categories?: Category[]; tags?: Tag[];
  article_categories?: { category: Category }[];
}

export interface Tag { id: string; name: string; slug: string; }
export interface ArticleTag { article_id: string; tag_id: string; tag?: Tag; }
export interface Subscriber { id: string; email: string; subscribed: boolean; created_at: string; }
export interface RedirectLink {
  id: string; slug: string; destination: string; label: string | null;
  nofollow: boolean; sponsored: boolean; click_count: number;
  created_at: string; updated_at: string;
}
export interface RedirectClick {
  id: string; link_id: string; clicked_at: string;
  referrer_path: string | null; user_agent: string | null; ip_hash: string | null;
}
```

---

## Utility Functions (`lib/utils.ts`)

```typescript
cn(...inputs)        // clsx + tailwind-merge
slugify(text)        // lowercase, strip special chars, hyphens
calculateReadTime(html) // strip tags, word count / 200, min 1
formatDate(date)     // en-GB: "11 Apr 2026"
```

---

## Supabase Clients (`lib/supabase/`)

- `client.ts` — `createBrowserClient(url, anonKey)` for all client components.
- `server.ts` — `createServerClient(url, anonKey, { cookies })` for server components using `next/headers` cookies.

---

## Key Dependencies

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "react-dom": "19.2.3",
  "@supabase/ssr": "^0.9.0",
  "@supabase/supabase-js": "^2.99.1",
  "@base-ui/react": "^1.3.0",
  "@vercel/analytics": "^2.0.1",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "isomorphic-dompurify": "^3.3.0",
  "lucide-react": "^0.577.0",
  "next-themes": "^0.4.6",
  "shadcn": "^4.0.7",
  "sonner": "^2.0.7",
  "tailwind-merge": "^3.5.0",
  "tw-animate-css": "^1.4.0"
}
```

Dev dependencies: `@tailwindcss/postcss@^4`, `tailwindcss@^4`, `typescript@^5`, `@types/react@^19`, `@types/react-dom@^19`, `eslint@^9`, `eslint-config-next@16.1.6`, `babel-plugin-react-compiler@1.0.0`.

---

## PWA Manifest (`public/site.webmanifest`)

```json
{
  "name": "FundSteer",
  "short_name": "FundSteer",
  "description": "YOUR_DESCRIPTION_HERE",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#16382F",
  "theme_color": "#16382F",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any maskable" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any maskable" }
  ]
}
```

---

## File Structure Summary

```
app/
├── layout.tsx                    (root layout, fonts, metadata, JSON-LD, nav/footer)
├── page.tsx                      (homepage: hero + category blocks + latest + newsletter + CTA)
├── globals.css                   (tailwind imports, theme tokens, article-content CSS)
├── robots.ts                     (SEO robots rules)
├── sitemap.ts                    (dynamic sitemap generation)
├── rss.xml/route.ts              (RSS 2.0 feed)
├── go/[slug]/route.ts            (redirect link handler with analytics)
├── leaving/[slug]/page.tsx       (exit interstitial page)
├── [category]/
│   ├── page.tsx                  (category listing with load-more)
│   ├── loading.tsx               (skeleton loader)
│   ├── load-more.tsx             (client pagination component)
│   └── [slug]/
│       ├── page.tsx              (article detail page)
│       └── loading.tsx           (skeleton loader)
├── (admin-auth)/admin/login/     (login page, separate layout group)
└── admin/                        (admin panel — see admin prompt)

components/
├── home/
│   ├── HeroSection.tsx           (featured articles hero, editorial layout)
│   ├── CategoryArticlesBlock.tsx (per-category feed section)
│   ├── LatestArticles.tsx        (archive feed, 2-column editorial)
│   ├── NewsletterSection.tsx     (subscribe CTA card)
│   └── FinalCTA.tsx              (category grid CTA)
├── articles/
│   ├── ArticleCard.tsx           (reusable article card)
│   ├── ArticleHeader.tsx         (article page header)
│   └── ArticleContent.tsx        (sanitized HTML renderer)
├── shared/
│   ├── CategoryPill.tsx          (tag/category badge)
│   ├── ReadTimeBadge.tsx         (read time display)
│   ├── SubscribeForm.tsx         (email subscribe form)
│   └── ExitInterstitial.tsx      (leaving-site page UI)
├── seo/
│   └── JsonLd.tsx                (JSON-LD script renderer)
├── layout/
│   ├── Navbar.tsx                (public site navigation)
│   ├── Footer.tsx                (public site footer)
│   ├── Logo.tsx                  (brand mark + wordmark)
│   ├── ClientVisibility.tsx      (conditional rendering by path)
│   └── AdminHeader.tsx           (admin navigation — see admin prompt)
├── ui/                           (shadcn components: button, input, dialog, table, etc.)
└── admin/                        (admin components — see admin prompt)

lib/
├── utils.ts                      (cn, slugify, calculateReadTime, formatDate)
├── constants.ts                  (all brand/site constants)
└── supabase/
    ├── client.ts                 (browser Supabase client)
    └── server.ts                 (server Supabase client)

types/
└── index.ts                      (all TypeScript interfaces)

middleware.ts                     (admin route protection)
next.config.ts                    (React compiler, image config)
postcss.config.mjs                (Tailwind CSS v4 plugin)
components.json                   (shadcn config)
public/
├── site.webmanifest
├── icon-16.png, icon-32.png, icon-192.png, icon-512.png
├── icon.svg, apple-touch-icon.png, favicon.ico
```

---

## Key Architectural Decisions to Preserve

1. **No API routes, no Server Actions.** All client-side mutations go directly to Supabase via the browser client with RLS.
2. **Server Components for data fetching** (homepage, category pages, article pages). Client Components only where interactivity is needed (forms, search, filters, editor).
3. **Junction table pattern** for article-category and article-tag relationships (many-to-many).
4. **DOMPurify-based article rendering** with automatic external link detection and SEO attribute injection.
5. **Editorial/newspaper design language** — monochrome, typography-driven, no decorative elements.
6. **Image optimization** with `quality={90}`, explicit `sizes` attributes, `priority` on above-fold images.
7. **Debounced search** (300ms) on list pages.
8. **Client-side category filtering** on the articles list (Supabase JS limitation with junction tables).
9. **localStorage bridge** for HTML upload → new article flow.
10. **Exit interstitial** for affiliate/external links with auto-redirect and analytics.
