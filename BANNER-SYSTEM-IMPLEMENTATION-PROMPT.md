# Banner & Ad Slot System — Senior Implementation Spec (Reuse This Prompt)

> **Purpose:** Give this entire document to an AI or engineering team to implement a **production-grade, publisher-style banner system** for a Next.js 16 + Supabase + React 19 site (same stack as Finlytic / FundSteer).  
> **Constraints from product owner:**  
> - Integrate banners across the site the way **large finance / editorial publishers** do (hero-adjacent, in-feed, in-article, sticky units, etc.).  
> - **Do not render any visible placeholder, skeleton, “Advertisement” box outline, or empty grey blocks** when no active banner exists for a slot — the DOM should contribute **zero layout** (no reserved height, no borders, no “Ad” labels unless the inserted creative itself contains them).  
> - **Admin:** add a dedicated **`/admin/banners`** area to manage **all slot types**; allow pasting **raw HTML snippets** (and optionally script-bearing tags where policy allows) exactly as ad networks deliver them.  
> - When a banner is **active** for a slot, it must appear on the public site **cleanly and professionally** (including inside article bodies).

---

## 1. Goals & Non-Goals

### Goals

1. **Slot-based inventory:** Define named **placements** (e.g. `global_top_leaderboard`, `home_below_hero`, `article_in_content_1`) that map to real positions in layouts.  
2. **Admin-managed creatives:** Store **per-banner** metadata + **embed HTML** (and optional notes). Support **scheduling**, **enable/disable**, **sort priority**, and **optional page/route targeting**.  
3. **Zero visual noise when empty:** If no eligible banner for a slot, **render nothing** — no wrapper with min-height, no dashed border, no “Coming soon”.  
4. **Article integration:** Support **in-article** slots either as **fixed positions** (after N paragraphs) **or** as **marker-based** insertion (optional phase 2: `<!-- BANNER:article_mid -->` in CMS HTML).  
5. **Performance & UX:** Lazy-load where appropriate, avoid hurting **LCP/CLS**, do not block main thread for below-the-fold units.  
6. **Security posture:** Document and implement a **clear policy** for raw HTML vs iframes vs CSP (see §6).

### Non-Goals (initial release)

- Building a custom ad server or real-time bidding.  
- User-facing “ad preferences” or GDPR consent UI (can be stubbed with a TODO if the site adds CMP later).  
- Showing placeholders or dummy ads in dev — **still no placeholders**; use seed data in DB if designers need to test.

---

## 2. Placement Taxonomy (Match “Big Publisher” Patterns)

Implement these **slot keys** as a **typed enum** in code (and `CHECK` or lookup in DB). Finance/editorial sites commonly use:

| Slot key | Typical use | Notes |
|----------|-------------|--------|
| `global_top_leaderboard` | Full-width strip **above** main nav or **below** sticky header | Often 970×90 / 728×90 desktop; collapses on mobile |
| `home_hero_rail` | **Beside or under** hero lead story (desktop rail) | Optional; only render if layout has rail |
| `home_below_hero` | First full-width unit after hero | High viewability |
| `home_mid_feed` | Between category blocks or after 2nd `CategoryArticlesBlock` | In-feed “native” style |
| `home_above_newsletter` | Directly above newsletter section | Conversion adjacency |
| `category_below_header` | Under category H1/description | Contextual |
| `category_in_grid` | After first row of cards (e.g. after 3rd card) | Mimics sponsored row |
| `article_below_header` | After `ArticleHeader`, before body | Premium placement |
| `article_in_content_1` | After **~3rd paragraph** (or first `</p>` cluster) | Standard mid-article |
| `article_in_content_2` | After **~7th paragraph** | Second mid placement |
| `article_below_content` | After article body, before related | |
| `sidebar_sticky` | Sticky aside on article (if layout adds sidebar) | Desktop-only; omit on mobile |
| `footer_above` | Above site footer inside main layout | |
| `global_anchor` | Optional fixed bottom sticky (mobile) | Use sparingly; respect `prefers-reduced-motion` |

