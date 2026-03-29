import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_CONTACT_EMAIL,
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";
import { Mail, MessageSquare, Shield, MapPin } from "lucide-react";

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

const cards = [
  {
    variant: "mailto" as const,
    title: "Editorial & corrections",
    description:
      "Spotted an error in a guide, a broken HMRC reference, or outdated product terminology? Tell us and we will review it.",
    href: `mailto:${SITE_CONTACT_EMAIL}?subject=Editorial%20correction`,
    cta: "Email editorial",
    icon: MessageSquare,
  },
  {
    variant: "internal" as const,
    title: "Privacy & data",
    description:
      "Questions about how we handle personal data, cookies, or your rights under UK GDPR.",
    href: "/privacy",
    cta: "Privacy Policy",
    icon: Shield,
  },
  {
    variant: "mailto" as const,
    title: "Partnerships & press",
    description:
      "Media, affiliate programme, or commercial collaboration enquiries. We respond when there is a clear fit with our editorial standards.",
    href: `mailto:${SITE_CONTACT_EMAIL}?subject=Partnership%20enquiry`,
    cta: "Email partnerships",
    icon: Mail,
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
        Contact us
      </h1>
      <p className="text-lg text-text-secondary mt-6 leading-relaxed">
        {SITE_NAME} is an independent editorial site. We do not run a public phone line;
        email is the best way to reach the team. We aim to reply within a few business days.
      </p>

      {/* ── Primary inbox + Location ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
            Primary inbox
          </p>
          <a
            href={`mailto:${SITE_CONTACT_EMAIL}`}
            className="mt-3 inline-flex items-center gap-3 text-xl font-bold text-text-primary hover:text-brand-accent transition-colors"
          >
            <Mail className="h-6 w-6 shrink-0" aria-hidden />
            {SITE_CONTACT_EMAIL}
          </a>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            For general enquiries, include a short subject line so we can route your message.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-text-secondary">
            Location
          </p>
          <div className="mt-3 flex items-center gap-3">
            <MapPin className="h-6 w-6 shrink-0 text-text-primary" aria-hidden />
            <span className="text-xl font-bold text-text-primary">London, UK</span>
          </div>
          <p className="text-sm text-text-secondary mt-4 leading-relaxed">
            {SITE_NAME} is headquartered in London, United Kingdom. Our editorial
            team works across the UK.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-14">How we can help</h2>
      <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-1">
        {cards.map((card) => {
          const Icon = card.icon;
          const inner = (
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background">
                <Icon className="h-5 w-5 text-text-primary" aria-hidden />
              </span>
              <div>
                <h3 className="font-bold text-text-primary">{card.title}</h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                  {card.description}
                </p>
                <span className="mt-4 inline-flex text-sm font-semibold text-brand-accent">
                  {card.cta} →
                </span>
              </div>
            </div>
          );

          const className =
            "group block rounded-2xl border border-border p-6 bg-background hover:border-text-secondary/30 hover:bg-surface/80 transition-colors";

          if (card.variant === "internal") {
            return (
              <Link key={card.title} href={card.href} className={className}>
                {inner}
              </Link>
            );
          }

          return (
            <a key={card.title} href={card.href} className={className}>
              {inner}
            </a>
          );
        })}
      </div>

      <h2 className="text-2xl font-bold mt-14">About {SITE_NAME}</h2>
      <p className="text-lg text-text-secondary mt-4 leading-relaxed">
        {SITE_META_DESCRIPTION} Learn more on our{" "}
        <Link
          href="/about"
          className="font-medium text-text-primary underline decoration-border underline-offset-2 hover:decoration-brand-accent"
        >
          About
        </Link>{" "}
        page, including our editorial approach.
      </p>
    </div>
  );
}
