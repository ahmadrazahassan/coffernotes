import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { SITE_TAGLINE, THUMBNAIL_IMAGE_QUALITY } from "@/lib/constants";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ReadTimeBadge } from "@/components/shared/ReadTimeBadge";
import { BannerSlot } from "@/components/banners/BannerSlot";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

export async function HeroSection() {
  const supabase = await createClient();

  const { data: articles } = await supabase
    .from("articles")
    .select("*, article_categories(category:categories(*))")
    .eq("featured", true)
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(5);

  const items = (articles as Article[]) || [];
  const lead = items[0];
  const secondary = items.slice(1, 4);
  const sidebar = items[4];

  if (!lead) {
    return (
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 border border-border rounded-lg px-3 py-1.5 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent" />
                <span className="text-xs font-medium text-text-secondary">{SITE_TAGLINE}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                Compare accounting software with confidence.
              </h1>
              <p className="text-xl text-slate-600 mt-6 leading-relaxed max-w-lg font-medium">
                Independent reviews and buyer-focused guides for Sage, Xero, QuickBooks, and the workflows UK small businesses run every month.
              </p>
              <div className="flex items-center gap-6 mt-8">
                <Link
                  href="#topics"
                  className="inline-flex items-center justify-center rounded-xl px-6 py-3 bg-brand-accent text-white font-medium hover:bg-accent-hover transition-colors text-sm"
                >
                  Explore topics
                </Link>
                <Link
                  href="/about"
                  className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
                >
                  About our editorial process
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-3">
                {["Accounting", "Getting Paid", "Payroll", "Tax & MTD"].map((topic, i) => (
                  <div key={topic} className={`rounded-none border-l-4 p-6 ${i === 0 ? "bg-slate-50 border-brand-accent" : "bg-white border-transparent hover:bg-slate-50 transition-colors"}`}>
                    <p className="text-base font-bold text-slate-900">{topic}</p>
                    <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                      {["Bookkeeping, reconciliation, digital records", "Invoicing, payment terms, collection", "PAYE, RTI, pensions, statutory pay", "VAT, MTD, Self Assessment, deadlines"][i]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-b border-border">
      <div className="max-w-7xl mx-auto px-6 pt-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Lead article — 8 columns */}
          <div className="lg:col-span-8 lg:pr-8 lg:border-r lg:border-border">
            <Link
              href={`/${(lead.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${lead.slug}`}
              className="group block"
            >
              <div className="overflow-hidden bg-slate-100">
                {lead.thumbnail_url ? (
                  <Image
                    src={lead.thumbnail_url}
                    alt={lead.title}
                    width={960}
                    height={540}
                    quality={THUMBNAIL_IMAGE_QUALITY}
                    sizes="(max-width: 1024px) 100vw, 960px"
                    className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    priority
                  />
                ) : (
                  <div className="w-full aspect-[16/9] bg-slate-200" />
                )}
              </div>
              <div className="mt-5">
                <div className="flex items-center gap-3">
                  {(lead.article_categories as any)?.[0]?.category && (
                    <CategoryPill name={(lead.article_categories as any)[0].category.name} />
                  )}
                  <ReadTimeBadge minutes={lead.read_time} />
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] font-black text-slate-900 leading-[1.08] mt-4 group-hover:text-brand-accent transition-colors duration-200 tracking-tight max-w-3xl">
                  {lead.title}
                </h1>
                <p className="text-lg text-slate-600 mt-4 leading-relaxed line-clamp-2 max-w-2xl font-medium">
                  {lead.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-6 text-sm">
                  <span className="font-bold text-slate-900">{lead.author_name}</span>
                  {lead.published_at && (
                    <>
                      <span className="text-border">/</span>
                      <span className="text-text-secondary">{formatDate(lead.published_at)}</span>
                    </>
                  )}
                </div>
              </div>
            </Link>
          </div>

          {/* Right rail — 4 columns */}
          <div className="lg:col-span-4 lg:pl-8 mt-8 lg:mt-0">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-text-secondary">Top stories</span>
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex flex-col divide-y divide-border">
              {secondary.map((article, i) => (
                <Link
                  key={article.id}
                  href={`/${(article.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${article.slug}`}
                  className={`group flex gap-4 ${i === 0 ? "pb-5" : "py-5"}`}
                >
                  <span className="text-2xl font-extrabold text-border/70 leading-none mt-0.5 select-none w-6 flex-shrink-0">
                    {i + 2}
                  </span>
                  <div className="flex-1 min-w-0">
                    {(article.article_categories as any)?.[0]?.category && (
                      <span className="text-[11px] font-semibold text-brand-accent uppercase tracking-wide">
                        {(article.article_categories as any)[0].category.name}
                      </span>
                    )}
                    <h3 className="text-base font-black text-slate-900 leading-snug mt-1.5 line-clamp-3 group-hover:text-brand-accent transition-colors duration-200">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-2">
                      {article.author_name}
                      {article.published_at && (
                        <> &middot; {formatDate(article.published_at)}</>
                      )}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {sidebar && (
              <Link
                href={`/${(sidebar.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${sidebar.slug}`}
                className="group block mt-5 pt-5 border-t border-border"
              >
                {sidebar.thumbnail_url ? (
                  <Image
                    src={sidebar.thumbnail_url}
                    alt={sidebar.title}
                    width={400}
                    height={225}
                    quality={THUMBNAIL_IMAGE_QUALITY}
                    sizes="(max-width: 1024px) 33vw, 400px"
                    className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full aspect-[16/9] bg-slate-100" />
                )}
                <h3 className="text-base font-black text-slate-900 leading-snug mt-4 line-clamp-2 group-hover:text-brand-accent transition-colors">
                  {sidebar.title}
                </h3>
              </Link>
            )}

            <div className="hidden lg:block mt-8">
              <BannerSlot
                slotKey="home_hero_rail"
                pathname="/"
                className="flex justify-center"
                lazyIframe
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
