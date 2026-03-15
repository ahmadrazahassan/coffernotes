import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ReadTimeBadge } from "@/components/shared/ReadTimeBadge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

export async function FeaturedArticles() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*, article_categories(category:categories(*))")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(5, 12);

  const items = (articles as Article[]) || [];

  if (items.length === 0) return null;

  const topRow = items.slice(0, 3);
  const bottomRow = items.slice(3, 7);

  return (
    <section className="py-14">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-10">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary whitespace-nowrap">
            Recent Guides
          </h2>
          <span className="h-px flex-1 bg-border" />
        </div>

        {/* Top row: 3-column editorial grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
          {topRow.map((article) => (
            <Link
              key={article.id}
              href={`/${(article.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${article.slug}`}
              className="group"
            >
              <div className="overflow-hidden rounded-xl">
                {article.thumbnail_url ? (
                  <Image
                    src={article.thumbnail_url}
                    alt={article.title}
                    width={500}
                    height={300}
                    className="w-full aspect-[5/3] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full aspect-[5/3] bg-surface rounded-xl" />
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  {(article.article_categories as any)?.[0]?.category && (
                    <CategoryPill name={(article.article_categories as any)[0].category.name} />
                  )}
                </div>
                <h3 className="text-lg font-bold leading-snug mt-2.5 line-clamp-2 group-hover:text-brand-accent transition-colors duration-200">
                  {article.title}
                </h3>
                <p className="text-sm text-text-secondary mt-2 leading-relaxed line-clamp-2">
                  {article.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-3 text-xs text-text-secondary">
                  <span className="font-medium text-text-primary">{article.author_name}</span>
                  {article.published_at && (
                    <>
                      <span className="text-border">/</span>
                      <span>{formatDate(article.published_at)}</span>
                    </>
                  )}
                  <span className="text-border">/</span>
                  <ReadTimeBadge minutes={article.read_time} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom row: horizontal compact list */}
        {bottomRow.length > 0 && (
          <div className="mt-10 pt-10 border-t border-border">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6">
              {bottomRow.map((article) => (
                <Link
                  key={article.id}
                  href={`/${(article.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${article.slug}`}
                  className="group flex gap-4"
                >
                  {article.thumbnail_url ? (
                    <Image
                      src={article.thumbnail_url}
                      alt={article.title}
                      width={80}
                      height={80}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0 group-hover:scale-[1.04] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-surface flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    {(article.article_categories as any)?.[0]?.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-brand-accent">
                        {(article.article_categories as any)[0].category.name}
                      </span>
                    )}
                    <h4 className="text-sm font-bold leading-snug mt-0.5 line-clamp-2 group-hover:text-brand-accent transition-colors duration-200">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
