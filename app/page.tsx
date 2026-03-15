import { HeroSection } from "@/components/home/HeroSection";
import { CategoryArticlesBlock } from "@/components/home/CategoryArticlesBlock";
import { LatestArticles } from "@/components/home/LatestArticles";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { FinalCTA } from "@/components/home/FinalCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      
      {/* Category Feeds representing an authoritative B2B Resource Hub */}
      <CategoryArticlesBlock categorySlug="accounting" categoryName="Accounting" />
      <CategoryArticlesBlock categorySlug="payroll" categoryName="Payroll & HR" />
      <CategoryArticlesBlock categorySlug="getting-paid" categoryName="Getting Paid" />
      <CategoryArticlesBlock categorySlug="tax-mtd" categoryName="Tax & MTD" />

      {/* Global Archive / Feed */}
      <LatestArticles />
      
      {/* Conversion / Trust Builders */}
      <NewsletterSection />
      <FinalCTA />
    </>
  );
}
