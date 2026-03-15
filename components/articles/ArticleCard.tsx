import Link from "next/link";
import Image from "next/image";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { THUMBNAIL_IMAGE_QUALITY } from "@/lib/constants";
import { ReadTimeBadge } from "@/components/shared/ReadTimeBadge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <Link
      href={`/${(article.article_categories as any)?.[0]?.category?.slug || "uncategorized"}/${article.slug}`}
      className="rounded-2xl border border-border overflow-hidden hover:shadow-sm transition-shadow block"
    >
      {article.thumbnail_url ? (
        <Image
          src={article.thumbnail_url}
          alt={article.title}
          width={600}
          height={340}
          quality={THUMBNAIL_IMAGE_QUALITY}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="aspect-video object-cover w-full"
        />
      ) : (
        <div className="aspect-video bg-surface w-full" />
      )}
      <div className="p-6">
        {(article.article_categories as any)?.[0]?.category && <CategoryPill name={(article.article_categories as any)[0].category.name} />}
        <h3 className="text-xl font-bold mt-3 line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-text-secondary mt-2 line-clamp-2">
          {article.excerpt}
        </p>
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-text-secondary">
            {article.author_name}
            {article.published_at && (
              <> &middot; {formatDate(article.published_at)}</>
            )}
          </span>
          <ReadTimeBadge minutes={article.read_time} />
        </div>
      </div>
    </Link>
  );
}
