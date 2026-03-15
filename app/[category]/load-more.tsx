"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArticleCard } from "@/components/articles/ArticleCard";
import { createClient } from "@/lib/supabase/client";
import type { Article } from "@/types";

export function LoadMoreButton({ categoryId }: { categoryId: string }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [offset, setOffset] = useState(12);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("article_categories")
      .select(
        `
          article:articles (
            *,
            article_categories(category:categories(*))
          )
        `
      )
      .eq("category_id", categoryId)
      .eq("article.status", "published")
      .order("article(published_at)", { ascending: false })
      .range(offset, offset + 11);

    const items =
      (data?.map((j: any) => j.article).filter(Boolean) as Article[]) || [];

    setArticles((prev) => [...prev, ...items]);
    setOffset((prev) => prev + items.length);
    if (items.length < 12) setHasMore(false);
    setLoading(false);
  };

  return (
    <>
      {articles.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <Button
            onClick={loadMore}
            variant="outline"
            className="rounded-xl"
            disabled={loading}
          >
            {loading ? "Loading..." : "Load more"}
          </Button>
        </div>
      )}
    </>
  );
}
