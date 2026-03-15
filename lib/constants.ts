/**
 * Image quality for article thumbnails (1–100).
 * Use 90+ for sharp, HD thumbnails; Next.js default is 75.
 */
export const THUMBNAIL_IMAGE_QUALITY = 90;

/**
 * Static category list for nav, footer, and CTAs.
 * Must match seeded categories in supabase/schema.sql.
 */
export const CATEGORIES = [
  { name: "Accounting", slug: "accounting", description: "Bookkeeping fundamentals, cloud software, bank reconciliation, digital records, and keeping your books clean." },
  { name: "Getting Paid", slug: "getting-paid", description: "How to invoice properly, collect faster, and fix the mistakes that keep your money stuck with clients." },
  { name: "Payroll", slug: "payroll", description: "PAYE setup, RTI filing, pension auto-enrolment, wage calculations, and avoiding HMRC payroll fines." },
  { name: "People & Leave", slug: "people-leave", description: "Employee leave, absence tracking, statutory pay, HR compliance, and managing people without a full HR team." },
  { name: "Numbers & Insights", slug: "numbers-insights", description: "Profit and loss, cash flow reports, financial dashboards, and understanding what your numbers mean." },
  { name: "Tax & MTD", slug: "tax-mtd", description: "VAT returns, Making Tax Digital, Self Assessment, quarterly updates, and UK tax deadlines that matter." },
] as const;
