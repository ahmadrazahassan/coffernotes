import type { Metadata } from "next";
import Link from "next/link";
import { Info, UserCircle2, Target } from "lucide-react";
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
    <div className="min-h-screen bg-white font-sans selection:bg-[#0055ff] selection:text-white">
      {/* Subtle Grid Background for top section using brand primary color */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20 h-[70vh]"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0, 85, 255, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 85, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Top Section */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 lg:px-12 pt-24 pb-20 lg:pt-32 lg:pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          <div className="lg:col-span-8">
            {/* Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-[#0055ff]/20 bg-[#0055ff]/5 rounded-md text-[11px] font-bold text-[#0055ff] tracking-wide mb-10 uppercase">
              <UserCircle2 className="w-4 h-4" />
              About the Founder
            </div>

            <h1 className="text-5xl lg:text-[4.5rem] font-bold tracking-tight text-[#0a0e09] mb-8 leading-[1.05]">
              Hi, I&rsquo;m <br className="hidden md:block" />
              <span className="text-[#0055ff]">Abdul Rehman ch.</span>
            </h1>

            <p className="text-lg lg:text-xl leading-[1.7] text-[#64748B] font-medium max-w-[700px]">
              Based in London, I founded {SITE_NAME} with a single goal: to give UK businesses a jargon-free, deeply researched resource for evaluating the software that runs their finances. 
              <br /><br />
              Fuelled by a passion for financial clarity, my team and I have a deep desire to excel in simplifying everything from Sage and Xero setups to strict HMRC compliance.
            </p>
          </div>
          
          {/* Right minimal visual or space */}
          <div className="hidden lg:flex lg:col-span-4 items-center justify-center opacity-40">
            <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-[300px] stroke-[#0055ff]" strokeWidth="1.5">
              <path d="M50 350 L350 350 L250 150 L150 150 Z" strokeDasharray="4 4" className="stroke-[#0055ff]/40" />
              <path d="M150 150 L150 50 L250 50 L250 150" />
              <path d="M50 350 L150 250 L250 250 L350 350" />
              <path d="M150 250 L150 150" />
              <path d="M250 250 L250 150" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Section for "Our Publishing Focus" - Using Brand Primary Background */}
      <div className="bg-[#0055ff] text-white pt-24 pb-32 px-6 lg:px-12 border-t border-[#0044cc]">
        <div className="max-w-[1400px] mx-auto">
          
          {/* Chip */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/20 bg-white/10 rounded-md text-[11px] font-bold text-white tracking-wide mb-12 uppercase backdrop-blur-sm">
            <Target className="w-4 h-4" />
            Our Publishing Focus
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-4xl lg:text-[3rem] font-bold leading-[1.15] tracking-tight mb-10">
                <span className="text-white">Always up for a challenge,</span> <span className="text-white/70">I built an editorial team dedicated to testing accounting software against real-world UK workflows.</span>
              </h2>

              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium max-w-2xl mb-8">
                We specialize in evaluating premier platforms like Sage Business Cloud and Sage Intacct, ensuring that when we recommend a solution to SMEs and sole traders, it seamlessly handles Making Tax Digital (MTD), RTI payroll, and daily bookkeeping.
              </p>
              
              <p className="text-lg md:text-xl text-white/90 leading-relaxed font-medium max-w-2xl mb-8">
                By structuring our content around high-intent software comparisons and buyer guides, we connect reliable B2B traffic with the industry&rsquo;s best SaaS providers. Discover more about our commercial partnerships in our{" "}
                <Link href="/affiliate-disclosure" className="text-white font-bold underline decoration-white/40 underline-offset-4 hover:decoration-white transition-colors">
                  Affiliate Disclosure
                </Link>.
              </p>
            </div>
            
            {/* Tags area */}
            <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-white/20 pt-12 lg:pt-0 lg:pl-12 flex flex-col justify-start">
              <h3 className="text-sm font-bold text-white/60 tracking-wide mb-8 uppercase">Areas of Expertise</h3>
              <div className="flex flex-wrap gap-2.5">
                {expertiseTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-2 border border-white/20 bg-white/10 text-[11px] font-bold text-white tracking-widest hover:bg-white hover:text-[#0055ff] transition-colors cursor-default rounded-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