**Rule:** The implementing agent must **wire each slot** into the actual components (`HeroSection`, `CategoryArticlesBlock`, `[category]/page.tsx`, `[slug]/page.tsx`, `layout` regions) **without** adding empty wrappers when inactive.

---

## 3. Data Model (Supabase)

### Table: `banner_slots` (optional normalization)

Either **hardcode slots in the app** (recommended v1) **or** a small reference table:

- `id`, `key` (TEXT UNIQUE), `label`, `description`, `sort_order`

### Table: `banners` (required)

| Column | Type | Notes |
|--------|------|--------|
| `id` | UUID PK | |
| `slot_key` | TEXT NOT NULL | Must match app enum |
| `name` | TEXT NOT NULL | Admin-only label, e.g. “Q1 Sage — leaderboard” |
| `html` | TEXT NOT NULL | Full snippet to inject (may include `<script>`, `<ins class="adsbygoogle">`, etc.) |
| `enabled` | BOOLEAN DEFAULT true | |
| `priority` | INT DEFAULT 0 | Higher wins when multiple active in same slot |
| `starts_at` | TIMESTAMPTZ NULL | NULL = immediately |
| `ends_at` | TIMESTAMPTZ NULL | NULL = no end |
| `target_paths` | TEXT[] NULL | Optional: path prefixes e.g. `{"/","/accounting"}`; NULL = all public pages |
| `exclude_paths` | TEXT[] NULL | Optional: e.g. `{"/about","/privacy"}` |
| `device` | TEXT DEFAULT `'all'` CHECK IN (`all`,`desktop`,`mobile`) | |
| `notes` | TEXT NULL | Internal only, not rendered |
| `created_at` / `updated_at` | TIMESTAMPTZ | |

**Indexes:**

- `(slot_key, enabled, starts_at, ends_at)` partial where `enabled = true`  
- `priority DESC` for selection ordering  

**Selection logic (server or edge):** For a given `slot_key` + current path + user agent width (if `device` used):

1. Filter `enabled = true`, date window OK, path allowed, device OK.  
2. Order by `priority DESC`, `updated_at DESC`.  
3. Take **first** row. If none → return **null** (render nothing).

### RLS

- **Public:** `SELECT` only for rows that are `enabled` and within schedule (use a **SECURITY DEFINER** view or filter in app — RLS cannot easily express “now() between starts and ends” for anon without a view).  
  - **Recommended v1:** RLS `SELECT` for `anon` **denied** on `banners`; fetch banners **only via server component** using **service role** is **not** ideal for caching. Better: **`banners_public` view** that exposes only safe columns and filters `enabled` + dates, with `SELECT` for `anon`.  
- **Authenticated (admin):** full CRUD on `banners`.

Document the chosen approach in a SQL migration file.

---

## 4. Admin Panel: `/admin/banners`

### UX Requirements (high-end)

1. **List view:** Table of all banners — columns: Name, Slot, Enabled, Priority, Schedule, Device, Last updated, Actions (Edit / Duplicate / Delete).  
2. **Filters:** By slot, enabled, date range.  
3. **Create / Edit form:**  
   - **Slot:** `<Select>` populated from the same enum as the frontend.  
   - **Name:** text.  
   - **HTML embed:** large `<Textarea>` or monospace editor with **line numbers optional**; min-height ~240px; helper text: “Paste the full snippet from your ad network (e.g. GPT, AdSense, sponsored widget).”  
   - **Scheduling:** datetime or date pickers for start/end (optional empty = always).  
   - **Targeting:** multi-line or chips for path prefixes (optional).  
   - **Exclude paths:** same.  
   - **Device:** All / Desktop / Mobile.  
   - **Priority:** number.  
   - **Enabled:** toggle.  
