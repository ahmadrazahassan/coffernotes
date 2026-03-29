import type { Metadata } from "next";
import Link from "next/link";
import {
  LEGAL_EFFECTIVE_DATE,
  SITE_CONTACT_EMAIL,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK;

export const metadata: Metadata = {
  title: "Affiliate Disclosure",
  description: `How ${SITE_NAME} earns revenue through affiliate partnerships, including our commitment to editorial independence and transparency.`,
  alternates: { canonical: `${BASE_URL}/affiliate-disclosure` },
  openGraph: {
    title: `Affiliate Disclosure | ${SITE_NAME}`,
    description: `Transparency about how ${SITE_NAME} earns revenue through affiliate partnerships.`,
    url: `${BASE_URL}/affiliate-disclosure`,
  },
};

export default function AffiliateDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <p className="text-sm text-text-secondary">
        Effective {LEGAL_EFFECTIVE_DATE}
      </p>
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2">
        Affiliate Disclosure
      </h1>
      <p className="text-lg text-text-secondary mt-6 leading-relaxed">
        Transparency is central to everything we publish. This page explains how{" "}
        {SITE_NAME} earns revenue, how affiliate relationships work, and why
        they never influence our editorial recommendations.
      </p>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-6 md:p-8">
        <p className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
          Key disclosure
        </p>
        <p className="text-lg text-text-primary mt-3 leading-relaxed font-medium">
          {SITE_NAME} is a participant in affiliate programmes, including
          Sage&nbsp;UK&rsquo;s affiliate programme operated through Impact.com.
          When you click on certain links on our site and make a purchase, we may
          earn a commission at no additional cost to you.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-12">How affiliate links work</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Some articles on {SITE_NAME} contain affiliate links to products and
        services we review. If you click one of these links and subsequently
        make a purchase or sign up for a service, the vendor may pay us a
        referral commission. This happens at no extra cost to you &mdash; the
        price you pay is the same whether you use our link or go directly to the
        vendor&rsquo;s website.
      </p>

      <h2 className="text-2xl font-bold mt-12">
        Editorial independence
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Affiliate partnerships do not influence our editorial content,
        recommendations, or review methodology. Every review published on{" "}
        {SITE_NAME} is based on independent research, hands-on testing, and
        transparent evaluation criteria. We will never recommend a product
        solely because it pays a higher commission.
      </p>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Our editorial team evaluates software based on real-world use cases
        relevant to UK small businesses, including setup, day-to-day
        bookkeeping, payroll compliance, reporting, integrations, and customer
        support quality.
      </p>

      <h2 className="text-2xl font-bold mt-12">
        Which programmes we participate in
      </h2>
      <ul className="mt-4 list-disc pl-6 text-lg text-text-secondary space-y-2 leading-relaxed">
        <li>
          <span className="font-medium text-text-primary">
            Sage UK (via Impact.com)
          </span>{" "}
          &mdash; Sage Business Cloud Accounting and Sage Intacct.
        </li>
        <li>
          <span className="font-medium text-text-primary">
            Other software vendors
          </span>{" "}
          &mdash; We may join additional affiliate programmes for products we
          review (e.g.&nbsp;Xero, QuickBooks). Any such partnerships will be
          subject to the same editorial standards described here.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12">
        How we identify affiliate content
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Articles that contain affiliate links include a disclosure notice near
        the top of the page. Additionally, we use language such as
        &ldquo;affiliate link&rdquo; or &ldquo;sponsored&rdquo; where required
        by applicable advertising standards (UK ASA / CMA guidelines and
        equivalent regulations).
      </p>

      <h2 className="text-2xl font-bold mt-12">
        Our commitment to you
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {[
          {
            title: "Honest reviews",
            text: "We state the rationale and the limitations of every product we recommend.",
          },
          {
            title: "No pay-for-coverage",
            text: "We do not accept payment in exchange for favourable editorial coverage.",
          },
          {
            title: "Transparent methodology",
            text: "Our review criteria are published on our About page for anyone to scrutinise.",
          },
          {
            title: "Reader-first approach",
            text: "If a product isn't right for UK small businesses, we say so — regardless of commission.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border p-6 bg-background"
          >
            <h3 className="font-bold text-text-primary">{item.title}</h3>
            <p className="text-sm text-text-secondary mt-1">{item.text}</p>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-12">Questions?</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        If you have any questions about our affiliate relationships or editorial
        process, please{" "}
        <Link
          href="/contact"
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          contact us
        </Link>{" "}
        or email{" "}
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}?subject=Affiliate%20disclosure%20enquiry`}
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          {SITE_CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}
