import type { BannerSlotKey } from "@/types/banners";

/** IAB-style unit the ops team should request or upload for a placement. */
export interface RecommendedAdUnit {
  width: number;
  height: number;
  /** Common industry name, e.g. Leaderboard, Medium rectangle */
  name: string;
}

export interface BannerSlotDefinition {
  key: BannerSlotKey;
  label: string;
  description: string;
  recommendedUnits: RecommendedAdUnit[];
  /** One line: column width, device, or layout constraint */
  sizingHint: string;
}

export const BANNER_SLOTS: BannerSlotDefinition[] = [
  {
    key: "global_top_leaderboard",
    label: "Top leaderboard",
    description: "Full-width strip above or below the main nav.",
    recommendedUnits: [
      { width: 728, height: 90, name: "Leaderboard" },
      { width: 970, height: 90, name: "Large leaderboard" },
      { width: 970, height: 250, name: "Billboard" },
      { width: 320, height: 50, name: "Mobile banner" },
    ],
    sizingHint:
      "Spans the site header width. Use device targeting if you split desktop (728–970 wide) vs mobile (320×50).",
  },
  {
    key: "home_hero_rail",
    label: "Home hero rail",
    description: "Beside or within the hero area (desktop).",
    recommendedUnits: [
      { width: 300, height: 600, name: "Half-page" },
      { width: 300, height: 250, name: "Medium rectangle" },
      { width: 160, height: 600, name: "Wide skyscraper" },
    ],
    sizingHint:
      "Desktop rail is ~300px wide; half-page (300×600) or MPU (300×250) fit best. Hidden on small screens.",
  },
  {
    key: "home_below_hero",
    label: "Home — below hero",
    description: "First unit after the hero section.",
    recommendedUnits: [
      { width: 970, height: 250, name: "Billboard" },
      { width: 728, height: 90, name: "Leaderboard" },
    ],
    sizingHint: "Wide placement; billboard or leaderboard creatives avoid letterboxing.",
  },
  {
    key: "home_mid_feed",
    label: "Home — mid feed",
    description: "Between category blocks / mid homepage.",
    recommendedUnits: [
      { width: 300, height: 250, name: "Medium rectangle" },
      { width: 336, height: 280, name: "Large rectangle" },
    ],
    sizingHint: "Centered in the main column; MPU-family sizes are the standard fit.",
  },
  {
    key: "home_above_newsletter",
    label: "Home — above newsletter",
    description: "Immediately above the newsletter section.",
    recommendedUnits: [
      { width: 728, height: 90, name: "Leaderboard" },
      { width: 970, height: 250, name: "Billboard" },
      { width: 300, height: 250, name: "Medium rectangle" },
    ],
    sizingHint: "Full-width section; leaderboard or billboard reads cleanly above signup.",
  },
  {
    key: "category_below_header",
    label: "Category — below header",
    description: "Under category title and description.",
    recommendedUnits: [
      { width: 728, height: 90, name: "Leaderboard" },
      { width: 970, height: 90, name: "Large leaderboard" },
    ],
    sizingHint: "Matches category header width; keep height ≤90px for a tight editorial layout.",
  },
  {
    key: "category_in_grid",
    label: "Category — in grid",
    description: "After the first row of article cards.",
    recommendedUnits: [
      { width: 300, height: 250, name: "Medium rectangle" },
      { width: 336, height: 280, name: "Large rectangle" },
    ],
    sizingHint: "Sits in the card grid; MPU sizes align with card columns.",
  },
  {
    key: "article_below_header",
    label: "Article — below header",
    description: "After title/meta, before body.",
    recommendedUnits: [
      { width: 728, height: 90, name: "Leaderboard" },
      { width: 300, height: 250, name: "Medium rectangle" },
    ],
    sizingHint: "Article column is readable width; leaderboard or centered MPU both work.",
  },
  {
    key: "article_in_content_1",
    label: "Article — in content (1)",
    description: "After ~3rd paragraph.",
    recommendedUnits: [
      { width: 300, height: 250, name: "Medium rectangle" },
      { width: 336, height: 280, name: "Large rectangle" },
      { width: 320, height: 50, name: "Mobile banner" },
    ],
    sizingHint: "In-flow reading placement; MPU is typical. Use mobile sizes with device = Mobile if needed.",
  },
  {
    key: "article_in_content_2",
    label: "Article — in content (2)",
    description: "After ~7th paragraph.",
    recommendedUnits: [
      { width: 300, height: 250, name: "Medium rectangle" },
      { width: 336, height: 280, name: "Large rectangle" },
      { width: 320, height: 50, name: "Mobile banner" },
    ],
    sizingHint: "Same guidance as the first in-article slot; stagger campaigns with priority or schedule.",
  },
  {
    key: "article_below_content",
    label: "Article — below content",
    description: "After body, before related articles.",
    recommendedUnits: [
      { width: 728, height: 90, name: "Leaderboard" },
      { width: 300, height: 250, name: "Medium rectangle" },
    ],
    sizingHint: "Strong attention after read; leaderboard or MPU centered in the article column.",
  },
  {
    key: "sidebar_sticky",
    label: "Article — sticky sidebar",
    description: "Desktop sticky rail beside article.",
    recommendedUnits: [
      { width: 300, height: 600, name: "Half-page" },
      { width: 300, height: 250, name: "Medium rectangle" },
      { width: 160, height: 600, name: "Wide skyscraper" },
    ],
    sizingHint:
      "Layout reserves a 300px-wide column: use creatives ≤300px wide (e.g. 300×600 or 300×250) to avoid horizontal scroll.",
  },
  {
    key: "footer_above",
    label: "Footer above",
    description: "Above the site footer.",
    recommendedUnits: [
      { width: 728, height: 90, name: "Leaderboard" },
      { width: 970, height: 90, name: "Large leaderboard" },
    ],
    sizingHint: "Full-width pre-footer strip; standard leaderboard sizes.",
  },
  {
    key: "global_anchor",
    label: "Anchor (bottom)",
    description: "Fixed bottom unit (use sparingly).",
    recommendedUnits: [
      { width: 320, height: 50, name: "Mobile banner" },
      { width: 728, height: 90, name: "Leaderboard (compact)" },
    ],
    sizingHint:
      "Fixed to the viewport bottom; keep height small (50–90px) so content stays usable. One active anchor is enough.",
  },
];

export const BANNER_SLOT_KEYS = BANNER_SLOTS.map((s) => s.key) as BannerSlotKey[];

export function isBannerSlotKey(v: string): v is BannerSlotKey {
  return BANNER_SLOT_KEYS.includes(v as BannerSlotKey);
}

export function getBannerSlotDefinition(
  key: string,
): BannerSlotDefinition | undefined {
  return BANNER_SLOTS.find((s) => s.key === key);
}

export function formatAdUnitSize(u: RecommendedAdUnit): string {
  return `${u.width}×${u.height}`;
}
