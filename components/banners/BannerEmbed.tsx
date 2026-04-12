"use client";

import { useEffect, useRef } from "react";
import { normalizeAdHtmlForIframe } from "@/lib/banners/normalizeAdHtml";
import { mountAdHtmlInIframe } from "@/lib/banners/mountAdIframe";
import type { BannerEmbedMode } from "@/types/banners";

/**
 * Third-party ad HTML runs inside a sandboxed iframe by default so scripts do not
 * run in the parent page. Do not pass this HTML through DOMPurify — networks rely on
 * script/iframe tags. Sandbox tokens are a tradeoff: tighten if a creative fails to load.
 *
 * Iframe height: browsers default iframes to ~150px tall, which causes inner scrollbars
 * for standard IAB units. We sync height to the inner document (see mountAdHtmlInIframe).
 */
export function BannerEmbed({
  html,
  embedMode,
  bannerId,
  className,
  lazyIframe,
}: {
  html: string;
  embedMode: BannerEmbedMode;
  bannerId: string;
  className?: string;
  lazyIframe?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (embedMode !== "iframe") return;
    const iframe = iframeRef.current;
    if (!iframe) return;
    return mountAdHtmlInIframe(iframe, html);
  }, [html, embedMode]);

  if (embedMode === "inline") {
    const fragment = normalizeAdHtmlForIframe(html);
    return (
      <div
        className={className}
        data-banner-id={bannerId}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: fragment }}
      />
    );
  }

  return (
    <div
      className={className}
      data-banner-id={bannerId}
      style={{ lineHeight: 0 }}
    >
      <iframe
        ref={iframeRef}
        title="Advertisement"
        className="w-full max-w-full border-0 bg-transparent align-middle"
        style={{ display: "block", overflow: "hidden" }}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms"
        loading={lazyIframe ? "lazy" : "eager"}
      />
    </div>
  );
}
