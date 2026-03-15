import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://coffernotes.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("slug, updated_at, category:categories(slug)")
    .eq("status", "published");

  const { data: categories } = await supabase
    .from("categories")
    .select("slug");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const articleUrls: MetadataRoute.Sitemap = (articles || []).map((a: any) => {
    const catSlug = Array.isArray(a.category)
      ? a.category[0]?.slug
      : a.category?.slug;
    return {
      url: `${SITE_URL}/${catSlug}/${a.slug}`,
      lastModified: a.updated_at,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    };
  });

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
    ...categoryUrls,
    ...articleUrls,
  ];
}
