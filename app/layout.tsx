import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientVisibility } from "@/components/layout/ClientVisibility";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL_FALLBACK,
} from "@/lib/constants";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK;

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
});

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_META_DESCRIPTION,
  icons: {
    // 16×16 & 32×32 for browser tabs
    icon: [
      { url: "/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
      // 192×192 — Google Search picks this up for the favicon in results
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      // 512×512 — PWA splash + high-DPI displays
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      // SVG fallback for modern browsers
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    // Apple devices (iOS home screen, Safari pinned tab)
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    // Classic favicon.ico for legacy browser support
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK
  ),
  openGraph: {
    title: SITE_NAME,
    description: SITE_META_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/icon-512.png",
        width: 512,
        height: 512,
        alt: `${SITE_NAME} logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_META_DESCRIPTION,
    images: ["/icon-512.png"],
  },
  // Impact site verification (Sage UK / impact.com) — homepage <head>
  other: {
    "impact-site-verification": "9bf10a47-235f-4f19-867d-c6aeabc2a6bc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${BASE_URL}/#organization`,
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_META_DESCRIPTION,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/icon-512.png`,
      width: 512,
      height: 512,
    },
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description: SITE_TAGLINE,
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: "en-GB",
  };

  return (
    <html lang="en-GB">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18036529064"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18036529064');
          `}
        </Script>
      </head>
      <body className={`${nunitoSans.variable} ${openSans.variable} font-sans antialiased`}>
        {/* Impact site verification — first body section for verifier crawl */}
        <span className="sr-only" aria-hidden="true">
          Impact-Site-Verification: 9bf10a47-235f-4f19-867d-c6aeabc2a6bc
        </span>
        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <ClientVisibility>
          <Navbar />
        </ClientVisibility>
        <main>{children}</main>
        <ClientVisibility>
          <Footer />
        </ClientVisibility>
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
