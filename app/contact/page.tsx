import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_CONTACT_EMAIL,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";
import { ArrowRight } from "lucide-react";

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
      {/* Wrapper to give it that floating Framer feel */}
      <div className="rounded-3xl border border-neutral-200 bg-white overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-2 relative min-h-[700px]">
        
        {/* Connection Arrow (Desktop Only) */}
        <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 items-center justify-center w-8 bg-white h-px">
          <div className="w-full h-px bg-neutral-900 absolute"></div>
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-0 h-0 border-t-[4px] border-t-transparent border-l-[6px] border-l-neutral-900 border-b-[4px] border-b-transparent"></div>
        </div>

        {/* ── Left Side: Details ── */}
        <div className="p-10 lg:p-20 flex flex-col justify-between bg-white text-neutral-950 relative">
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
          </div>
        </div>

        {/* ── Right Side: Form ── */}
        <div className="bg-[#1C1C1C] p-10 lg:p-20 text-white flex flex-col justify-center">
          <h2 className="text-2xl font-bold tracking-tight text-white mb-10">Contact</h2>

          <form className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {/* Name */}
              <div className="group relative">
                <input
                  type="text"
                  id="name"
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-sm text-white focus:outline-none focus:border-[#E8FF00] transition-colors placeholder-transparent"
                />
                <label
                  htmlFor="name"
                  className="absolute left-0 -top-3.5 text-[11px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#E8FF00]"
                >
                  Name
                </label>
              </div>

              {/* Email */}
              <div className="group relative">
                <input
                  type="email"
                  id="email"
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-sm text-white focus:outline-none focus:border-[#E8FF00] transition-colors placeholder-transparent"
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 -top-3.5 text-[11px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#E8FF00]"
                >
                  Email
                </label>
              </div>

              {/* Phone */}
              <div className="group relative">
                <input
                  type="tel"
                  id="phone"
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-sm text-white focus:outline-none focus:border-[#E8FF00] transition-colors placeholder-transparent"
                />
                <label
                  htmlFor="phone"
                  className="absolute left-0 -top-3.5 text-[11px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#E8FF00]"
                >
                  Phone
                </label>
              </div>

              {/* Subject */}
              <div className="group relative">
                <input
                  type="text"
                  id="subject"
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-sm text-white focus:outline-none focus:border-[#E8FF00] transition-colors placeholder-transparent"
                />
                <label
                  htmlFor="subject"
                  className="absolute left-0 -top-3.5 text-[11px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#E8FF00]"
                >
                  Subject
                </label>
              </div>
            </div>

            {/* Interest Area */}
            <div className="group relative">
              <input
                type="text"
                id="interest"
                placeholder=" "
                className="peer w-full bg-transparent border-b border-neutral-700 py-3 text-sm text-white focus:outline-none focus:border-[#E8FF00] transition-colors placeholder-transparent"
              />
              <label
                htmlFor="interest"
                className="absolute left-0 -top-3.5 text-[11px] font-medium text-neutral-400 uppercase tracking-widest transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:normal-case peer-placeholder-shown:tracking-normal peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-[11px] peer-focus:uppercase peer-focus:tracking-widest peer-focus:text-[#E8FF00]"
              >
                Tell us about your interested in
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="button"
                className="w-full bg-[#E8FF00] text-neutral-950 font-bold py-4 px-8 text-sm hover:bg-[#D7ED00] transition-colors focus:ring-4 focus:ring-[#E8FF00]/20 outline-none"
              >
                Send to us
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
