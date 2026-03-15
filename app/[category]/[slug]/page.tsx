import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ArticleHeader } from "@/components/articles/ArticleHeader";
import { ArticleContent } from "@/components/articles/ArticleContent";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Separator } from "@/components/ui/separator";
import type { Article } from "@/types";

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

async function getArticle(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("articles")
    .select("*, article_categories(category:categories(*))")
    .eq("slug", slug)
    .eq("status", "published")
    .single();
  return data as Article | null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) return {};

  return {
    title: article.meta_title || article.title,
    description: article.meta_description || article.excerpt,
    openGraph: {
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || "",
      images: article.thumbnail_url ? [{ url: article.thumbnail_url }] : [],
      type: "article",
      publishedTime: article.published_at || undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta_title || article.title,
      description: article.meta_description || article.excerpt || "",
      images: article.thumbnail_url ? [article.thumbnail_url] : [],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { category: categorySlug, slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  // Check if any of the article's categories match the categorySlug from the URL
  const matchesCategory = article.article_categories?.some(
    (ac: any) => ac.category?.slug === categorySlug
  );

  if (!matchesCategory) {
    notFound();
  }

  // Get IDs of all categories this article belongs to
  const catIds = article.article_categories?.map((ac: any) => ac.category?.id).filter(Boolean) || [];

  const supabase = await createClient();
  let related: Article[] = [];

  if (catIds.length > 0) {
    // To find related articles in a many-to-many relationship we'd typically query the junction table
    // For simplicity, we can fetch recently published articles and filter those that share a category
    const { data: recentArticles } = await supabase
      .from("articles")
      .select("*, article_categories(category_id)")
      .eq("status", "published")
      .neq("id", article.id)
      .order("published_at", { ascending: false })
      .limit(20);

    const relatedFiltered = (recentArticles as any[])?.filter((a) =>
      a.article_categories?.some((ac: any) => catIds.includes(ac.category_id))
    ) || [];

    related = relatedFiltered.slice(0, 3) as Article[];
  }

  return (
    <>
      <article className="max-w-4xl mx-auto px-6 py-16">
        <ArticleHeader article={article} />
        <ArticleContent content={article.content} />
      </article>

      {related.length > 0 && (
        <div className="max-w-4xl mx-auto px-6 pb-10">
          <Separator className="mb-12" />
          <h2 className="text-2xl font-bold mb-6">Related articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}

      <NewsletterSection />
    </>
  );
}
