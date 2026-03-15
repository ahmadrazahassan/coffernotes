import Link from "next/link";

const TOPICS = [
  { label: "Making Tax Digital", href: "/tax-mtd" },
  { label: "Cloud Accounting", href: "/accounting" },
  { label: "HMRC Penalties", href: "/tax-mtd" },
  { label: "VAT Returns", href: "/tax-mtd" },
  { label: "Late Payment", href: "/getting-paid" },
  { label: "SSP & Sick Pay", href: "/people-leave" },
  { label: "Digital Records", href: "/accounting" },
  { label: "Auto-Enrolment", href: "/payroll" },
  { label: "Cash Flow", href: "/numbers-insights" },
  { label: "Statutory Leave", href: "/people-leave" },
  { label: "Bank Reconciliation", href: "/accounting" },
  { label: "Self Assessment", href: "/tax-mtd" },
  { label: "RTI Filing", href: "/payroll" },
  { label: "P&L Reports", href: "/numbers-insights" },
];

export function TrustedTopics() {
  return (
    <section className="py-10 border-y border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary whitespace-nowrap flex-shrink-0">
            Popular topics
          </p>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((topic) => (
              <Link
                key={topic.label}
                href={topic.href}
                className="rounded-md bg-surface px-3 py-1 text-[12px] font-medium text-text-primary hover:bg-tag-bg hover:text-brand-accent transition-colors"
              >
                {topic.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
