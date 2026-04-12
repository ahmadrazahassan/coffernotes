import type { ReactNode } from "react";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { getBannerForSlot } from "@/lib/banners/resolve";
import { buildArticleBodyBlocks } from "@/lib/banners/splitArticleContent";
import type { BannerSlotKey } from "@/types/banners";
import { BannerEmbed } from "./BannerEmbed";

export async function ArticleBodyWithBanners({
  content,
  pathname,
}: {
  content: string;
  pathname: string;
}) {
  const blocks = buildArticleBodyBlocks(content);
  const nodes: ReactNode[] = [];
  let htmlKey = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "html") {
      if (!block.html.trim()) continue;
      nodes.push(
        <ArticleContent key={`html-${htmlKey++}`} content={block.html} />
      );
      continue;
    }

    const slotKey: BannerSlotKey =
      block.slot === "article_in_content_1"
        ? "article_in_content_1"
        : "article_in_content_2";

    const banner = await getBannerForSlot(slotKey, { pathname });
    if (!banner) continue;

    nodes.push(
      <aside
        key={slotKey}
        className="contents"
        data-slot={slotKey}
        aria-hidden="true"
      >
        <BannerEmbed
          html={banner.html}
          embedMode={banner.embed_mode}
          bannerId={banner.id}
          lazyIframe
        />
      </aside>
    );
  }

  return <>{nodes}</>;
}
