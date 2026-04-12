/**
 * Ad ops often paste a full HTML document from a network UI. Our iframe wrapper
 * already defines the outer document; keep only the body fragment so layout
 * height matches the creative (no nested document quirks / double scrollbars).
 */
export function normalizeAdHtmlForIframe(html: string): string {
  const t = html.trim();
  if (!t) return t;

  const looksLikeDocument =
    /<!DOCTYPE/i.test(t) || /<\s*html[\s>]/i.test(t);
  if (!looksLikeDocument) return html;

  const bodyMatch = t.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1].trim();

  const stripped = t
    .replace(/^[\s\S]*?<\/head>\s*/i, "")
    .replace(/<\/html>\s*$/i, "")
    .trim();
  return stripped || html;
}
