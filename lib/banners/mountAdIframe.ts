import { normalizeAdHtmlForIframe } from "@/lib/banners/normalizeAdHtml";

const IFRAME_DOC_STYLE = `html,body{margin:0;padding:0;max-width:100%;overflow:hidden;}`;

function buildIframeShell(fragment: string): string {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><base target="_blank" rel="noopener noreferrer"><style>${IFRAME_DOC_STYLE}</style></head><body>${fragment}</body></html>`;
}

/**
 * Writes normalized ad HTML into a same-origin iframe and keeps the iframe height
 * in sync with the inner document (avoids default ~150px iframe scrollbars).
 * Returns a dispose function (ResizeObserver, timers, listeners).
 */
export function mountAdHtmlInIframe(
  iframe: HTMLIFrameElement,
  html: string,
): () => void {
  let ro: ResizeObserver | null = null;
  let cancelled = false;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const measure = () => {
    if (cancelled) return;
    const d = iframe.contentDocument;
    if (!d?.body) return;
    const h = Math.max(
      d.body.scrollHeight,
      d.documentElement.scrollHeight,
    );
    if (h > 0) {
      iframe.style.height = `${Math.ceil(h)}px`;
    }
  };

  const wireImages = (root: Document) => {
    root.querySelectorAll("img").forEach((img) => {
      if (!img.complete) {
        img.addEventListener("load", measure, { once: true });
        img.addEventListener("error", measure, { once: true });
      }
    });
  };

  const mountShell = () => {
    if (cancelled) return;
    const doc = iframe.contentDocument;
    if (!doc) return;

    const fragment = normalizeAdHtmlForIframe(html);
    doc.open();
    doc.write(buildIframeShell(fragment));
    doc.close();

    const afterPaint = () => {
      if (cancelled) return;
      measure();
      const d = iframe.contentDocument;
      if (!d?.body) return;
      ro?.disconnect();
      ro = new ResizeObserver(() => measure());
      ro.observe(d.body);
      wireImages(d);
    };

    requestAnimationFrame(() => {
      requestAnimationFrame(afterPaint);
    });

    retryTimer = setTimeout(() => {
      if (!cancelled) measure();
    }, 120);
  };

  const onIframeLoad = () => mountShell();

  if (iframe.contentDocument) {
    mountShell();
  } else {
    iframe.addEventListener("load", onIframeLoad, { once: true });
  }

  return () => {
    cancelled = true;
    iframe.removeEventListener("load", onIframeLoad);
    if (retryTimer !== null) clearTimeout(retryTimer);
    ro?.disconnect();
  };
}
