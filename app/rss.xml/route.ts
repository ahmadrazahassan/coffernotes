import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coffernotes.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("title, slug, excerpt, published_at, category:categories(slug)")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(50);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const items = (articles || [])
    .map((a: any) => {
      const catSlug = Array.isArray(a.category)
        ? a.category[0]?.slug
        : a.category?.slug;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/${catSlug}/${a.slug}</link>
      <description>${escapeXml(a.excerpt || "")}</description>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <guid>${SITE_URL}/${catSlug}/${a.slug}</guid>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Coffer Notes</title>
    <link>${SITE_URL}</link>
    <description>UK small business finance, explained properly.</description>
    <language>en-gb</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
