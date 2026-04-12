import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import type { BannerEmbedMode, BannerSlotKey, ResolvedBanner } from "@/types/banners";

const SELECT_FIELDS =
  "id, slot_key, html, embed_mode, device, priority, updated_at, target_paths, exclude_paths, enabled, starts_at, ends_at";

function normalizePath(pathname: string): string {
  if (!pathname || pathname === "") return "/";
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (p.length > 1 && p.endsWith("/")) return p.slice(0, -1);
  return p;
}

function pathMatchesTarget(pathname: string, targetPaths: string[] | null): boolean {
  if (!targetPaths || targetPaths.length === 0) return true;
  const p = normalizePath(pathname);
  return targetPaths.some((raw) => {
    const t = normalizePath(raw.trim());
    return p === t || p.startsWith(t + "/");
  });
}

function pathMatchesExclude(pathname: string, excludePaths: string[] | null): boolean {
  if (!excludePaths || excludePaths.length === 0) return false;
  const p = normalizePath(pathname);
  return excludePaths.some((raw) => {
    const x = normalizePath(raw.trim());
    return p === x || p.startsWith(x + "/");
  });
}

function isActiveSchedule(
  enabled: boolean,
  startsAt: string | null,
  endsAt: string | null,
  now: number
): boolean {
  if (!enabled) return false;
  if (startsAt && new Date(startsAt).getTime() > now) return false;
  if (endsAt && new Date(endsAt).getTime() < now) return false;
  return true;
}

function deviceMatches(
  device: string,
  isMobile: boolean
): boolean {
  if (device === "all") return true;
  if (device === "mobile") return isMobile;
  if (device === "desktop") return !isMobile;
  return true;
}

/** Heuristic from User-Agent / Client Hints — not perfect. */
export function detectMobileFromHeaders(h: Headers): boolean {
  const chMobile = h.get("sec-ch-ua-mobile");
  if (chMobile === "?1") return true;
  if (chMobile === "?0") return false;
  const ua = h.get("user-agent") || "";
  return /Mobile|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    ua
  );
}

export interface ResolveBannerOptions {
  pathname: string;
  isMobile?: boolean;
}

/**
 * Resolves the winning banner for a slot. Returns null if none (caller must render nothing).
 * Always enforces enabled + schedule in code so authenticated admins browsing the site
 * do not see disabled creatives.
 */
export async function getBannerForSlot(
  slotKey: BannerSlotKey,
  options: ResolveBannerOptions
): Promise<ResolvedBanner | null> {
  const pathname = normalizePath(options.pathname);
  const h = await headers();
  const isMobile =
    options.isMobile !== undefined
      ? options.isMobile
      : detectMobileFromHeaders(h);

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("banners")
    .select(SELECT_FIELDS)
    .eq("slot_key", slotKey)
    .order("priority", { ascending: false })
    .order("updated_at", { ascending: false });

  if (error || !data?.length) return null;

  const now = Date.now();

  for (const row of data) {
    const enabled = row.enabled as boolean;
    const startsAt = row.starts_at as string | null;
    const endsAt = row.ends_at as string | null;
    if (!isActiveSchedule(enabled, startsAt, endsAt, now)) continue;
    if (!deviceMatches(row.device as string, isMobile)) continue;
    if (!pathMatchesTarget(pathname, row.target_paths as string[] | null)) continue;
    if (pathMatchesExclude(pathname, row.exclude_paths as string[] | null)) continue;
    const html = (row.html as string)?.trim();
    if (!html) continue;

    return {
      id: row.id as string,
      slot_key: row.slot_key as string,
      html,
      embed_mode: (row.embed_mode as BannerEmbedMode) || "iframe",
    };
  }

  return null;
}
