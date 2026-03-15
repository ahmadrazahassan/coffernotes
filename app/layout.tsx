import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientVisibility } from "@/components/layout/ClientVisibility";
import { JsonLd } from "@/components/seo/JsonLd";
import "./globals.css";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.coffernotes.com";

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
    default: "Coffer Notes",
    template: "%s | Coffer Notes",
  },
  description: "UK small business finance, explained properly.",
  icons: {
    icon: "/icon.svg",
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://www.coffernotes.com"
  ),
  openGraph: {
    title: "Coffer Notes",
    description: "UK small business finance, explained properly.",
    siteName: "Coffer Notes",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coffer Notes",
    description: "UK small business finance, explained properly.",
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
    name: "Coffer Notes",
    url: BASE_URL,
    description:
      "Independent UK small business finance publication. HMRC-referenced guides on accounting, payroll, tax, and more.",
    sameAs: [],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Coffer Notes",
    url: BASE_URL,
    description: "UK small business finance, explained properly.",
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
        <Toaster />
      </body>
    </html>
  );
}
