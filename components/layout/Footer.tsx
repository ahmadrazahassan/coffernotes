import Link from "next/link";
import { Logo } from "./Logo";
import { CATEGORIES } from "@/lib/constants";
import { SubscribeForm } from "@/components/shared/SubscribeForm";
import { Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14">
          {/* Brand — 4 cols */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="text-sm text-text-secondary mt-4 leading-relaxed max-w-xs">
              Independent editorial publication covering UK small business finance. HMRC-referenced. No sponsored content.
            </p>
          </div>

          {/* Topics — 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-4">
              Topics
            </h4>
            <div className="flex flex-col gap-2.5">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="text-sm text-text-secondary hover:text-text-primary transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Company — 2 cols */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-4">
              Company
            </h4>
            <div className="flex flex-col gap-2.5">
              <Link href="/about" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                About
              </Link>
              <a
                href="https://www.linkedin.com/in/abdul-rehman-ch-438049213"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://www.instagram.com/arc.official01/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors inline-flex items-center gap-2"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
                Instagram
              </a>
              <Link href="/about#editorial" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Editorial Policy
              </Link>
              <Link href="/about#contact" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                Contact
              </Link>
              <Link href="/rss.xml" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
                RSS Feed
              </Link>
            </div>
          </div>

          {/* Newsletter — 4 cols */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary mb-4">
              Weekly articles by email
            </h4>
            <SubscribeForm compact />
            <p className="text-[11px] text-text-secondary mt-3 leading-relaxed">
              One article per email. No promotions. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-[11px] text-text-secondary">
            &copy; {new Date().getFullYear()} Coffer Notes. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-[11px] text-text-secondary hover:text-text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-[11px] text-text-secondary hover:text-text-primary transition-colors">
              Terms of Use
            </Link>
            <Link href="/sitemap.xml" className="text-[11px] text-text-secondary hover:text-text-primary transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
