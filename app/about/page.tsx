import type { Metadata } from "next";
import { CATEGORIES } from "@/lib/constants";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.coffernotes.com";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Coffer Notes — a UK small business finance publication covering accounting, payroll, tax, and more.",
  alternates: { canonical: `${BASE_URL}/about` },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
        About Coffer Notes
      </h1>
      <p className="text-lg text-text-secondary mt-6 leading-relaxed">
        Coffer Notes is an independent editorial publication focused on UK small
        business finance. We write practical, in-depth guides on accounting,
        invoicing, payroll, people management, financial reporting, and tax
        compliance.
      </p>

      <h2 className="text-2xl font-bold mt-12">Our mission</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Running a small business in the UK means dealing with HMRC deadlines,
        payroll obligations, VAT returns, and dozens of financial tasks that
        don&apos;t come with clear instructions. Coffer Notes exists to fill
        that gap &mdash; we turn complex regulations into step-by-step guidance
        that business owners can actually follow.
      </p>

      <h2 className="text-2xl font-bold mt-12">What we cover</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="rounded-2xl border border-border p-6 bg-surface"
          >
            <h3 className="font-bold">{cat.name}</h3>
            <p className="text-sm text-text-secondary mt-1">
              {cat.description}
            </p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12">Our editorial approach</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Every article is researched against current HMRC guidance, legislation,
        and official thresholds. We avoid jargon, include worked examples, and
        structure content with tables, checklists, and clear headings so you can
        find what you need quickly.
      </p>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We don&apos;t accept payment for editorial coverage. When we recommend
        software or services, it&apos;s because we genuinely believe they help
        small businesses manage their finances more effectively.
      </p>
    </div>
  );
}
