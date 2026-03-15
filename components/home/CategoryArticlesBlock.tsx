import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { THUMBNAIL_IMAGE_QUALITY } from "@/lib/constants";
import { ReadTimeBadge } from "@/components/shared/ReadTimeBadge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

interface CategoryArticlesBlockProps {
  categorySlug: string;
  categoryName: string;
}

export async function CategoryArticlesBlock({
  categorySlug,
  categoryName,
}: CategoryArticlesBlockProps) {
  const supabase = await createClient();

  const { data: categoryData } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!categoryData) return null;

  const { data: junctions } = await supabase
    .from("article_categories")
    .select(`
      article:articles (
        *,
        article_categories(category:categories(*))
      )
    `)
    .eq("category_id", categoryData.id)
    .eq("article.status", "published")
    .order("article(published_at)", { ascending: false })
    .limit(4);

  const articles = (junctions?.map((j: any) => j.article).filter(Boolean) as Article[]) || [];

  if (articles.length === 0) return null;

  const lead = articles[0];
  const secondary = articles.slice(1);

  return (
    <section className="py-16 border-b border-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            {categoryName}
          </h2>
          <Link
            href={`/${categorySlug}`}
            className="text-sm font-bold text-brand-accent hover:text-accent-hover transition-colors flex items-center gap-1"
          >
            View all {categoryName.toLowerCase()} articles &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Main Article (Left) */}
          <Link
            href={`/${(lead.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${lead.slug}`}
            className="group block"
          >
            <div className="overflow-hidden bg-slate-100">
              {lead.thumbnail_url ? (
                <Image
                  src={lead.thumbnail_url}
                  alt={lead.title}
                  width={1200}
                  height={675}
                  quality={THUMBNAIL_IMAGE_QUALITY}
                  sizes="(max-width: 1024px) 100vw, 1200px"
                  className="w-full aspect-video object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                />
              ) : (
                <div className="w-full aspect-video bg-slate-200" />
              )}
            </div>
            <div className="mt-5">
              <div className="flex items-center gap-3 text-xs font-bold text-brand-accent uppercase tracking-wider">
                <span>NEW</span>
                <span className="text-slate-300">|</span>
                <ReadTimeBadge minutes={lead.read_time} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 leading-snug mt-3 group-hover:text-brand-accent transition-colors duration-200">
                {lead.title}
              </h3>
              <p className="text-base text-slate-600 mt-3 leading-relaxed line-clamp-3 font-medium">
                {lead.excerpt}
              </p>
            </div>
          </Link>

          {/* Secondary Articles (Right) */}
          {secondary.length > 0 ? (
            <div className="flex flex-col gap-8 md:gap-0 justify-between">
              {secondary.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/${(article.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${article.slug}`}
                  className={`group flex gap-6 md:gap-8 ${
                    i !== secondary.length - 1 ? "md:border-b border-border md:pb-6" : ""
                  }`}
                >
                  <div className="overflow-hidden bg-slate-100 shrink-0">
                    {article.thumbnail_url ? (
                      <Image
                        src={article.thumbnail_url}
                        alt={article.title}
                        width={384}
                        height={256}
                        quality={THUMBNAIL_IMAGE_QUALITY}
                        sizes="(max-width: 768px) 128px, 256px"
                        className="w-32 h-24 object-cover group-hover:scale-[1.03] transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-32 h-24 bg-slate-200" />
                    )}
                  </div>
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                      <span>{article.published_at ? formatDate(article.published_at) : ""}</span>
                    </div>
                    <h4 className="text-lg font-black text-slate-900 leading-tight group-hover:text-brand-accent transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="hidden lg:block bg-slate-50 border border-dashed border-slate-200 flex items-center justify-center">
              <p className="text-sm font-medium text-slate-400">More {categoryName} articles coming soon</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
