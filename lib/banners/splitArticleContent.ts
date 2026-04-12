/**
 * Splits article HTML after the Nth closing </p> (case-insensitive).
 * Best-effort for typical TipTap/article markup; non-<p> blocks stay in surrounding segments.
 */

export type ArticleBodyBlock =
  | { type: "html"; html: string }
  | { type: "banner_marker"; slot: "article_in_content_1" | "article_in_content_2" };

function splitAfterNthClosingP(
  html: string,
  n: number
): [string, string] | null {
  if (n <= 0) return [html, ""];
  const re = /<\/p>/gi;
  let count = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    count++;
    if (count === n) {
      const idx = m.index + m[0].length;
      return [html.slice(0, idx), html.slice(idx)];
    }
  }
  return null;
}

/**
 * Builds ordered blocks: html segments and markers for in-content banner slots.
 * Markers are omitted downstream if no banner is resolved for that slot.
 */
export function buildArticleBodyBlocks(html: string): ArticleBodyBlock[] {
  const trimmed = html?.trim() ?? "";
  if (!trimmed) return [];

  const blocks: ArticleBodyBlock[] = [];
  const after3 = splitAfterNthClosingP(trimmed, 3);

  if (!after3) {
    return [{ type: "html", html: trimmed }];
  }

  const [first, restAfter3] = after3;
  if (first.trim()) blocks.push({ type: "html", html: first });
  blocks.push({ type: "banner_marker", slot: "article_in_content_1" });

  const after7inRest = splitAfterNthClosingP(restAfter3, 4);
  if (!after7inRest) {
    if (restAfter3.trim()) blocks.push({ type: "html", html: restAfter3 });
    return blocks;
  }

  const [mid, tail] = after7inRest;
  if (mid.trim()) blocks.push({ type: "html", html: mid });
  blocks.push({ type: "banner_marker", slot: "article_in_content_2" });
  if (tail.trim()) blocks.push({ type: "html", html: tail });

  return blocks;
}
