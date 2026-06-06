# SterlingPeak.uk — Part 2: Detailed Page-by-Page UI/UX Specifications

---

## ROOT LAYOUT (`app/layout.tsx`)

**Metadata:**
- Default title: `SterlingPeak`, template: `%s | SterlingPeak`
- Full OpenGraph + Twitter Card metadata with 512x512 logo image
- Favicons: 16, 32, 48, 192, 512 PNG + SVG + apple-touch-icon + favicon.ico
- Web manifest at `/site.webmanifest`
- `metadataBase`: `https://www.sterlingpeak.uk`
- Locale: `en_GB`

**JSON-LD Structured Data:**
- Organization schema: name, url, logo, description
- WebSite schema: name, url, publisher, inLanguage: en-GB

**Body Structure (top to bottom):**
1. `<BannerSlot slotKey="global_top_leaderboard" />` — optional top leaderboard ad
2. `<Navbar />` — hidden on `/admin` routes via `<ClientVisibility>`
3. `<main>{children}</main>`
4. `<BannerSlot slotKey="footer_above" />` — optional pre-footer ad
5. `<Footer />` — hidden on `/admin` routes via `<ClientVisibility>`
6. `<GlobalAnchorSlot />` — sticky bottom anchor banner
7. `<Analytics />` — Vercel Analytics
8. `<Toaster />` — Sonner toast container

---

## NAVBAR (`components/layout/Navbar.tsx`)

**Client Component.** Returns `null` on any `/admin` route.

**Desktop (xl breakpoint and up):**
- Sticky `top-0 z-50`, transparent background (content shows through).
- `max-w-7xl` centered container, `h-20`, flex between logo and nav.
- Logo on the left (SVG mark + "SterlingPeak" text, `text-[17px] font-bold tracking-[0.04em]`).
- Navigation: A single **dark pill bar** (`bg-neutral-950`, `rounded-md`, `p-1.5`) with `shadow-[0_8px_24px_rgba(0,0,0,0.28)]` and `ring-1 ring-neutral-900`.
  - Inside: all 7 category links as pills.
  - Each link: `text-[11px] font-bold uppercase tracking-[0.06em]`, `px-4 py-2`.
  - Active state: `bg-white text-neutral-950`.
  - Inactive: `text-white/90 hover:bg-white/10 hover:text-white`.
  - Last item: "Subscribe" button with `bg-white text-neutral-950` that scrolls to `#newsletter`.

**Mobile (below xl):**
- Same sticky header with Logo on left.
- Hamburger button on right: `size-9 bg-neutral-950 text-white rounded-md`.
- Opens a `<Sheet>` (shadcn) from the right, `w-80`.
  - Stacked category links as bordered buttons: `rounded-md border px-4 py-3 text-sm font-semibold uppercase`.
  - Active: `border-neutral-900 bg-neutral-900 text-white`.
  - Inactive: `border-neutral-200 text-neutral-900 hover:border-neutral-900`.
  - "Subscribe" button at bottom: `bg-neutral-950 text-white`.

---

## HOMEPAGE (`app/page.tsx`)

The homepage is a **content-rich, newspaper-style editorial layout**. It immediately showcases articles — no marketing hero banners.

### Section 1: HeroSection (`components/home/HeroSection.tsx`)

**Server Component.** Fetches 5 featured published articles.

**12-column grid layout:**

**Left 8 columns (Lead Article):**
- Full-width 16:9 thumbnail with `overflow-hidden`, hover `scale-[1.02]` over 700ms ease-out
- Below image: CategoryPill + ReadTimeBadge
- Title: `text-3xl sm:text-4xl md:text-[2.75rem] font-black leading-[1.08] tracking-tight`
- Excerpt: `text-lg text-slate-600 line-clamp-2 font-medium`
- Author + date: `text-sm`, bold author name, date separated by `/`
- Right border on lg: `lg:border-r lg:border-border lg:pr-8`

