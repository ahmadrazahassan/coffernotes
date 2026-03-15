import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ReadTimeBadge } from "@/components/shared/ReadTimeBadge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";
import { ArrowRight } from "lucide-react";

export async function LatestArticles() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("*, article_categories(category:categories(*))")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .range(12, 23);

  const items = (articles as Article[]) || [];

  if (items.length === 0) return null;

  const [highlight, ...grid] = items;

  return (
    <section className="py-14 border-t border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3 flex-1">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
              Latest from the Archive
            </h2>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Link
            href="/accounting"
            className="flex items-center gap-1 text-sm font-medium text-brand-accent hover:text-accent-hover transition-colors ml-6 whitespace-nowrap"
          >
            All articles <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Highlight article — left, full height */}
          <div className="lg:col-span-5 lg:pr-8 lg:border-r lg:border-border mb-10 lg:mb-0">
            <Link
              href={`/${(highlight.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${highlight.slug}`}
              className="group block"
            >
              {highlight.thumbnail_url ? (
                <div className="overflow-hidden bg-slate-100">
                  <Image
                    src={highlight.thumbnail_url}
                    alt={highlight.title}
                    width={600}
                    height={400}
                    className="w-full aspect-[3/2] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="w-full aspect-[3/2] bg-slate-200" />
              )}
              <div className="mt-4">
                <div className="flex items-center gap-2">
                  {(highlight.article_categories as any)?.[0]?.category && (
                    <CategoryPill name={(highlight.article_categories as any)[0].category.name} />
                  )}
                  <ReadTimeBadge minutes={highlight.read_time} />
                </div>
                <h3 className="text-3xl font-black leading-tight mt-4 text-slate-900 group-hover:text-brand-accent transition-colors tracking-tight">
                  {highlight.title}
                </h3>
                <p className="text-base text-slate-600 mt-4 leading-relaxed line-clamp-3 font-medium">
                  {highlight.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-6 text-sm">
                  <span className="font-bold text-slate-900">{highlight.author_name}</span>
                  {highlight.published_at && (
                    <>
                      <span className="text-border">/</span>
                      <span className="text-text-secondary">{formatDate(highlight.published_at)}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Right column — text-heavy list */}
          <div className="lg:col-span-7 lg:pl-8">
            <div className="flex flex-col divide-y divide-border">
              {grid.map((article) => (
                <Link
                  key={article.id}
                  href={`/${(article.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${article.slug}`}
                  className="group flex gap-5 py-5 first:pt-0 last:pb-0"
                >
                  <div className="flex-1 min-w-0">
                    {(article.article_categories as any)?.[0]?.category && (
                      <span className="text-[11px] font-bold uppercase tracking-wide text-brand-accent">
                        {(article.article_categories as any)[0].category.name}
                      </span>
                    )}
                    <h4 className="text-lg font-black leading-snug mt-2 line-clamp-2 text-slate-900 group-hover:text-brand-accent transition-colors duration-200">
                      {article.title}
                    </h4>
                    <p className="text-sm text-slate-600 font-medium mt-2 line-clamp-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-3 text-xs text-slate-500 font-bold uppercase tracking-widest">
                      <span>{article.author_name}</span>
                      {article.published_at && (
                        <>
                          <span className="text-border">&middot;</span>
                          <span>{formatDate(article.published_at)}</span>
                        </>
                      )}
                      {article.read_time && (
                        <>
                          <span className="text-border">&middot;</span>
                          <ReadTimeBadge minutes={article.read_time} />
                        </>
                      )}
                    </div>
                  </div>
                  {article.thumbnail_url ? (
                    <Image
                      src={article.thumbnail_url}
                      alt={article.title}
                      width={120}
                      height={80}
                      className="w-32 h-24 object-cover flex-shrink-0 group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-32 h-24 bg-slate-200 flex-shrink-0" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
