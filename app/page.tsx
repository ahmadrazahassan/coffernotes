import type { Metadata } from "next";
import { HeroSection } from "@/components/home/HeroSection";
import { CategoryArticlesBlock } from "@/components/home/CategoryArticlesBlock";
import { LatestArticles } from "@/components/home/LatestArticles";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FinalCTA } from "@/components/home/FinalCTA";
import { BannerSlot } from "@/components/banners/BannerSlot";
import {
  SITE_META_DESCRIPTION,
  SITE_NAME,
  SITE_URL_FALLBACK,
} from "@/lib/constants";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK;

export const metadata: Metadata = {
  title: "Home",
  description: SITE_META_DESCRIPTION,
  alternates: { canonical: BASE_URL },
  openGraph: {
    url: BASE_URL,
    title: `Home | ${SITE_NAME}`,
    description: SITE_META_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    title: `Home | ${SITE_NAME}`,
    description: SITE_META_DESCRIPTION,
  },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BannerSlot
        slotKey="home_below_hero"
        pathname="/"
        className="flex w-full justify-center px-6"
        lazyIframe
      />

      {/* Category Feeds representing an authoritative B2B Resource Hub */}
      <CategoryArticlesBlock categorySlug="accounting" categoryName="Accounting" />
      <CategoryArticlesBlock categorySlug="payroll" categoryName="Payroll & HR" />
      <BannerSlot
        slotKey="home_mid_feed"
        pathname="/"
        className="flex w-full justify-center px-6"
        lazyIframe
      />
      <CategoryArticlesBlock categorySlug="comparisons" categoryName="Comparisons" />
      <CategoryArticlesBlock categorySlug="getting-paid" categoryName="Getting Paid" />
      <CategoryArticlesBlock categorySlug="tax-mtd" categoryName="Tax & MTD" />

      {/* Global Archive / Feed */}
      <LatestArticles />

      <BannerSlot
        slotKey="home_above_newsletter"
        pathname="/"
        className="flex w-full justify-center px-6"
        lazyIframe
      />

      {/* Conversion / Trust Builders */}
      <NewsletterSection />
      <FinalCTA />
    </>
  );
}
