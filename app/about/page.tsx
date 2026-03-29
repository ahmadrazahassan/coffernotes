import type { Metadata } from "next";
import Link from "next/link";
import {
  CATEGORIES,
  SITE_CONTACT_EMAIL,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";
import { Mail, MapPin } from "lucide-react";

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

      {/* ── Founder ── */}
      <h2 className="text-2xl font-bold mt-14">Founded by Nadeem Abbas</h2>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 md:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-neutral-950 text-white text-2xl font-extrabold select-none">
            NA
          </div>
          <div>
            <h3 className="text-xl font-bold">Nadeem Abbas</h3>
            <p className="text-sm text-text-secondary mt-0.5">
              Founder &amp; Editor-in-Chief
            </p>
            <p className="text-base text-text-secondary mt-3 leading-relaxed">
              Nadeem is a London-based finance and technology writer with deep
              experience covering cloud accounting, payroll compliance, and small
              business operations across the UK. He founded {SITE_NAME} to give
              sole traders, freelancers, and growing SMEs an independent,
              jargon-free resource for evaluating the software that runs their
              finances — from Sage and Xero to emerging fintech tools.
            </p>
            <p className="text-base text-text-secondary mt-3 leading-relaxed">
              Every article on {SITE_NAME} reflects Nadeem&rsquo;s commitment to
              accuracy: reviews reference HMRC and GOV.UK directly, use official
              product terminology (especially for Sage), and are structured around
              the real decisions UK business owners face every month.
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-text-secondary">
              <MapPin className="h-4 w-4 shrink-0" />
              <span>London, United Kingdom</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── The Team ── */}
      <h2 className="text-2xl font-bold mt-14">Our team</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Behind {SITE_NAME} is a small, specialist editorial team with backgrounds
        in accounting, financial journalism, and SaaS product analysis. Every team
        member works to the same editorial standards — transparent methodology,
        no paid-for coverage, and a relentless focus on what matters to UK
        businesses. We cross-check each review for regulatory accuracy, test
        software against real-world workflows, and update content as products
        evolve.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
        {[
          {
            role: "Editorial &amp; Research",
            desc: "Hands-on testing, feature audits, and HMRC compliance checks.",
          },
          {
            role: "Content &amp; SEO",
            desc: "Long-form guides, comparison articles, and UK search intelligence.",
          },
          {
            role: "Product &amp; Design",
            desc: "Platform development, UX, and reader experience.",
          },
        ].map((t) => (
          <div
            key={t.role}
            className="rounded-2xl border border-border p-6 bg-background"
          >
            <h3 className="font-bold" dangerouslySetInnerHTML={{ __html: t.role }} />
            <p className="text-sm text-text-secondary mt-1">{t.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Mission ── */}
      <h2 className="text-2xl font-bold mt-14">Our mission</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Choosing accounting software affects VAT, payroll, reporting, and how
        confidently you can close the month. {SITE_NAME} exists to reduce guesswork
        by explaining what matters, what differs between products, and what to verify
        before you commit.
      </p>

      {/* ── What we cover ── */}
      <h2 className="text-2xl font-bold mt-14">What we cover</h2>
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

      {/* ── Editorial approach ── */}
      <h2 id="editorial" className="text-2xl font-bold mt-14">
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
        For more on how we handle affiliate partnerships, see our{" "}
        <Link
          href="/affiliate-disclosure"
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          Affiliate Disclosure
        </Link>
        .
      </p>

      {/* ── Location ── */}
      <h2 className="text-2xl font-bold mt-14">Where we are</h2>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-6 md:p-8">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
            <MapPin className="h-5 w-5 text-text-primary" aria-hidden />
          </span>
          <div>
            <h3 className="font-bold text-text-primary">London, United Kingdom</h3>
            <p className="text-sm text-text-secondary mt-1 leading-relaxed">
              {SITE_NAME} is headquartered in London. Our editorial team works
              across the UK, keeping us close to the businesses, regulations,
              and market conditions we write about every day.
            </p>
          </div>
        </div>
      </div>

      {/* ── Connect ── */}
      <h2 id="contact" className="text-2xl font-bold mt-14">
        Connect with us
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        For corrections, methodology questions, or partnership enquiries,
        visit our{" "}
        <Link
          href="/contact"
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          contact page
        </Link>{" "}
        or email us directly.
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