**Right 4 columns (Rail):**
- "Top stories" label: `text-[11px] font-semibold uppercase tracking-widest text-text-secondary` + horizontal rule line
- 3 secondary articles stacked with `divide-y divide-border`:
  - Large number index (2, 3, 4): `text-2xl font-extrabold text-border/70`
  - Category: `text-[11px] font-semibold uppercase tracking-wide text-brand-accent`
  - Title: `text-base font-black leading-snug line-clamp-3`
  - Author + date: `text-xs text-slate-500 font-medium`
- 5th article with small thumbnail + title below the list
- Optional `BannerSlot` for `home_hero_rail` at bottom of rail

**Fallback (no featured articles):** Static hero with:
- Tagline badge: pill with dot + site tagline
- H1: "Compare accounting software with confidence." — `text-4xl md:text-5xl lg:text-6xl font-black`
- Subtext about independent reviews
- Two CTAs: "Explore topics" (dark button) + "About our editorial process" (text link)
- Right side: 2x2 grid of topic cards (Accounting, Getting Paid, Payroll, Tax & MTD) with left border accents

### Section 2: Category Article Blocks

Render in this order:
1. `CategoryArticlesBlock` for "Accounting"
2. `CategoryArticlesBlock` for "Payroll & HR"
3. `BannerSlot` for `home_mid_feed`
4. `CategoryArticlesBlock` for "Comparisons"
5. `CategoryArticlesBlock` for "Getting Paid"
6. `CategoryArticlesBlock` for "Tax & MTD"

**Each CategoryArticlesBlock (`components/home/CategoryArticlesBlock.tsx`):**
- Server Component. Fetches 4 published articles for the given category via junction table.
- Returns `null` if no articles exist for that category.
- **Header row:** Category name `text-3xl font-black` + "View all [name] articles →" link.
- **2-column grid:**
  - **Left (Lead):** 16:9 thumbnail with hover zoom, "NEW" + read time badges, title `text-2xl font-black`, excerpt `line-clamp-3`
  - **Right (3 Stacked):** Each with small thumbnail (128x96), date label, title `text-lg font-black line-clamp-2`, separated by borders
- Section: `py-16 border-b border-border`

### Section 3: LatestArticles (`components/home/LatestArticles.tsx`)

- Server Component. Fetches articles at offset 12-23 (skips those shown in category blocks).
- **Header:** "Latest from the Archive" (`text-sm font-bold uppercase tracking-widest text-slate-500`) + "All articles →" link
- **12-column grid:**
  - **Left 5 columns (Highlight):** 3:2 thumbnail, category pill, read time, title `text-3xl font-black tracking-tight`, excerpt, author + date
  - **Right 7 columns (Stacked List):** `divide-y divide-border`, each article: category label `text-[11px]`, title `text-lg font-black`, excerpt snippet, author/date/read time in `text-xs uppercase tracking-widest`, small thumbnail on right (128x96)

### Section 4: BannerSlot `home_above_newsletter`

### Section 5: NewsletterSection (`components/home/NewsletterSection.tsx`)

- `id="newsletter"` for scroll targeting from nav
- Large rounded container: `rounded-[32px] bg-[#F2F4F7] border border-neutral-200/60`
- Padding: `px-6 py-12 md:py-16 lg:px-20`, centered text
- "Newsletter" pill: `rounded-full border border-neutral-300/60 bg-white/80 backdrop-blur-sm text-[10px] font-extrabold uppercase tracking-[0.15em]`
- Headline: `text-3xl md:text-5xl font-extrabold tracking-[-0.02em] leading-[1.1]` — "Independent accounting software insights, delivered every week."
- Description paragraph about what readers get
- `SubscribeForm` component (email input + submit)
- Disclaimer: "ZERO SPAM. UNSUBSCRIBE AT ANY TIME." in `text-[11px] font-bold uppercase tracking-widest`

### Section 6: FinalCTA (`components/home/FinalCTA.tsx`)

