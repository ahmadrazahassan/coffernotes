import { getBannerForSlot } from "@/lib/banners/resolve";
import { getRequestPathname } from "@/lib/middleware-pathname";
import type { BannerSlotKey } from "@/types/banners";
import { BannerEmbed } from "./BannerEmbed";

export async function BannerSlot({
  slotKey,
  pathname: pathnameProp,
  className,
  lazyIframe = true,
}: {
  slotKey: BannerSlotKey;
  pathname?: string;
  className?: string;
  /** Below-the-fold slots should lazy-load the iframe. */
  lazyIframe?: boolean;
}) {
  const pathname = pathnameProp ?? (await getRequestPathname());
  if (pathname.startsWith("/admin")) return null;

  const banner = await getBannerForSlot(slotKey, { pathname });
  if (!banner) return null;

  return (
    <BannerEmbed
      html={banner.html}
      embedMode={banner.embed_mode}
      bannerId={banner.id}
      className={className}
      lazyIframe={lazyIframe}
    />
  );
}
