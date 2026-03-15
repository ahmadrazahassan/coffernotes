import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ClientVisibility } from "@/components/layout/ClientVisibility";
import "./globals.css";

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
    process.env.NEXT_PUBLIC_SITE_URL || "https://coffernotes.com"
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${nunitoSans.variable} ${openSans.variable} font-sans antialiased`}>
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
