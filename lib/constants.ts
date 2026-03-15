export const SITE_NAME = "Coffer Notes";
export const SITE_TAGLINE = "UK small business finance, explained properly.";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://coffernotes.com";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
] as const;

export const CATEGORIES = [
  {
    name: "Accounting",
    slug: "accounting",
    description:
      "Bookkeeping fundamentals, cloud software, bank reconciliation, digital records, and keeping your books clean.",
  },
  {
    name: "Getting Paid",
    slug: "getting-paid",
    description:
      "How to invoice properly, collect faster, and fix the mistakes that keep your money stuck with clients.",
  },
  {
    name: "Payroll",
    slug: "payroll",
    description:
      "PAYE setup, RTI filing, pension auto-enrolment, wage calculations, and avoiding HMRC payroll fines.",
  },
  {
    name: "People & Leave",
    slug: "people-leave",
    description:
      "Employee leave, absence tracking, statutory pay, HR compliance, and managing people without a full HR team.",
  },
  {
    name: "Numbers & Insights",
    slug: "numbers-insights",
    description:
      "Profit and loss, cash flow reports, financial dashboards, and understanding what your numbers mean.",
  },
  {
    name: "Tax & MTD",
    slug: "tax-mtd",
    description:
      "VAT returns, Making Tax Digital, Self Assessment, quarterly updates, and UK tax deadlines that matter.",
  },
] as const;