- **12-column grid:**
  - **Left 5 columns:** "Find the guide you need" `text-3xl font-extrabold`, description about topics, "Browse all articles →" link
  - **Right 7 columns:** 2x3 or 3-column grid of category cards. Each card: `rounded-xl border border-border p-5`, category name `text-sm font-bold`, description `text-[11px] text-text-secondary line-clamp-2`. Hover: `border-brand-accent/30 bg-tag-bg/30`

---

## CATEGORY PAGE (`app/[category]/page.tsx`)

- Server Component. Looks up category by slug. `notFound()` if not found.
- **SEO:** Category name as title, description from category, canonical URL.
- **Layout:**
  - H1: category name `text-4xl font-bold`
  - Description: `text-lg text-text-secondary`
  - `BannerSlot` for `category_below_header`
  - **Article grid:** `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
  - First 3 articles, then `BannerSlot` for `category_in_grid` (full width), then remaining articles
  - Each article rendered as `ArticleCard`
  - "Load more" button if 12+ articles (client component that fetches next batch)

---

## ARTICLE DETAIL PAGE (`app/[category]/[slug]/page.tsx`)

- Server Component. Fetches article by slug, validates category match, `notFound()` if either fails.
- **SEO:** meta_title or title, meta_description or excerpt, canonical, OpenGraph article type with publishedTime/modifiedTime, thumbnail image.
- **JSON-LD:** Article schema with headline, description, image, dates, author, publisher.

**Layout:**
- If a `sidebar_sticky` banner exists for this path: 2-column layout (`lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-10`). Otherwise: single column `max-w-4xl mx-auto`.
- **Article Column:**
  - `ArticleHeader` component: category breadcrumb, title, excerpt, author info, date, thumbnail
  - `BannerSlot` for `article_below_header`
  - `ArticleBodyWithBanners`: renders sanitized article HTML content with the `.article-content` CSS class applied, and injects `article_in_content_1` and `article_in_content_2` banner slots at appropriate positions within the content
  - `BannerSlot` for `article_below_content`
- **Sidebar Column (if banner exists):** Sticky `top-28` with 300px max-width banner

**Below Article:**
- Related articles section: "Related articles" heading + 3-column grid of `ArticleCard` components (fetched from same category, excluding current article)
- `NewsletterSection` at the very bottom

**Article Content CSS (in `globals.css` as `.article-content` class):**
- `h2`: 1.875rem, font-weight 700, margin-top 3rem, margin-bottom 1rem, tracking -0.02em
- `h3`: 1.5rem, 700 weight, margin-top 2rem
- `p`: 1.125rem, line-height 1.75, margin-bottom 1.25rem
- `ul/ol`: padding-left 1.5rem, proper list styles (disc/decimal)
- `li`: margin-bottom 0.75rem, 1.125rem
- `table`: full width, border-collapse, 0.875rem font
- `th/td`: 1px border, 0.75rem padding
- `th`: surface background, 600 weight
- `blockquote`: 4px left border (brand-accent), surface bg, italic
- `.highlight`: 4px left border, tag-bg background, rounded right corners
- `code`: surface bg, 4px radius, 0.875em
- `a`: blue-600 (#2563eb) underline, hover blue-700
- External links (`[data-external="true"]`): subtle external link icon via CSS `::after` pseudo-element
- `strong`: 700 weight, `em`: italic
- `.mistake`: red left border, red-50 bg
- `.fix`: brand-accent left border, tag-bg
- `.fine`: amber left border, amber-50 bg
- `.grid`: auto-fit minmax(250px, 1fr)
- `.card/.box`: border, 12px radius, padding, surface bg

---

## ABOUT PAGE (`app/about/page.tsx`)

**Framer-style large rounded panel design.** NOT a boring text page.

- Outer: `max-w-[1400px] px-4 py-12 lg:py-24`
- Inner panel: `rounded-[40px] bg-[#F2F4F7] p-8 md:p-16 lg:p-24 overflow-hidden relative`
- **Abstract Background:** Absolutely positioned, top-right, huge blurred gradient circle (`w-[800px] h-[800px]`, gradient from blue-400 via pink-400 to yellow-400, `opacity-20 blur-[100px] mix-blend-multiply`)
- **Top Section:**
  - H1: "Hi, I'm [Founder Name]." — `text-6xl md:text-8xl lg:text-[7rem] font-extrabold tracking-[-0.03em] leading-[1]`
  - Description paragraph: `text-2xl md:text-3xl lg:text-4xl text-neutral-600 font-medium tracking-tight leading-[1.4]`
- **Bottom Section:** 12-column grid with top border, large top margin
  - **Left 6 columns:** "Our Publishing Focus" heading + two paragraphs about editorial mission, link to Affiliate Disclosure
  - **Right 6 columns:** Flex-wrap of expertise tag pills: `rounded-full border border-neutral-300/60 bg-white/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-widest`. Tags: SAGE BUSINESS CLOUD, XERO, QUICKBOOKS, ACCOUNTING, TAX & MTD, PAYROLL (RTI), HMRC COMPLIANCE, CASH FLOW, GETTING PAID, SOFTWARE REVIEWS

---

## CONTACT PAGE (`app/contact/page.tsx`)

**Split-panel design** — unique, NOT a generic contact form.

- `max-w-7xl px-4 py-12 lg:py-24`
- Wrapper: `rounded-3xl border border-neutral-200 bg-white shadow-sm` grid `lg:grid-cols-2`, `min-h-[700px]`
- **Connection Arrow (desktop only):** Centered between the two halves — horizontal line with arrowhead pointing right

**Left Panel (White):**
- `p-10 lg:p-20 bg-white`
- H1: "Let's get in touch" — `text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-[-0.03em] leading-[1.05]`
- Subtext: "Don't be afraid to say hello with us!"
- Bottom section with: Email (clickable mailto), Office location (London, UK), "See our story →" link to about page

**Right Panel (Dark):**
- `bg-[#1C1C1C] p-10 lg:p-20 text-white`
- H2: "Contact"
- Form with floating label inputs (name, email, phone, subject in 2x2 grid, then interest area full width)
- Input style: `bg-transparent border-b border-neutral-700 text-white`, focus: `border-[#E8FF00]` (neon lime)
- Labels: float up on focus with `peer` CSS technique, turn `text-[#E8FF00]` on focus
- Submit button: `bg-[#E8FF00] text-neutral-950 font-bold py-4` full width, hover `bg-[#D7ED00]`

---

## PRIVACY PAGE (`app/privacy/page.tsx`)

- `max-w-4xl mx-auto px-6 py-20`
- Effective date at top in `text-sm text-text-secondary`
- H1: "Privacy Policy" — `text-4xl md:text-5xl font-extrabold`
- UK GDPR compliant content with sections: Who we are, What data we collect, How we use it, Cookies, Analytics, Legal bases, Retention, Sharing/transfers, Your rights, Children, Changes, Contact
- Links to contact page and mailto
- Professional legal tone throughout

---

## TERMS PAGE (`app/terms/page.tsx`)

- Same layout as Privacy page
- Sections: About the site, Acceptable use, Intellectual property, Third-party links, Accuracy, Limitation of liability, Newsletter, Changes, Governing law (England and Wales), Contact

---

## AFFILIATE DISCLOSURE PAGE (`app/affiliate-disclosure/page.tsx`)

- Same clean layout as Privacy/Terms
- Transparent disclosure about affiliate partnerships
- Explains that editorial content is independent
- Lists types of commercial relationships

---

## FOOTER (`components/layout/Footer.tsx`)

- `mt-16`, `max-w-7xl mx-auto px-6`
- Wrapper: `rounded-2xl border border-neutral-200 bg-neutral-50/80 px-6 py-12 md:px-8`
- **12-column grid:**
  - **Col 1-4 (Brand):** Logo, footer tagline, site tagline + mention of Sage/Xero/QuickBooks, location (London, UK) with MapPin icon
  - **Col 5-7 (Topics):** "TOPICS" label (`text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500`), all 7 category links
  - **Col 8-9 (Governance):** "GOVERNANCE" label, links: About, Editorial Standards, Affiliate Disclosure, Contact, Privacy Policy, Terms of Use, RSS Feed, Sitemap
  - **Col 10-12 (Contact):** "CONTACT" label, "Contact us" link, email with Mail icon, location with MapPin, editorial note
- **Newsletter Strip:** Below main grid, `border-t border-neutral-200 py-6`, "Weekly finance briefings by email." text + compact `SubscribeForm`
- **Copyright Bar:** `border-t border-neutral-200 py-5`, copyright text + tagline, flex between

---

## LOGO (`components/layout/Logo.tsx`)

- SVG brand mark (custom abstract shape, `width="26" height="26"`, `fill="currentColor"`) + "SterlingPeak" text span
- `text-[17px] font-bold tracking-[0.04em]`
- Wrapped in `<Link href="/">`

---

## SHARED COMPONENTS

### CategoryPill
- Small inline pill showing category name
- `text-[11px] font-bold uppercase tracking-wide bg-tag-bg text-tag-text px-2 py-0.5 rounded`

### ReadTimeBadge
- Shows "X min read"
- `text-[11px] text-text-secondary font-medium`

### SubscribeForm
- Email input + "Subscribe" submit button
- Posts to Supabase `subscribers` table (INSERT)
- Success/error toast via Sonner
- Has `compact` prop variant for footer usage (smaller, horizontal layout)

### ArticleCard
- Reusable card: `rounded-2xl border border-border overflow-hidden hover:shadow-sm`
- 16:9 thumbnail via `next/image` (Cloudinary URL)
- Below: category pill, title `text-xl font-bold line-clamp-2`, excerpt `text-sm line-clamp-2`, author + date + read time

### JsonLd
- Renders `<script type="application/ld+json">` with stringified data

---

## BANNER SYSTEM

### Concept
A flexible ad/banner management system. Each banner belongs to a "slot" (placement position). Banners can be scheduled, device-targeted, path-targeted, and priority-ordered.

### Slot Keys
`global_top_leaderboard`, `home_hero_rail`, `home_below_hero`, `home_mid_feed`, `home_above_newsletter`, `category_below_header`, `category_in_grid`, `article_below_header`, `article_in_content_1`, `article_in_content_2`, `article_below_content`, `sidebar_sticky`, `footer_above`, `global_anchor`

### BannerSlot (Server Component)
- Receives `slotKey` and optional `pathname`
- Calls `getBannerForSlot()` server-side which queries Supabase for enabled banners matching the slot, checks schedule (starts_at/ends_at), target/exclude paths, and returns highest-priority match
- Renders `BannerEmbed` if a banner is found, nothing otherwise (no empty placeholder)

### BannerEmbed (Client Component)
- Two modes: `iframe` (renders HTML in a sandboxed iframe) or `inline` (renders HTML directly with DOMPurify)
- Lazy loading support for iframes

### ArticleBodyWithBanners
- Renders article HTML content
- Splits content at appropriate break points to inject `article_in_content_1` and `article_in_content_2` banners between paragraphs

---

## AFFILIATE REDIRECT SYSTEM (`app/go/[slug]/route.ts`)

- GET handler: looks up `redirect_links` by slug
- Logs click to `redirect_clicks` table (referrer_path, user_agent, ip_hash)
- Increments `click_count` on the link
- Returns 302 redirect to destination URL
- Sets appropriate `rel` headers based on nofollow/sponsored flags

---

## RSS FEED (`app/rss.xml/route.ts`)

- GET handler returning XML
- Fetches all published articles ordered by published_at DESC
- Generates standard RSS 2.0 feed with channel info (title, link, description) and items (title, link, description, pubDate, guid)

---

## SITEMAP (`app/sitemap.ts`)

- Dynamic sitemap using Next.js `MetadataRoute.Sitemap`
- Includes: homepage, all category pages, all published article pages, about, contact, privacy, terms, affiliate-disclosure
- Article URLs use `/${category-slug}/${article-slug}` format

---

## ROBOTS (`app/robots.ts`)

- Allow all crawlers
- Sitemap URL: `https://www.sterlingpeak.uk/sitemap.xml`
- Disallow `/admin`

---

## ADMIN PANEL — COMPLETE SPECIFICATIONS

The admin panel is a **totally unique, modern dashboard** — NOT a generic Bootstrap/Material admin. It has a clean, minimal, almost Apple-like aesthetic with soft shadows, large border-radius, and lots of whitespace.

---

### ADMIN LOGIN PAGE (`app/(admin-auth)/admin/login/page.tsx`)

- Client Component
- Full-screen centered: `min-h-screen flex items-center justify-center bg-[#FAFAFA]`
- Card: `max-w-sm rounded-3xl bg-white p-10 shadow-[0_2px_20px_rgba(0,0,0,0.02)] border border-neutral-100`
- Logo centered at top
- H1: "Admin Sign In" — `text-[22px] font-semibold text-center tracking-tight`
- Email + Password inputs: `rounded-2xl h-12 bg-neutral-50/50 border-neutral-200`, focus ring: `ring-neutral-900`
- Submit button: `rounded-2xl h-12 bg-neutral-900 text-white font-medium`
- Error message: `text-sm text-red-500 text-center`
- Auth: `supabase.auth.signInWithPassword()`, on success redirect to `/admin`

---

### ADMIN LAYOUT (`app/admin/layout.tsx`)

- `min-h-screen bg-[#FAFAFA]` — the ENTIRE admin uses this off-white background
- `<AdminHeader />` component
- Main content: `pt-28 pb-16 px-6 md:px-10 lg:px-12 max-w-6xl mx-auto`

---

### ADMIN HEADER (`components/layout/AdminHeader.tsx`)

**Client Component.** A **floating, centered navigation bar** — NOT a traditional fixed sidebar or top bar.

**Desktop (md+):**
- Fixed, centered horizontally: `fixed top-6 left-1/2 -translate-x-1/2 z-50`
- **Hides on scroll down, shows on scroll up** (track `scrollY`, hide when scrolling down past 80px)
- Transition: `duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]`
- Container: `bg-white/80 backdrop-blur-xl border border-neutral-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-2xl p-1.5`
- Inside (flex, gap-2):
  - Logo (scaled 75%, with right border separator)
  - Nav links: Dashboard, Articles, Categories, Banners, Links, Subscribers
  - Each link: `px-4 py-2 rounded-xl text-sm font-medium`
  - Active: `bg-neutral-900 text-white shadow-sm`
  - Inactive: `text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900`
  - Logout button with LogOut icon

**Mobile (below md):**
- Fixed top: `fixed top-4 left-4 right-4 z-50`
- Same glass-morphism style: `bg-white/80 backdrop-blur-xl rounded-2xl`
- Logo left, hamburger (Menu icon) right
- Opens `<Sheet>` from top: `rounded-b-3xl`, stacked nav links + logout

---

### ADMIN DASHBOARD (`app/admin/page.tsx`)

- Server Component
- **Stats Cards:** 4 cards in a row — Published Articles, Draft Articles, Categories, Subscribers. Each shows label + count. Clean card style.
- **Quick Actions:** 2-card grid
  - "Create New Post": `bg-neutral-950 text-white rounded-2xl p-6`, icon in circle, title + description. Links to `/admin/articles/new`
  - "Import HTML": `bg-white border rounded-2xl p-6`, icon in circle, title + description. Links to `/admin/articles/upload-html`
- **Recent Articles Table:** `rounded-3xl border border-neutral-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]`
  - Columns: Title, Category, Status (badge), Date, Actions (Edit link)
  - Status badges: published = `bg-neutral-100 text-neutral-700`, draft = `bg-orange-50 text-orange-700`
  - "View all" link to `/admin/articles`

---

### ADMIN ARTICLES LIST (`app/admin/articles/page.tsx`)

- Client Component
- **Header:** "Articles" h1 + description + action buttons (Bulk Upload, Upload HTML, New Article)
- **Filters:** Search input + Category select + Status select (all/published/draft)
- **Table:** Same rounded-3xl style. Columns: Title, Category, Status (badge), Date, Actions (Edit + Delete)
- **Delete Confirmation:** shadcn Dialog with `rounded-3xl` styling, Cancel + Delete (red) buttons
- Debounced search (300ms delay)
- Client-side category filtering (since Supabase doesn't easily filter many-to-many in one query)

---

### ADMIN ARTICLE EDITOR (`app/admin/articles/new/page.tsx` and `app/admin/articles/[id]/page.tsx`)

**The article creation/editing form with these fields:**
- Title (text input)
- Slug (auto-generated from title, editable)
- Excerpt (textarea)
- Category (multi-select from categories list)
- Author Name (text input, default "Editorial Team")
- Featured toggle (checkbox)
- Status (draft/published select)
- Thumbnail URL (Cloudinary URL input — user uploads to Cloudinary separately and pastes URL)
- Meta Title (SEO override)
- Meta Description (SEO override)
- Read Time (number input, minutes)
- Published At (datetime picker)

**Rich Text Editor (`ArticleEditor.tsx`):**
- Tiptap editor with two tabs: "Visual Editor" and "HTML Editor"
- Tab bar: `rounded-none border-b`, active tab has bottom border line
- **Visual Editor toolbar:** Bold, Italic, Underline, H2, H3, Bullet List, Ordered List, Blockquote, Insert Table, Link (with popover), Image (with dialog for URL), Horizontal Rule, Code Block, Undo, Redo
- Each toolbar button: `p-2 rounded-xl`, active: `bg-neutral-100 shadow-sm`, inactive: `text-neutral-500 hover:bg-neutral-50`
- **Bubble Menu:** Appears on text selection with inline formatting options
- **Link Popover:** Dark popover (`bg-neutral-900/95 backdrop-blur-xl`) for entering URL
- **Image Dialog:** Dialog for entering Cloudinary image URL
- **HTML Editor:** Plain textarea with monospace font for raw HTML editing
- Editor wrapper: `rounded-3xl border border-neutral-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]`

---

### ADMIN CATEGORIES (`app/admin/categories/page.tsx`)

- List all categories with sort order
- Add new category (name, slug, description, sort_order)
- Edit existing categories
- Delete with confirmation

---

### ADMIN BANNERS (`app/admin/banners/page.tsx`)

- Client Component
- **Header:** "Banners" h1 + "New banner" button
- **Filters:** Slot select (from BANNER_SLOTS definitions) + Enabled filter (All/Enabled/Disabled)
- **Table:** Columns: Name, Slot (label), Enabled (Yes/No), Priority, Schedule, Device, Updated, Actions (Edit/Duplicate/Delete)
- **Banner Editor Form:** slot_key (picker component showing all available slots grouped by page), name, HTML textarea, embed_mode select, enabled toggle, priority, start/end dates, target_paths, exclude_paths, device select, notes

---

### ADMIN LINKS (`app/admin/links/page.tsx`)

- Manage affiliate redirect links
- Table: Slug, Destination, Label, Nofollow, Sponsored, Click Count, Actions
- Create/Edit form: slug, destination URL, label, nofollow toggle, sponsored toggle

---

### ADMIN SUBSCRIBERS (`app/admin/subscribers/page.tsx`)

- View all subscribers: email, subscribed status, created_at
- Ability to export as CSV
- Toggle subscribed status
- Delete subscriber

---

## ADMIN PANEL DESIGN SYSTEM

These rules apply to ALL admin pages:

- **Background:** `bg-[#FAFAFA]` everywhere
- **Cards/Tables:** `rounded-3xl border border-neutral-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)]`
- **Buttons (primary):** `rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 border border-neutral-800 ring-1 ring-inset ring-white/10`
- **Buttons (secondary):** `rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 ring-1 ring-black/5`
- **Buttons (destructive):** `rounded-xl bg-red-600 text-white hover:bg-red-700`
- **Inputs:** `rounded-2xl h-10 bg-white border-neutral-200 focus-visible:ring-1 focus-visible:ring-neutral-900`
- **Select triggers:** `rounded-2xl h-10 bg-white border-neutral-200`
- **Dialogs:** `rounded-3xl border-neutral-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]`
- **Table headers:** `bg-neutral-50/50`, `font-medium text-neutral-500 h-12`
- **Table rows:** `border-b-neutral-100 hover:bg-neutral-50/50`
- **Status badges:** published = `bg-neutral-100 text-neutral-700`, draft = `bg-orange-50 text-orange-700`
- **Typography:** h1 = `text-3xl font-semibold text-neutral-900 tracking-tight`, descriptions = `text-neutral-500`
- **No dark mode.** Everything is light with ultra-subtle shadows.

---

## SEO REQUIREMENTS

1. Every page has unique `<title>` and `<meta description>`
2. Canonical URLs on all pages via `alternates.canonical`
3. OpenGraph + Twitter Card metadata on all pages
4. JSON-LD structured data: Organization + WebSite (global), Article schema (per article)
5. Dynamic `sitemap.xml` including all published articles
6. Dynamic `robots.txt` disallowing `/admin`
7. RSS feed at `/rss.xml`
8. Semantic HTML: proper heading hierarchy, `<article>`, `<nav>`, `<main>`, `<footer>`, `<aside>`
9. All images have `alt` text
10. External links in article content get `data-external="true"` attribute for visual indicator

---

## IMAGE HANDLING (CLOUDINARY)

- All article thumbnails are Cloudinary URLs
- Configure `next.config.ts`:
```ts
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'res.cloudinary.com' },
  ],
}
```
- Use `next/image` `<Image>` component with `quality={90}`, appropriate `sizes` prop, `width`/`height` matching aspect ratio
- Thumbnails: 16:9 aspect ratio for hero/cards, 3:2 for highlight sections
- Admin users upload images to Cloudinary manually and paste the URL into the article editor

---

## PERFORMANCE REQUIREMENTS

1. Use Server Components by default. Client Components only for interactivity (forms, nav state, scroll tracking).
2. `priority` prop on hero/lead images (above the fold).
3. Lazy load below-fold images and banner iframes.
4. Debounce search inputs (300ms).
5. Use `Promise.all` for parallel data fetching in dashboard.
6. Proper `sizes` attribute on all `<Image>` components.
7. Minimal client-side JavaScript — no unnecessary `"use client"`.

---

## IMPORTANT DESIGN NOTES

1. **This website must NOT look generic.** No default shadcn themes. No Bootstrap vibes. It should feel like a custom-designed editorial platform.
2. **Typography IS the design.** Heavy use of font-black, tight tracking, varied sizes creates visual hierarchy without needing colors or decorations.
3. **The dark navbar pill** is the signature UI element — it floats over content and gives the site a distinctive look.
4. **The admin panel** has a completely different design language from the public site — frosted glass floating header, Apple-like card aesthetics, ultra-clean.
5. **No emojis** anywhere unless explicitly requested.
6. **No dark mode.** Light only.
7. **Monochromatic palette** — the restraint is what makes it premium.
8. **Every border-radius** in admin is large (2xl, 3xl) — giving everything a soft, modern feel.
9. **Shadows are minimal** — `shadow-sm` or custom subtle shadows only.
10. **The contact page** is the one "wow" page with its dark/light split and neon-lime accent — intentionally different from the rest.
