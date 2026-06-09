import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientVisibility } from "@/components/layout/ClientVisibility";
import { BannerSlot } from "@/components/banners/BannerSlot";
import { GlobalAnchorSlot } from "@/components/banners/GlobalAnchorSlot";
import { JsonLd } from "@/components/seo/JsonLd";
import { NewsletterPopup } from "@/components/shared/NewsletterPopup";
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
    // SVG logo as requested
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
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
  other: {
    "impact-site-verification": "e83dd08e-8c26-46ac-ada0-886e275fc12b",
  },
};

export default async function RootLayout({
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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

        <JsonLd data={organizationSchema} />
        <JsonLd data={websiteSchema} />
        <BannerSlot
          slotKey="global_top_leaderboard"
          className="flex w-full justify-center px-6 pt-2"
          lazyIframe={false}
        />
        <ClientVisibility>
          <Navbar />
        </ClientVisibility>
        <main>{children}</main>
        <BannerSlot
          slotKey="footer_above"
          className="flex w-full justify-center px-6 py-6"
          lazyIframe
        />
        <ClientVisibility>
          <Footer />
        </ClientVisibility>
        <GlobalAnchorSlot />
        <NewsletterPopup />
        <Analytics />
        <Toaster />
      </body>
    </html>
  );
}
