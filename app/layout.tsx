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
    icon: "/icon.svg",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK
  ),
  openGraph: {
    title: SITE_NAME,
    description: SITE_META_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_META_DESCRIPTION,
  },
  // Impact site verification: paste in <head> per verifier instructions
  other: {
    "impact-site-verification": "50563464-78db-477c-ada3-5172815b9e6f",
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
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
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
          Impact-Site-Verification: 50563464-78db-477c-ada3-5172815b9e6f
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
