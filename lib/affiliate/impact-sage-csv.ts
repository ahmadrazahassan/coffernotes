/**
 * Integration guide: `public/Assests_for_banners.csv` (Impact.com / Sage UK export)
 *
 * What the CSV contains
 * - Metadata: AdId, Name, IabAdUnit, creative filename, width × height (ThirdPartyServableAdCreativeWidth × Height),
 *   TrackingLink (`https://sageuklimited.sjv.io/c/...`), LandingPage, GetHtmlCodeType = HTML_AND_IFRAME for all rows.
 * - It does NOT include the actual embed snippet or a full image URL — only filenames like `Display_300x250px_Set_01_100FOR3.png`.
 *
 * How to use with this site’s banner system (`/admin/banners`)
 * 1) Preferred: In Impact, open each ad → “Get HTML” / “Ad code” → copy the full snippet → paste into the banner HTML field,
 *    embed mode **iframe** (handles `<script>` tags Impact often emits).
 * 2) Static image + click URL: If you host the creative (e.g. Supabase Storage) or have the full CDN `src` from Impact’s tag,
 *    use `buildImpactStyleImageBannerHtml()` below → paste result → embed mode **inline** (no scripts, good for simple `<a><img></a>`).
 * 3) TEXT_LINK rows: No banner image — use tracking URL in article copy or a small custom HTML `<a>` in a narrow slot with **inline**.
 * 4) VIDEO rows: Paste the iframe/script block Impact provides (or YouTube embed) into **iframe** mode.
 *
 * Compliance: Use `rel="nofollow sponsored noopener noreferrer"` and `target="_blank"` on outbound affiliate links (helper does this).
 */

import type { BannerSlotKey } from "@/types/banners";

export type ImpactExportAdType = "BANNER" | "TEXT_LINK" | "VIDEO";

/** Typical IAB labels from the Sage export CSV. */
export type ImpactIabAdUnit =
  | "LEADERBOARD"
  | "MEDIUM_RECTANGLE"
  | "HALF_PAGE_AD"
  | "SKYSCRAPER"
  | "WIDE_SKYSCRAPER"
  | "FULL_BANNER"
  | "CUSTOM"
  | (string & {});

export interface ImpactCsvRowLike {
  AdType?: string;
  IabAdUnit?: string;
  ThirdPartyServableAdCreativeWidth?: string | number;
  ThirdPartyServableAdCreativeHeight?: string | number;
  TrackingLink?: string;
  ImageAlternativeTag?: string;
  Name?: string;
}

function escapeHtmlAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function parseDim(v: string | number | undefined): number {
  if (v === undefined || v === "") return 0;
  const n = typeof v === "number" ? v : parseInt(String(v), 10);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Builds minimal, standards-friendly HTML: linked image suitable for **inline** embed mode.
 * `imageUrl` must be an absolute HTTPS URL (self-hosted or copied from Impact’s generated tag).
 */
export function buildImpactStyleImageBannerHtml(params: {
  trackingUrl: string;
  imageUrl: string;
  width: number;
  height: number;
  alt: string;
}): string {
  const { trackingUrl, imageUrl, width, height, alt } = params;
  const a = escapeHtmlAttr(trackingUrl);
  const src = escapeHtmlAttr(imageUrl);
  const altE = escapeHtmlAttr(alt || "Advertisement");
  const w = Math.max(1, Math.round(width));
  const h = Math.max(1, Math.round(height));
  return `<a href="${a}" target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="${src}" alt="${altE}" width="${w}" height="${h}" loading="lazy" decoding="async" style="display:block;max-width:100%;height:auto;" /></a>`;
}

/**
 * Suggested placement keys for a row (editorial hints — you can override).
 * TEXT_LINK: no display unit; use in prose or a minimal HTML strip, not a large slot.
 */
export function suggestedBannerSlotsForImpactRow(row: ImpactCsvRowLike): BannerSlotKey[] {
  const adType = (row.AdType || "").toUpperCase() as ImpactExportAdType | string;
  if (adType === "TEXT_LINK") return [];

  const iab = (row.IabAdUnit || "").toUpperCase() as ImpactIabAdUnit;
  const w = parseDim(row.ThirdPartyServableAdCreativeWidth);
  const h = parseDim(row.ThirdPartyServableAdCreativeHeight);

  if (adType === "VIDEO") {
    return ["article_in_content_1", "home_mid_feed", "article_below_header"];
  }

  if (iab === "LEADERBOARD" || (w === 728 && h === 90) || (w === 970 && h === 90)) {
    return ["global_top_leaderboard", "category_below_header", "home_below_hero"];
  }

  if (iab === "MEDIUM_RECTANGLE" || (w === 300 && h === 250)) {
    return [
      "home_mid_feed",
      "category_in_grid",
      "article_in_content_1",
      "article_in_content_2",
      "sidebar_sticky",
    ];
  }

  if (iab === "HALF_PAGE_AD" || (w === 300 && h === 600)) {
    return ["sidebar_sticky", "home_hero_rail", "article_in_content_1"];
  }

  if (iab === "SKYSCRAPER" || (w === 120 && h === 600)) {
    return ["sidebar_sticky", "home_hero_rail"];
  }

  if (iab === "WIDE_SKYSCRAPER" || (w === 160 && h === 600)) {
    return ["sidebar_sticky", "home_hero_rail"];
  }

  if (w === 320 && h === 50) {
    return ["global_anchor", "global_top_leaderboard", "home_below_hero"];
  }

  if (w === 970 && h === 250) {
    return ["home_below_hero", "global_top_leaderboard", "home_mid_feed"];
  }

  if (w >= 700 && h >= 400) {
    return ["home_hero_rail", "footer_above", "home_above_newsletter"];
  }

  if (iab === "FULL_BANNER" || (w === 468 && h === 60)) {
    return ["global_top_leaderboard", "home_below_hero"];
  }

  return ["home_mid_feed", "category_in_grid", "article_below_header"];
}
