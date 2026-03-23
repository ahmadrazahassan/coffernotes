# Crestwell UI/UX Direction

Premium, high-trust, conversion-focused product design blueprint for Crestwell across public site and admin platform.

## Brand Design Intent

Crestwell should feel like a serious fintech editorial and operations product:

- premium but restrained
- modern but timeless
- structured and data-first
- executive and compliance-friendly
- minimal without looking empty

Core principle: **Editorial clarity + Product precision + Financial trust**.

---

## Homepage UI Blueprint

## 1) Navigation (Sticky Header)

- Height: `72px` desktop, `64px` mobile
- Structure: logo left, category-led nav center, primary CTA right
- Surface: solid light background (`#FCFDFB`) with subtle 1px border (`#E6EAE7`)
- Link style: uppercase, `text-[12px]`, tracking `[0.08em]`, semibold
- Primary CTA: `Subscribe` (filled)
- Secondary utility link: `Admin Login` (quiet text)

## 2) Hero Section

- Grid: 12 columns (`7/5` split desktop)
- Left: value proposition, supporting copy, dual CTA
- Right: “Crestwell Brief” panel with real insight snippets and update timestamp
- Headline: `text-5xl` desktop / `text-3xl` mobile, max 2 lines
- Body copy width: max `62ch`
- Trust strip under CTA: HMRC-referenced, Sage naming verified, updated cadence

Primary CTA:
- Label: `Get Weekly Briefing`
- Background: `#173F35`
- Text: `#F7FAF8`
- Hover: `#12352C`

Secondary CTA:
- Label: `Explore Categories`
- Surface: white with border `#C9D3CE`
- Hover: `#F2F5F3`

## 3) Homepage Sections (Top to Bottom)

1. Sticky navigation
2. Hero (split layout)
3. Trust rail (method + source proof)
4. Featured analysis (3 cards)
5. Category intelligence grid (6 cards)
6. Editorial standards section
7. Metrics strip (operational trust)
8. Latest articles stream
9. Newsletter conversion band
10. Governance-focused footer

## 4) Card System (Homepage)

- Feature card: `20px` radius, `24px` padding
- Category card: `16px` radius, compact metadata + count
- Insight card: metric + delta + timestamp
- Article card: 16:9 thumbnail, source/date/read-time row

## 5) Iconography and Visual Language

- Monoline geometric icons
- Uniform stroke weight (`1.75`)
- No generic fintech clichés (coins, dollar signs, stock arrows)
- Purposeful symbols only (governance, scheduling, controls, documentation)

## 6) Trust-Creation Patterns

- Source labels (`HMRC`, `GOV.UK`, `Reviewed`)
- Last-updated timestamps
- Author/reviewer metadata
- Data-backed proof blocks instead of decorative testimonials

---

## Admin Panel UI Blueprint

## 1) Layout Architecture

- Desktop shell: fixed sidebar + topbar + content canvas
- Sidebar width: `272px`
- Topbar height: `64px`
- Content area: `px-8 py-8` with fluid width

## 2) Sidebar

- Background: `#0F1714`
- Active item: `#173F35` with 3px leading indicator
- Nav row height: `40px`
- Section labels: uppercase, 11px, wide tracking

Sections:
- Overview
- Content
- Categories
- Subscribers
- Reports
- Settings

## 3) Topbar

- Left: breadcrumb + page title
- Right: date range + quick actions + profile menu
- Surface: white with subtle bottom border

## 4) Dashboard Composition

1. KPI cards row (4)
2. Performance chart + activity feed split
3. Content health table
4. Pending review/compliance tasks
5. Subscriber trend widgets

## 5) Data Table Style

- Header: uppercase 11px muted text
- Row height: `52px`
- Horizontal separators only
- Hover state: `#F8FAF9`
- Sticky header for long tables
- Status chip near start of row for quick scanning

## 6) Admin Forms

- 2-column desktop structure (`7/5`)
- Left: core content/editor fields
- Right: metadata, publishing, SEO, status
- Inputs: consistent heights and spacing
- Inline validation below field (not color-only)

