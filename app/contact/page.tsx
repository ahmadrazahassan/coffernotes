import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_CONTACT_EMAIL,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";
import { ArrowRight } from "lucide-react";
import { LinkedInIcon } from "@/components/shared/LinkedInIcon";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK;

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} — editorial corrections, methodology questions, privacy, and partnership enquiries.`,
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: `Contact | ${SITE_NAME}`,
    description: `Get in touch with ${SITE_NAME} by email.`,
    url: `${BASE_URL}/contact`,
  },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:py-24">
      {/* Wrapper to give it that floating premium SaaS feel */}
      <div className="rounded-[2.5rem] border border-neutral-200/60 bg-white/70 backdrop-blur-xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.04)] grid grid-cols-1 lg:grid-cols-2 relative min-h-[750px]">
        
        {/* Connection Arrow (Desktop Only) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 bg-white h-px">
          <div className="w-full h-px bg-neutral-900 absolute"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-neutral-900 border-b-[4px] border-b-transparent"></div>
        </div>

        {/* ── Left Side: Details ── */}
        <div className="p-10 lg:p-20 flex flex-col justify-between bg-white/50 text-neutral-950 relative z-10">
          <div>
            <h1 className="text-6xl md:text-7xl lg:text-[5rem] font-bold tracking-[-0.03em] leading-[1.05] text-neutral-950">
              Let&rsquo;s get<br />in touch
            </h1>
            <p className="mt-8 text-2xl lg:text-[1.75rem] font-medium tracking-tight text-neutral-900 leading-snug">
              Don&rsquo;t be afraid to<br />
              say hello with us!
            </p>
          </div>

          <div className="mt-20 space-y-10">
            <div>
              <p className="text-sm font-semibold text-neutral-500 mb-1">Email</p>
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="text-lg lg:text-xl font-bold text-neutral-950 hover:opacity-70 transition-opacity tracking-tight"
              >
                {SITE_CONTACT_EMAIL}
              </a>
            </div>

            <div>
              <p className="text-sm font-semibold text-neutral-500 mb-1">Office</p>
              <p className="text-lg lg:text-xl font-bold text-neutral-950 tracking-tight leading-snug max-w-[250px]">
                London, United Kingdom
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1 mt-2 text-sm font-bold text-neutral-950 hover:underline decoration-neutral-300 underline-offset-4"
              >
                See our story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div>
              <p className="text-sm font-semibold text-neutral-500 mb-1">Founder</p>
              <a
                href="https://www.linkedin.com/in/me-abdulrehman-ch/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-lg lg:text-xl font-bold text-[#0077b5] hover:text-[#006097] transition-colors tracking-tight"
              >
                <LinkedInIcon className="w-5 h-5" />
                Abdul Rehman ch.
              </a>
            </div>
          </div>
        </div>

        {/* ── Right Side: Form ── */}
        <div className="bg-[#0a0e09] relative p-10 lg:p-20 flex flex-col justify-center overflow-hidden">
          {/* Subtle top-right glow effect */}
          <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-[#0055ff]/15 blur-[100px] pointer-events-none"></div>

          <div className="relative z-10">
            <h2 className="text-3xl font-bold tracking-tight text-white mb-10">Drop us a line</h2>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[13px] font-medium text-neutral-400 pl-5">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    placeholder="John Doe"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0055ff] focus:ring-1 focus:ring-[#0055ff] focus:bg-white/[0.05] hover:border-white/20 transition-all"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-[13px] font-medium text-neutral-400 pl-5">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="john@example.com"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0055ff] focus:ring-1 focus:ring-[#0055ff] focus:bg-white/[0.05] hover:border-white/20 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-[13px] font-medium text-neutral-400 pl-5">
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="+44 20 7123 4567"
                    className="w-full bg-white/[0.03] border border-white/10 rounded-full px-6 py-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0055ff] focus:ring-1 focus:ring-[#0055ff] focus:bg-white/[0.05] hover:border-white/20 transition-all"
                  />
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-[13px] font-medium text-neutral-400 pl-5">
                    Subject
                  </label>
                  <div className="relative">
                    <select
                      id="subject"
                      defaultValue=""
                      className="w-full appearance-none bg-white/[0.03] border border-white/10 rounded-full px-6 py-4 text-sm text-white focus:outline-none focus:border-[#0055ff] focus:ring-1 focus:ring-[#0055ff] focus:bg-white/[0.05] hover:border-white/20 transition-all cursor-pointer [&>option]:bg-neutral-900 [&>option]:text-white"
                    >
                      <option value="" disabled className="text-neutral-500">How can we help?</option>
                      <option value="editorial">Editorial Corrections</option>
                      <option value="partnership">Partnership Enquiries</option>
                      <option value="methodology">Methodology Questions</option>
                      <option value="support">General Support</option>
                    </select>
                    <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interest Area */}
              <div className="space-y-2 pt-2">
                <label htmlFor="interest" className="text-[13px] font-medium text-neutral-400 pl-5">
                  Tell us what you're interested in
                </label>
                <textarea
                  id="interest"
                  placeholder="I'm looking for advice on..."
                  rows={4}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-3xl px-6 py-5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#0055ff] focus:ring-1 focus:ring-[#0055ff] focus:bg-white/[0.05] hover:border-white/20 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="button"
                  className="w-full bg-[#0055ff] text-white font-bold py-4 px-8 rounded-full text-sm hover:bg-[#0044cc] hover:shadow-[0_8px_20px_rgba(0,85,255,0.25)] hover:-translate-y-0.5 transition-all focus:ring-4 focus:ring-[#0055ff]/30 outline-none"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
