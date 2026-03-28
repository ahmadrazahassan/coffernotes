import type { Metadata } from "next";
import {
  CATEGORIES,
  SITE_CONTACT_EMAIL,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";
import { Mail } from "lucide-react";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK;

export const metadata: Metadata = {
  title: "About",
  description: SITE_META_DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: `About | ${SITE_NAME}`,
    description: SITE_META_DESCRIPTION,
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
        About {SITE_NAME}
      </h1>
      <p className="text-lg text-text-secondary mt-6 leading-relaxed">
        {SITE_NAME} publishes independent reviews and comparisons of small business
        accounting software used in the UK. Our focus is practical buying guidance
        for owners and finance teams evaluating Sage, Xero, QuickBooks, and related
        tools — grounded in real workflows, compliance context, and transparent
        methodology.
      </p>

      <h2 className="text-2xl font-bold mt-12">Our mission</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Choosing accounting software affects VAT, payroll, reporting, and how
        confidently you can close the month. {SITE_NAME} exists to reduce guesswork
        by explaining what matters, what differs between products, and what to verify
        before you commit.
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

      <h2 id="editorial" className="text-2xl font-bold mt-12">
        Our editorial approach
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Reviews are structured around consistent criteria: setup and onboarding,
        everyday bookkeeping, payroll and compliance touchpoints, reporting,
        integrations, and support. We reference HMRC and GOV.UK where tax and
        filing context matters, and we use official product names and current
        feature terminology — especially for Sage — so comparisons stay accurate
        for professional readers.
      </p>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        {SITE_NAME} does not accept payment for editorial coverage. When we
        recommend a product, we state the rationale and the limitations clearly.
      </p>

      <h2 id="contact" className="text-2xl font-bold mt-12">
        Connect with us
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        For corrections, methodology questions, or partnership enquiries, contact
        us by email.
      </p>
      <div className="flex flex-wrap gap-4 mt-6">
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium text-text-primary hover:bg-surface hover:border-text-secondary/30 transition-colors"
          aria-label="Email"
        >
          <Mail className="h-5 w-5" />
          {SITE_CONTACT_EMAIL}
        </a>
      </div>
    </div>
  );
}
