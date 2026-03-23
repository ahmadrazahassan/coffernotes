import { createClient } from "@/lib/supabase/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.crestwell.uk";

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

  const { data: junctions } = await supabase
    .from("article_categories")
    .select(
      "article:articles(title, slug, excerpt, published_at, status), category:categories(slug)"
    );

  const bySlug = new Map<
    string,
    { title: string; slug: string; excerpt: string; published_at: string; catSlug: string }
  >();
  for (const row of (junctions || []) as any[]) {
    const article = row?.article;
    const category = row?.category;
    if (
      article?.status !== "published" ||
      !article?.slug ||
      !category?.slug ||
      article.published_at == null
    )
      continue;
    const key = article.slug;
    if (!bySlug.has(key) || new Date(article.published_at) > new Date(bySlug.get(key)!.published_at))
      bySlug.set(key, {
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt || "",
        published_at: article.published_at,
        catSlug: category.slug,
      });
  }
  const sorted = [...bySlug.values()].sort(
    (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
  ).slice(0, 50);

  const items = sorted
    .map(
      (a) => `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/${a.catSlug}/${a.slug}</link>
      <description>${escapeXml(a.excerpt || "")}</description>
      <pubDate>${new Date(a.published_at).toUTCString()}</pubDate>
      <guid>${SITE_URL}/${a.catSlug}/${a.slug}</guid>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Crestwell</title>
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
