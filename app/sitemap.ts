import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL_FALLBACK } from "@/lib/constants";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || SITE_URL_FALLBACK;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Articles are linked to categories via article_categories (many-to-many)
  const { data: junctions } = await supabase
    .from("article_categories")
    .select(
      "article:articles(slug, updated_at, status), category:categories(slug)"
    );

  const articleUrls: MetadataRoute.Sitemap = [];
  if (junctions) {
    for (const row of junctions as any[]) {
      const article = row?.article;
      const category = row?.category;
      if (
        article?.status === "published" &&
        article?.slug &&
        category?.slug
      ) {
        articleUrls.push({
          url: `${SITE_URL}/${category.slug}/${article.slug}`,
          lastModified: article.updated_at || new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        });
      }
    }
  }

  const { data: categories } = await supabase.from("categories").select("slug");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryUrls: MetadataRoute.Sitemap = (categories || []).map(
    (c: any) => ({
      url: `${SITE_URL}/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })
  );

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.4,
    },
    ...categoryUrls,
    ...articleUrls,
  ];
}
