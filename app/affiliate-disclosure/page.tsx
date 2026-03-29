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
          Affiliate Disclosure
        </p>
        <p className="text-lg text-text-primary mt-3 leading-relaxed font-medium">
          {SITE_NAME} is an independent publisher supported by its readers. When you purchase a product or service through links on our site, we may earn an affiliate commission at no additional cost to you. This enables us to maintain our rigorous editorial standards and continue providing premium, independent research.
        </p>
      </div>

      <h2 className="text-2xl font-bold mt-12">How affiliate relationships work</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Certain articles and resources on {SITE_NAME} include affiliate links to the enterprise solutions and software we evaluate. If you navigate through one of these links and finalize a purchase or subscription, the respective vendor may provide us with a referral commission. This process operates seamlessly at no extra expense to you &mdash; the pricing remains identical whether you utilize our link or visit the vendor&rsquo;s platform directly.
      </p>

      <h2 className="text-2xl font-bold mt-12">
        Editorial autonomy and objective analysis
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Our affiliate partnerships operate strictly independent of our editorial operations. They do not dictate our content strategy, alter our recommendations, or influence our proprietary evaluation methodology. Every analysis published on {" "}
        {SITE_NAME} is the result of unsponsored research, comprehensive hands-on testing, and transparent criteria. We emphatically refuse to endorse a product based on its commission structure or partnership potential.
      </p>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        Our editorial specialists evaluate platforms based solely on real-world utility, robust performance, and the tangible value they deliver to modern businesses. Key factors include implementation processes, operational compliance, advanced reporting capabilities, and the overall quality of enterprise support.
      </p>

      <h2 className="text-2xl font-bold mt-12">
        Our Affiliate Partnerships
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        We maintain partnerships with a variety of industry-leading software providers and reputable affiliate networks. These professional relationships sustain our business model while allowing us to deliver unbiased, high-caliber insights. Crucially, our participation in these programs does not guarantee a favorable review or preferential placement for any vendor or service.
      </p>

      <h2 className="text-2xl font-bold mt-12">
        Transparency and Regulatory Compliance
      </h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        In strict adherence to global advertising standards, including guidelines established by the UK ASA / CMA and the FTC, we ensure unambiguous disclosure regarding the presence of affiliate links. Any publication containing affiliate links will feature a clear statement of disclosure, empowering you to make fully informed decisions.
      </p>

      <h2 className="text-2xl font-bold mt-12">
        Our Commitment to Excellence
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        {[
          {
            title: "Unbiased Analysis",
            text: "Our evaluations highlight both the strategic strengths and the actionable limitations of every platform.",
          },
          {
            title: "Zero Pay-for-Play",
            text: "We strictly decline any compensation in exchange for preferential editorial treatment or skewed ratings.",
          },
          {
            title: "Rigorous Methodology",
            text: "Our standardized assessment criteria ensure every product is measured against the same stringent requirements.",
          },
          {
            title: "Audience First",
            text: "Our primary fidelity is to our readers. We exclusively recommend solutions that genuinely drive growth and efficiency for your business.",
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
