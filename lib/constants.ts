/**
 * Image quality for article thumbnails (1–100).
 * Use 90+ for sharp, HD thumbnails; Next.js default is 75.
 */
export const THUMBNAIL_IMAGE_QUALITY = 90;

/** Public site brand (display + SEO). */
export const SITE_NAME = "Finlytic";

export const SITE_TAGLINE =
  "Smart accounting software reviews for UK small businesses.";

export const SITE_META_DESCRIPTION =
  "Finlytic is an independent UK review and comparison site for small business accounting software — Sage, Xero, and QuickBooks.";

/** Canonical base URL when `NEXT_PUBLIC_SITE_URL` is unset. */
export const SITE_URL_FALLBACK = "https://www.finlytic.uk";

export const SITE_CONTACT_EMAIL = "info@finlytic.uk";

/** Shown on Privacy Policy and Terms of Use (update when legal text changes). */
export const LEGAL_EFFECTIVE_DATE = "30 March 2026";

export const FOOTER_TAGLINE =
  "Independent accounting software reviews for UK businesses.";

/**
 * Static category list for nav, footer, and CTAs.
 * Must match seeded categories in supabase/schema.sql.
 */
export const CATEGORIES = [
  { name: "Comparisons", slug: "comparisons", description: "Head-to-head comparisons, in-depth product reviews, and buyer guides for Sage, Xero, QuickBooks, and other UK accounting software." },
  { name: "Accounting", slug: "accounting", description: "Bookkeeping fundamentals, cloud software, bank reconciliation, digital records, and keeping your books clean." },
  { name: "Getting Paid", slug: "getting-paid", description: "How to invoice properly, collect faster, and fix the mistakes that keep your money stuck with clients." },
  { name: "Payroll", slug: "payroll", description: "PAYE setup, RTI filing, pension auto-enrolment, wage calculations, and avoiding HMRC payroll fines." },
  { name: "People & Leave", slug: "people-leave", description: "Employee leave, absence tracking, statutory pay, HR compliance, and managing people without a full HR team." },
  { name: "Numbers & Insights", slug: "numbers-insights", description: "Profit and loss, cash flow reports, financial dashboards, and understanding what your numbers mean." },
  { name: "Tax & MTD", slug: "tax-mtd", description: "VAT returns, Making Tax Digital, Self Assessment, quarterly updates, and UK tax deadlines that matter." },
] as const;
