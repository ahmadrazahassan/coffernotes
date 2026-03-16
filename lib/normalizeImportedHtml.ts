import DOMPurify from "isomorphic-dompurify";

/**
 * Sanitize config aligned with ArticleContent so imported HTML renders correctly on the site.
 */
const SANITIZE_CONFIG = {
  ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td"],
  ADD_ATTR: ["class", "colspan", "rowspan", "style"],
} as const;

/**
 * Normalizes HTML imported from a file (e.g. full document or fragment) so it works
 * in the visual/HTML editor and on the frontend. Runs in the browser only.
 */
export function normalizeImportedHtml(html: string): string {
  if (!html || typeof html !== "string") return "";

  let toSanitize = html.trim();

  if (typeof document !== "undefined") {
    try {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const body = doc.body;
      if (body && (html.includes("<body") || html.includes("</body>"))) {
        toSanitize = body.innerHTML;
      }
    } catch {
      // Fall back to full string if parsing fails
    }
  }

  return DOMPurify.sanitize(toSanitize, SANITIZE_CONFIG);
}
