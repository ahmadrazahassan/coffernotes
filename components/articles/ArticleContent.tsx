"use client";

import DOMPurify from "isomorphic-dompurify";

interface ArticleContentProps {
  content: string;
}

/**
 * Checks whether a URL points to an external (non-Finlytic) site.
 * Internal links start with "/" or match our domain.
 */
function isExternalUrl(href: string): boolean {
  if (!href) return false;
  if (href.startsWith("/") || href.startsWith("#")) return false;
  try {
    const url = new URL(href);
    return !url.hostname.endsWith("finlytic.uk");
  } catch {
    return false;
  }
}

export function ArticleContent({ content }: ArticleContentProps) {
  // Register DOMPurify hook to transform external links during sanitization.
  // This is the professional approach — no regex, operates on the parsed DOM.
  DOMPurify.addHook("afterSanitizeAttributes", (node) => {
    if (node.tagName === "A") {
      const href = node.getAttribute("href") || "";

      if (isExternalUrl(href)) {
        // SEO compliance: nofollow + sponsored + safety attrs
        node.setAttribute(
          "rel",
          "nofollow sponsored noopener noreferrer"
        );
        node.setAttribute("target", "_blank");

        // Add a data attribute for CSS styling (external link icon)
        node.setAttribute("data-external", "true");
      }
    }
  });

  const sanitized = DOMPurify.sanitize(content, {
    ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td"],
    ADD_ATTR: [
      "class",
      "colspan",
      "rowspan",
      "style",
      "target",
      "rel",
      "data-external",
    ],
  });

  // Clean up the hook after sanitization to avoid stacking on re-renders
  DOMPurify.removeAllHooks();

  return (
    <div
      className="article-content mt-10"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
