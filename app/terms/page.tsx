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
  title: "Terms of Use",
  description: `Terms and conditions for using the ${SITE_NAME} website and content.`,
  alternates: { canonical: `${BASE_URL}/terms` },
  openGraph: {
    title: `Terms of Use | ${SITE_NAME}`,
    description: `Terms of use for ${SITE_NAME} — access, intellectual property, and disclaimers.`,
    url: `${BASE_URL}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <p className="text-sm text-text-secondary">
        Effective {LEGAL_EFFECTIVE_DATE}
      </p>
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2">
        Terms of Use
      </h1>
      <p className="text-lg text-text-secondary mt-6 leading-relaxed">
        These terms govern your access to and use of the {SITE_NAME} website and its
        content. By using the site, you agree to these terms. If you do not agree, please do
        not use the site.
      </p>

      <h2 className="text-2xl font-bold mt-12">About the site</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        {SITE_NAME} provides editorial articles, guides, and comparisons relating to
        accounting software and UK small business finance topics. Content is for general
        information only and does not constitute legal, tax, accounting, or financial
        advice. You should obtain advice from a qualified professional before making decisions
        that affect your business or compliance obligations.
      </p>

      <h2 className="text-2xl font-bold mt-12">Acceptable use</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        You agree not to misuse the site: for example, by attempting to gain unauthorised
        access, introducing malware, scraping the site in a way that harms our systems or
        breaches robots.txt where applicable, or using the site for any unlawful purpose.
        We may suspend or restrict access if we reasonably believe these terms are breached.
      </p>

      <h2 className="text-2xl font-bold mt-12">Intellectual property</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Unless otherwise stated, {SITE_NAME} owns or licenses the text, design, logos, and
        other materials on this site. You may view and share links to our pages for
        personal or internal business use. You may not copy, republish, or commercially
        exploit substantial parts of our content without our prior written permission,
        except as allowed by law (for example, fair dealing for criticism or news reporting,
        where applicable).
      </p>

      <h2 className="text-2xl font-bold mt-12">Third-party products and links</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We may refer to third-party software, services, or websites (including HMRC and
        software vendors). We are not responsible for third-party content, availability, or
        practices. Your use of third-party products is subject to their terms and privacy
        policies. Links do not imply endorsement unless we say so clearly.
      </p>

      <h2 className="text-2xl font-bold mt-12">Accuracy and updates</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We aim for accurate, up-to-date information, but software features, tax rules, and
        regulations change. Content may become outdated. We do not warrant that the site is
        error-free or continuously available.
      </p>

      <h2 className="text-2xl font-bold mt-12">Limitation of liability</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        To the fullest extent permitted by applicable law, {SITE_NAME} and its operators
        shall not be liable for any indirect, consequential, or special loss, or for any
        loss of profit, revenue, data, or goodwill arising from your use of the site or
        reliance on its content. Nothing in these terms excludes or limits liability that
        cannot be excluded or limited under UK law (including death or personal injury
        caused by negligence, or fraud).
      </p>

      <h2 className="text-2xl font-bold mt-12">Newsletter and communications</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        If you subscribe to email updates, we will use your address in line with our{" "}
        <Link
          href="/privacy"
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          Privacy Policy
        </Link>
        . You can unsubscribe using the link in our emails or by contacting us.
      </p>

      <h2 className="text-2xl font-bold mt-12">Changes to these terms</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We may update these terms from time to time. The effective date at the top will
        change when we publish a new version. Your continued use of the site after changes
        constitutes acceptance of the updated terms where permitted by law.
      </p>

      <h2 className="text-2xl font-bold mt-12">Governing law</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        These terms are governed by the laws of England and Wales. The courts of England and
        Wales shall have exclusive jurisdiction, subject to any mandatory rights you have
        as a consumer in your country of residence.
      </p>

      <h2 className="text-2xl font-bold mt-12">Contact</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Questions about these terms:{" "}
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}?subject=Terms%20enquiry`}
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          {SITE_CONTACT_EMAIL}
        </a>{" "}
        or our{" "}
        <Link
          href="/contact"
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          contact page
        </Link>
        .
      </p>
    </div>
  );
}
