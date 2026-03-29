import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";

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

const expertiseTags = [
  "SAGE BUSINESS CLOUD",
  "XERO",
  "QUICKBOOKS",
  "ACCOUNTING",
  "TAX & MTD",
  "PAYROLL (RTI)",
  "HMRC COMPLIANCE",
  "CASH FLOW",
  "GETTING PAID",
  "SOFTWARE REVIEWS",
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-12 lg:py-24">
      {/* ── Framer-style Rounded Panel ── */}
      <div className="rounded-[40px] bg-[#F2F4F7] p-8 md:p-16 lg:p-24 overflow-hidden relative">
        
        {/* Abstract Colorful Blur Background */}
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 z-0 pointer-events-none">
          <div className="w-[800px] h-[800px] bg-gradient-to-tr from-blue-400 via-pink-400 to-yellow-400 opacity-20 blur-[100px] rounded-full mix-blend-multiply"></div>
        </div>
        
        {/* Top Section: Intro */}
        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-extrabold tracking-[-0.03em] text-neutral-900 mb-8 leading-[1]">
            Hi there!
          </h1>
          <p className="text-2xl md:text-3xl lg:text-4xl text-neutral-600 leading-[1.4] font-medium tracking-tight">
            Fuelled by a passion for financial clarity, {SITE_NAME} was founded to give UK businesses a jargon-free resource for evaluating the software that runs their finances. Based in London, our team has a deep desire to excel in simplifying everything from Sage and Xero to HMRC compliance.
          </p>
        </div>

        {/* Bottom Section: Mission & Expertise */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mt-24 lg:mt-40 items-start border-t border-neutral-300/50 pt-16">
          
          {/* The Mission Text */}
          <div className="lg:col-span-6">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-6 tracking-tight">
              Our Editorial Mission
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed mb-6 font-medium">
              Always up for a challenge, our team tests accounting software against real-world UK workflows. Every article reflects our commitment to accuracy: reviews reference HMRC directly and use official product terminology so comparisons stay accurate for professional readers.
            </p>
            <p className="text-lg text-neutral-600 leading-relaxed font-medium">
              {SITE_NAME} does not accept payment for editorial coverage. When we recommend a product, we state the rationale and limitations clearly. Read our{" "}
              <Link href="/affiliate-disclosure" className="text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:opacity-70 transition-opacity">
                Affiliate Disclosure
              </Link>
              {" "}to see how we maintain independence.
            </p>
          </div>

          {/* Tags / Pills */}
          <div className="lg:col-span-6 flex flex-wrap gap-3">
            {expertiseTags.map((tag) => (
              <span
                key={tag}
                className="px-5 py-3 rounded-full border border-neutral-300/60 bg-white/60 backdrop-blur-md text-[11px] font-bold text-neutral-800 uppercase tracking-widest hover:bg-white transition-colors cursor-default"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
