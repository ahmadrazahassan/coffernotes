import type { BannerSlotKey } from "@/types/banners";

/** Editorial grouping for the banner admin placement picker (dashboard-style). */
export const BANNER_SLOT_GROUPS: {
  id: string;
  title: string;
  description: string;
  keys: BannerSlotKey[];
}[] = [
  {
    id: "site",
    title: "Site-wide",
    description: "Header, footer, and fixed anchor units.",
    keys: ["global_top_leaderboard", "footer_above", "global_anchor"],
  },
  {
    id: "home",
    title: "Homepage",
    description: "Hero rail, feed, and pre-footer on the home page.",
    keys: [
      "home_hero_rail",
      "home_below_hero",
      "home_mid_feed",
      "home_above_newsletter",
    ],
  },
  {
    id: "category",
    title: "Category",
    description: "Listing pages under each category.",
    keys: ["category_below_header", "category_in_grid"],
  },
  {
    id: "article",
    title: "Article",
    description: "Reading experience: body, sidebar, and end of article.",
    keys: [
      "article_below_header",
      "article_in_content_1",
      "article_in_content_2",
      "article_below_content",
      "sidebar_sticky",
    ],
  },
];
