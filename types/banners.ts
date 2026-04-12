export type BannerSlotKey =
  | "global_top_leaderboard"
  | "home_hero_rail"
  | "home_below_hero"
  | "home_mid_feed"
  | "home_above_newsletter"
  | "category_below_header"
  | "category_in_grid"
  | "article_below_header"
  | "article_in_content_1"
  | "article_in_content_2"
  | "article_below_content"
  | "sidebar_sticky"
  | "footer_above"
  | "global_anchor";

export type BannerEmbedMode = "iframe" | "inline";

export type BannerDevice = "all" | "desktop" | "mobile";

export interface BannerRow {
  id: string;
  slot_key: string;
  name: string;
  html: string;
  embed_mode: BannerEmbedMode;
  enabled: boolean;
  priority: number;
  starts_at: string | null;
  ends_at: string | null;
  target_paths: string[] | null;
  exclude_paths: string[] | null;
  device: BannerDevice;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResolvedBanner {
  id: string;
  slot_key: string;
  html: string;
  embed_mode: BannerEmbedMode;
}
