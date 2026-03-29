import Link from "next/link";
import { Logo } from "./Logo";
import {
  CATEGORIES,
  FOOTER_TAGLINE,
  SITE_CONTACT_EMAIL,
  SITE_NAME,
  SITE_TAGLINE,
} from "@/lib/constants";
import { SubscribeForm } from "@/components/shared/SubscribeForm";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50/80 px-6 py-12 md:px-8">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo className="text-neutral-950" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-neutral-700">
              {FOOTER_TAGLINE}
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-neutral-600">
              {SITE_TAGLINE} Reviews and guides reference HMRC and GOV.UK where it matters, with accurate naming for Sage, Xero, and QuickBooks.
            </p>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              Topics
            </h4>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="text-sm text-neutral-700 hover:text-neutral-950"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              Governance
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-neutral-700 hover:text-neutral-950">
                About
              </Link>
              <Link href="/about#editorial" className="text-sm text-neutral-700 hover:text-neutral-950">
                Editorial Standards
              </Link>
              <Link href="/contact" className="text-sm text-neutral-700 hover:text-neutral-950">
                Contact
              </Link>
              <Link href="/privacy" className="text-sm text-neutral-700 hover:text-neutral-950">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-neutral-700 hover:text-neutral-950">
                Terms of Use
              </Link>
              <Link href="/rss.xml" className="text-sm text-neutral-700 hover:text-neutral-950">
                RSS Feed
              </Link>
              <Link href="/sitemap.xml" className="text-sm text-neutral-700 hover:text-neutral-950">
                Sitemap
              </Link>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-neutral-500">
              Contact
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                href="/contact"
                className="text-sm font-medium text-neutral-900 hover:text-neutral-950"
              >
                Contact us
              </Link>
              <a
                href={`mailto:${SITE_CONTACT_EMAIL}`}
                className="inline-flex items-center gap-2 text-sm text-neutral-700 hover:text-neutral-950"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
                {SITE_CONTACT_EMAIL}
              </a>
              <p className="text-sm leading-relaxed text-neutral-600">
                Editorial corrections, compliance questions, or partnership enquiries — see our contact page or email the desk.
              </p>
            </div>
          </div>
          </div>

          <div className="mt-10 border-t border-neutral-200 py-6">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-xs text-neutral-700">
                Weekly finance briefings by email.
              </p>
              <p className="mt-1 text-xs text-neutral-600">
                Built for founders, finance managers, and operations leaders. Unsubscribe anytime.
              </p>
            </div>
            <div className="w-full max-w-md">
              <SubscribeForm compact />
            </div>
          </div>
          </div>

          <div className="border-t border-neutral-200 py-5">
          <p className="text-xs text-neutral-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
