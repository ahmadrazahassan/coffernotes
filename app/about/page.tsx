import type { Metadata } from "next";
import Image from "next/image";
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
        
        {/* Top Section: Founder Intro */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
          
          {/* Avatar with Glow */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
            {/* Colorful Blur Background */}
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              <div className="w-[120%] h-[120%] max-w-[500px] bg-gradient-to-tr from-blue-500 via-pink-400 to-yellow-400 opacity-60 blur-3xl rounded-full mix-blend-multiply filter"></div>
            </div>
            
            {/* Subject Image */}
            <div className="relative z-10 w-full max-w-[400px] aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl bg-white/50 backdrop-blur-sm border border-white/20">
              <Image
                src="/images/nadeem_avatar.png"
                alt="Nadeem Abbas"
                width={800}
                height={1000}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          </div>

          {/* Intro Text */}
          <div className="lg:col-span-7 max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-neutral-900 mb-8 leading-tight">
              Hi there!
            </h1>
            <p className="text-xl md:text-2xl text-neutral-600 leading-[1.6] font-medium">
              Fuelled by a passion for financial clarity, I founded {SITE_NAME} to give UK businesses a jargon-free resource for evaluating the software that runs their finances. Based in London, our team has a deep desire to excel in simplifying everything from Sage and Xero to HMRC compliance.
            </p>
          </div>
        </div>

        {/* Bottom Section: Mission & Expertise */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 mt-24 lg:mt-32 items-start">
          
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
              <Link href="/affiliate-disclosure" className="text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:opacity-70 transition-opacity">
                Affiliate Disclosure
              </Link>
              {" "}to see how we maintain independence.
            </p>
          </div>

          {/* Tags / Pills */}
          <div className="lg:col-span-6 flex flex-wrap gap-3 mt-4 lg:mt-0 pt-2 lg:pl-10">
            {expertiseTags.map((tag) => (
              <span
                key={tag}
                className="px-5 py-2.5 rounded-full border border-neutral-200/80 bg-white text-[11px] font-bold text-neutral-700 uppercase tracking-widest shadow-sm hover:shadow-md transition-shadow cursor-default"
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
