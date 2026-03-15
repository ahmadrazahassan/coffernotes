import Image from "next/image";
import { CategoryPill } from "@/components/shared/CategoryPill";
import { ReadTimeBadge } from "@/components/shared/ReadTimeBadge";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

interface ArticleHeaderProps {
  article: Article;
}

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header>
      {(article.article_categories as any)?.[0]?.category && (
        <CategoryPill
          name={(article.article_categories as any)[0].category.name}
          slug={(article.article_categories as any)[0].category.slug}
          linked
        />
      )}
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4">
        {article.title}
      </h1>
      <div className="flex items-center gap-2 text-sm text-text-secondary mt-4">
        <span>{article.author_name}</span>
        {article.published_at && (
          <>
            <span>&middot;</span>
            <span>{formatDate(article.published_at)}</span>
          </>
        )}
        <span>&middot;</span>
        <ReadTimeBadge minutes={article.read_time} />
      </div>
      {article.thumbnail_url && (
        <Image
          src={article.thumbnail_url}
          alt={article.title}
          width={896}
          height={504}
          className="w-full rounded-2xl mt-8 aspect-video object-cover"
          priority
        />
      )}
    </header>
  );
}