## 7) Status and Feedback System

Status colors:
- Draft: `#667085`
- In Review: `#B54708`
- Published: `#027A48`
- Archived: `#475467`
- Error: `#B42318`

Feedback:
- Toasts for lightweight success/failure
- Inline alert banners for blocking issues
- Explicit empty states with next actions

---

## Crestwell Design System

## Colors

- Primary: `#173F35`
- Primary hover: `#12352C`
- Secondary graphite: `#1F2A26`
- Accent emerald: `#1F7A5A`
- Background base: `#FCFDFB`
- Background soft: `#F7F9F7`
- Surface: `#FFFFFF`
- Border: `#E6EAE7`
- Text primary: `#111927`
- Text secondary: `#475467`
- Text tertiary: `#667085`
- Success: `#027A48`
- Warning: `#B54708`
- Error: `#B42318`
- Info: `#175CD3`

## Typography

- Headings/UI: Inter
- Long-form editorial: Source Sans 3 (or Inter if single-family only)

Scale:
- H1: `56/64`
- H2: `40/48`
- H3: `30/38`
- H4: `24/32`
- H5: `20/28`
- Body L: `18/30`
- Body M: `16/26`
- Body S: `14/22`
- Caption: `12/18`

## Spacing and Layout

- Base spacing unit: `4px`
- Section vertical spacing: `96px desktop`, `72px tablet`, `56px mobile`
- Container max width: `1240px`
- Grid: 12 cols desktop, 8 tablet, 4 mobile
- Desktop gutter: `24px`

## Radius and Shadow

- Radius scale: `8 / 10 / 12 / 16 / 20`
- Default control radius: `12px`

Shadow scale:
- Sm: `0 1px 2px rgba(16,24,40,0.06)`
- Md: `0 8px 20px rgba(16,24,40,0.08)`
- Lg: `0 16px 32px rgba(16,24,40,0.10)`

## Component Sizing

- Button heights: `36 / 40 / 44`
- Input height: `40`
- Textarea min-height: `112`
- Table row: `52`
- Card padding: `24`

---

## Reusable Component Inventory

- AppShell (sidebar + topbar + content)
- TopNav, SidebarNav, Breadcrumbs
- KpiCard, InsightCard, MetricDelta
- ArticleCard, CategoryCard, SourceTag
- DataTable, TableToolbar, FilterChips, Pagination
- StatusBadge, PriorityBadge
- FormSectionCard, FieldRow, InlineValidation
- EmptyState, InlineAlert, Toast
- DateRangePicker, SearchInput, Select
- NewsletterBlock, FooterGovernance

---

## Implementation Guidance (Next.js + Tailwind)

- Define design tokens in `app/globals.css` as CSS variables
- Map tokens to utility classes via Tailwind config/theme
- Build primitives first: `Container`, `Section`, `Grid`, `Card`
- Use CVA/variant pattern for buttons, badges, alerts, inputs
- Keep one status color map shared across public and admin
- Create `/admin/ui-kit` page to verify all states consistently

---

## Premium UX Rules

- One primary action per section
- Always show clear state: loading, empty, error, success
- Every empty state includes a meaningful next step
- Preserve metadata density to avoid template look
- Avoid decorative animation and visual noise
- Keep copy precise and operational, not vague

---

## Mistakes to Avoid

- Generic marketing hero with no proof
- Repetitive cards with no data context
- Inconsistent radius, spacing, and heading rhythm
- Overly bright startup-style color usage
- Charts with no decisions attached
- Color-only status without text labels
- Excessive shadows or animation

---

## Final Consistency Checklist

- [ ] Unified token system across public and admin
- [ ] Shared spacing and radius scale applied globally
- [ ] All CTAs follow primary/secondary hierarchy
- [ ] All data views include loading/empty/error states
- [ ] Status labels and colors are consistent
- [ ] Mobile breakpoints preserve hierarchy and usability
- [ ] No gradients and no decorative animations in core UI
- [ ] Footer/header/admin all align with premium Crestwell tone
