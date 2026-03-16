"use client";

import DOMPurify from "isomorphic-dompurify";

interface ArticleContentProps {
  content: string;
}

export function ArticleContent({ content }: ArticleContentProps) {
  const sanitized = DOMPurify.sanitize(content, {
    ADD_TAGS: ["table", "thead", "tbody", "tr", "th", "td"],
    ADD_ATTR: ["class", "colspan", "rowspan", "style"],
  });

  return (
    <div
      className="article-content mt-10"
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}