4. **Preview (admin-only):** A collapsible “Preview” panel that renders the HTML in a **sandboxed iframe** (`srcDoc` or `blob:`) **on the admin page only** — **never** execute arbitrary scripts in the main admin document. Label: “Preview may not match live site; scripts are isolated here.”  
5. **Duplicate:** One-click clone for A/B rotations (same slot, different priority).  
6. **No placeholder creatives:** Admin should not have a “empty banner” type — empty `html` should fail validation on save.

### Technical

- **Client components** + Supabase browser client (consistent with rest of admin).  
- Toast success/error; validate `slot_key` against allowed keys.  
- Strip BOM; optional max length on `html` (e.g. 512KB) to avoid abuse.

---

## 5. Public Site Integration (Next.js)

### 5.1 Core component: `<BannerSlot slotKey="..." />`

- **Server Component preferred** when HTML is **static** (no `document.write`, no external script execution requirement).  
- For snippets that **require client-side script execution** (Google AdSense, GAM, etc.), use a dedicated **client** component, e.g. `<BannerSlotClient slotKey="..." />`, that:  
  - Fetches resolved HTML via a **Server Action** or **RSC payload** (pass HTML from server parent as prop **only if** policy allows).  
  - Injects via `ref` + `innerHTML` **or** iframe `srcDoc` (see §6).  
- **When resolved banner is null or `html` is whitespace-only:** return **`null`** — no fragment, no `div` with className.

### 5.2 Where to mount slots (must match §2)

- **Root layout or page wrapper:** `global_top_leaderboard`, `footer_above` — only if design allows without breaking sticky nav.  
- **`HeroSection`:** `home_below_hero` after the hero grid; `home_hero_rail` inside layout if a rail exists.  
- **`page.tsx` (home):** `home_mid_feed`, `home_above_newsletter` between existing sections.  
- **`[category]/page.tsx`:** `category_below_header`, `category_in_grid`.  
- **`[category]/[slug]/page.tsx`:** `article_below_header`; pass article body into a **server-side splitter** for `article_in_content_*`; `article_below_content` before related + newsletter.

### 5.3 In-article insertion (professional)

Implement a **pure function** `injectBannerIntoArticleHtml(html: string, banners: { afterParagraphIndex: number; snippet: string }[]): string` that:

- Parses HTML **safely** (use a server-side HTML parser, e.g. `node-html-parser` or similar) **or** splits on closing `</p>` with a robust regex fallback **documented as best-effort**.  
- Inserts **wrapper-free** or **minimal** wrapper: e.g. `<aside class="banner-slot" data-slot="article_in_content_1" aria-hidden="true">...</aside>` **only when** snippet non-empty — but **user asked for no visible placeholder**: the aside should have **no min-height**, no border, no background; class only for analytics.  
- **Alternative:** inject **only** the pasted HTML with a single wrapping `<div class="contents">` if needed for valid DOM.

**Important:** Article body is also sanitized on read in `ArticleContent` — **banner HTML must not be double-stripped**. Recommended approach:

- **Split article:** Render `ArticleContent` for each **segment** between banner insertions, **or**  
- **Merge banners at render time** in the **server component** and pass **one** combined string to a **single** sanitizer that **allows** the specific wrapper + ad iframe classes (high risk).  
- **Preferred:** **Array of blocks** `{ type: 'html' | 'banner', value }` assembled on server, then map to components: `ArticleContent` for html chunks, `BannerEmbed` for banner chunks. **No placeholder** if banner chunk resolves empty — **omit the block entirely**.

### 5.4 Performance

- **Below the fold:** `loading="lazy"` for iframes; `dynamic import` for heavy client banner code.  
- Use `fetch` with `next: { revalidate: 60 }` or tag-based revalidation when banners change (optional).  
- Avoid layout shift: if the network provides fixed sizes, encourage admin to paste wrappers with **explicit width/height** in notes (documentation only; no forced UI).

### 5.5 Analytics (optional)

