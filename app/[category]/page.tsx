import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { LoadMoreButton } from "./load-more";
import type { Article, Category } from "@/types";

interface Props {
  params: Promise<{ category: string }>;
}

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.crestwell.uk";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params;
  const supabase = await createClient();
  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) return {};

  const canonical = `${BASE_URL}/${slug}`;

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical },
    openGraph: {
      title: category.name,
      description: category.description || undefined,
      url: canonical,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const cat = category as Category;

  // Articles are linked to categories via the article_categories junction table
  const { data: junctions } = await supabase
    .from("article_categories")
    .select(
      `
        article:articles (
          *,
          article_categories(category:categories(*))
        )
      `
    )
    .eq("category_id", cat.id)
    .eq("article.status", "published")
    .order("article(published_at)", { ascending: false })
    .range(0, 11);

  const items =
    (junctions?.map((j: any) => j.article).filter(Boolean) as Article[]) || [];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold">{cat.name}</h1>
      <p className="text-lg text-text-secondary mt-3">{cat.description}</p>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {items.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <p className="text-text-secondary mt-10">
          No articles published in this category yet.
        </p>
      )}

      {items.length >= 12 && <LoadMoreButton categoryId={cat.id} />}
    </div>
  );
}
