import { getBannerForSlot } from "@/lib/banners/resolve";
import { getRequestPathname } from "@/lib/middleware-pathname";
import { BannerEmbed } from "./BannerEmbed";

/** Fixed bottom anchor unit; renders nothing when empty or on admin routes. */
export async function GlobalAnchorSlot() {
  const pathname = await getRequestPathname();
  if (pathname.startsWith("/admin")) return null;

  const banner = await getBannerForSlot("global_anchor", { pathname });
  if (!banner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex justify-center px-4 pb-4 pointer-events-none">
      <div className="pointer-events-auto max-w-lg w-full">
        <BannerEmbed
          html={banner.html}
          embedMode={banner.embed_mode}
          bannerId={banner.id}
          lazyIframe={false}
        />
      </div>
    </div>
  );
}