- `data-banner-id` on wrapper for GTM triggers.  
- Do not add visible “Advertisement” unless required by law or the creative includes it — user explicitly requested no placeholders; **legal label** can be part of pasted HTML when needed.

---

## 6. Security & CSP (Mandatory Design Section)

Raw HTML from admins can contain `<script>`. Next.js/React discourage `dangerouslySetInnerHTML` for scripts (scripts don’t execute when injected via innerHTML in many cases).

**Document two supported modes** (admin selects per banner or global default):

1. **Iframe mode (recommended for third-party ads):** Wrap pasted snippet in a **sandboxed iframe** with `sandbox` attributes tightened as much as possible while still allowing the ad to load; use `srcDoc` with base tag if needed. **Scripts run inside iframe**, not on parent page.  
2. **Trusted script mode (advanced):** Load known scripts via **next/script** with **nonce** (requires CSP nonce pipeline) — only for vetted networks.

**Sanitization:** Do **not** run DOMPurify on ad HTML if it strips `script`/`iframe` needed for the ad — **iframe isolation** is the mitigation.

**Admin audit:** Log `updated_at` and optional `updated_by` (if profiles exist).

---

## 7. Types & Constants

- `types/banners.ts`: `BannerSlotKey` union type, `Banner` interface.  
- `lib/banner-slots.ts`: metadata `{ key, label, description }[]` for admin select + docs.

---

## 8. Files to Create / Touch (Checklist for Implementer)

- `supabase/migrations/xxxx_banners.sql` — tables, indexes, RLS, optional view.  
- `types/banners.ts`  
- `lib/banner-slots.ts`  
- `lib/banners/resolve.ts` — `getBannerForSlot(slotKey, { pathname, isMobile })`  
- `components/banners/BannerSlot.tsx` (server)  
- `components/banners/BannerSlotClient.tsx` (client + iframe/srcDoc)  
- `components/banners/ArticleBannerBlocks.tsx` — maps blocks to renderers  
- `app/admin/banners/page.tsx` — list + dialogs  
- `app/admin/banners/[id]/page.tsx` OR single-page modal pattern — edit form  
- Update `components/layout/AdminHeader.tsx` NAV_ITEMS with **Banners** link.  
- Wire slots into: `app/layout.tsx` (careful), `app/page.tsx`, `components/home/*`, `app/[category]/page.tsx`, `app/[category]/[slug]/page.tsx`.

---

## 9. Acceptance Criteria

1. **`/admin/banners`** CRUD works; only authenticated users can access (existing middleware).  
2. Creating a banner for `home_below_hero` with real HTML shows it on the homepage **only when** enabled and in schedule.  
3. Disabling or deleting the banner removes it with **no** residual spacing or placeholder.  
4. In-article banners appear at configured paragraph offsets **without** breaking existing DOMPurify behavior for normal paragraphs.  
5. Lighthouse: no **massive** CLS regression vs baseline (document before/after).  
6. README or comment block explains **iframe vs raw** security model for stakeholders.

---

## 10. One-Paragraph “Executive” Prompt (Paste Into Chat)

> Implement a Supabase-backed **banner slot system** for our Next.js 16 App Router site: add `banners` table with `slot_key`, pasted **embed HTML**, scheduling, priority, optional path/device targeting, and RLS. Build **`/admin/banners`** to list/create/edit/duplicate/delete with a **sandboxed iframe preview** on admin only. On the public site, add a **`BannerSlot` component** that resolves the active banner per slot and renders **nothing** (no placeholder, no empty box, no reserved height) when none exists. Wire **publisher-style placements** across home, category, and article pages, and support **in-article** inserts via **server-assembled content blocks** so we don’t break DOMPurify. Use **iframe-based embedding** by default for third-party ad scripts for security. Add **Banners** to the admin nav. No visible ad placeholders anywhere until real creatives exist in the database.

---

*End of specification.*
