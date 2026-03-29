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
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses, and protects your personal data when you use our website.`,
  alternates: { canonical: `${BASE_URL}/privacy` },
  openGraph: {
    title: `Privacy Policy | ${SITE_NAME}`,
    description: `Privacy policy for ${SITE_NAME} — UK visitors and newsletter subscribers.`,
    url: `${BASE_URL}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <p className="text-sm text-text-secondary">
        Effective {LEGAL_EFFECTIVE_DATE}
      </p>
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-2">
        Privacy Policy
      </h1>
      <p className="text-lg text-text-secondary mt-6 leading-relaxed">
        This policy explains how {SITE_NAME} (“we”, “us”) processes personal data when you
        visit our website or use our services (for example, subscribing to email updates).
        We are committed to protecting your privacy and complying with UK data protection
        law, including the UK GDPR and the Data Protection Act 2018.
      </p>

      <h2 className="text-2xl font-bold mt-12">Who we are</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        {SITE_NAME} publishes editorial content about accounting software and related topics
        for UK small businesses. For data protection purposes, the controller is the
        operator of this website. You can contact us at{" "}
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}`}
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          {SITE_CONTACT_EMAIL}
        </a>
        . For privacy-specific requests, include “Privacy” in the subject line.
      </p>

      <h2 className="text-2xl font-bold mt-12">What data we collect</h2>
      <ul className="mt-4 list-disc pl-6 text-lg text-text-secondary space-y-2 leading-relaxed">
        <li>
          <span className="font-medium text-text-primary">Usage data:</span> technical
          information such as pages viewed, approximate location (country/region), device
          and browser type, and referral information, collected via analytics tools.
        </li>
        <li>
          <span className="font-medium text-text-primary">Newsletter:</span> if you subscribe,
          we store your email address and subscription status.
        </li>
        <li>
          <span className="font-medium text-text-primary">Communications:</span> if you
          email us, we keep your message and contact details for as long as needed to respond
          and for a reasonable period afterwards.
        </li>
      </ul>

      <h2 className="text-2xl font-bold mt-12">How we use your data</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We use personal data to operate and improve the site, send newsletters you have
        requested, understand how readers use our content, respond to enquiries, comply
        with legal obligations, and protect the security and integrity of our services.
      </p>

      <h2 className="text-2xl font-bold mt-12">Cookies and similar technologies</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We use cookies and similar technologies where necessary for the site to function,
        and where applicable for analytics and marketing measurement (for example, to
        understand traffic sources and campaign performance). You can control cookies through
        your browser settings; blocking some cookies may affect how the site works.
      </p>

      <h2 className="text-2xl font-bold mt-12">Analytics</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We may use privacy-conscious analytics (such as Vercel Analytics) to measure page
        views and performance. Where we use third-party tags for advertising or conversion
        measurement, those providers may process data according to their own privacy policies.
      </p>

      <h2 className="text-2xl font-bold mt-12">Legal bases (UK GDPR)</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We rely on: (1) <span className="font-medium text-text-primary">consent</span> where
        we ask for it (for example, optional marketing cookies or newsletter signup); (2){" "}
        <span className="font-medium text-text-primary">legitimate interests</span> in
        running a sustainable editorial site, understanding readership, and improving
        content; and (3) <span className="font-medium text-text-primary">legal obligation</span>{" "}
        where the law requires us to retain or disclose information.
      </p>

      <h2 className="text-2xl font-bold mt-12">Retention</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We keep personal data only as long as necessary for the purposes above, including
        analytics and legal requirements. Newsletter data is kept while you remain
        subscribed or until we delete it after a period of inactivity, in line with our
        internal practices.
      </p>

      <h2 className="text-2xl font-bold mt-12">Sharing and international transfers</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We use trusted service providers (for example, hosting, email delivery, and
        analytics) who process data on our behalf under appropriate agreements. Some
        providers may be located outside the UK; where we transfer data internationally, we
        ensure suitable safeguards (such as UK adequacy decisions or standard contractual
        clauses) as required by law.
      </p>

      <h2 className="text-2xl font-bold mt-12">Your rights</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Under UK data protection law you may have the right to access, rectify, erase,
        restrict, or object to processing of your personal data, and the right to data
        portability where applicable. You may withdraw consent at any time where processing
        is based on consent. You also have the right to lodge a complaint with the{" "}
        <a
          href="https://ico.org.uk/"
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          ICO
        </a>{" "}
        (Information Commissioner’s Office).
      </p>

      <h2 className="text-2xl font-bold mt-12">Children</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Our content is aimed at businesses and professionals. We do not knowingly collect
        personal data from children under 16.
      </p>

      <h2 className="text-2xl font-bold mt-12">Changes</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We may update this policy from time to time. The “Effective” date at the top will
        change when we do; continued use of the site after changes constitutes acceptance of
        the updated policy where permitted by law.
      </p>

      <h2 className="text-2xl font-bold mt-12">Contact</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Questions about this policy:{" "}
        <a
          href={`mailto:${SITE_CONTACT_EMAIL}?subject=Privacy%20enquiry`}
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          {SITE_CONTACT_EMAIL}
        </a>
        . You can also use our{" "}
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
