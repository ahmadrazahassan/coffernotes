"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Upload } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify, calculateReadTime } from "@/lib/utils";
import { toast } from "sonner";
import type { Category } from "@/types";

interface BulkArticle {
  title: string;
  excerpt: string;
  content: string;
  category_slug: string;
  author_name: string;
  status: "draft" | "published";
  tags?: string[];
  thumbnail_url?: string;
  meta_title?: string;
  meta_description?: string;
}

export default function BulkUploadPage() {
  const [articles, setArticles] = useState<BulkArticle[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!Array.isArray(parsed)) {
          toast.error("JSON must be an array of articles.");
          return;
        }

        const valid = parsed.every(
          (a: BulkArticle) => a.title && a.content && a.category_slug
        );
        if (!valid) {
          toast.error(
            "Each article must have at least: title, content, category_slug."
          );
          return;
        }

        setArticles(parsed);
        toast.success(`${parsed.length} articles loaded for preview.`);
      } catch {
        toast.error("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleUpload = async () => {
    setUploading(true);
    setProgress({ done: 0, total: articles.length });

    const supabase = createClient();

    // Fetch categories for slug-to-id mapping
    const { data: cats } = await supabase.from("categories").select("*");
    const categoryMap = new Map(
      (cats as Category[])?.map((c) => [c.slug, c.id])
    );

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < articles.length; i++) {
      const a = articles[i];
      const categoryId = categoryMap.get(a.category_slug);

      if (!categoryId) {
        toast.error(`Category "${a.category_slug}" not found for "${a.title}".`);
        failCount++;
        setProgress({ done: i + 1, total: articles.length });
        continue;
      }

      const slug = slugify(a.title);
      const readTime = calculateReadTime(a.content);

      const { data: article, error } = await supabase
        .from("articles")
        .insert({
          title: a.title,
          slug,
          excerpt: a.excerpt || null,
          content: a.content,
          author_name: a.author_name || "Editorial Team",
          status: a.status || "draft",
          thumbnail_url: a.thumbnail_url || null,
          read_time: readTime,
          meta_title: a.meta_title || null,
          meta_description: a.meta_description || null,
          published_at:
            a.status === "published" ? new Date().toISOString() : null,
        })
        .select()
        .single();

      if (error) {
        toast.error(`Failed: "${a.title}" — ${error.message}`);
        failCount++;
      } else {
        // Handle categories
        if (article) {
          await supabase.from("article_categories").insert({
            article_id: article.id,
            category_id: categoryId,
          });
        }

        // Handle tags
        if (a.tags?.length && article) {
          for (const tagName of a.tags) {
            const tagSlug = slugify(tagName);
            const { data: existing } = await supabase
              .from("tags")
              .select("id")
              .eq("slug", tagSlug)
              .single();

            let tagId: string;
            if (existing) {
              tagId = existing.id;
            } else {
              const { data: newTag } = await supabase
                .from("tags")
                .insert({ name: tagName, slug: tagSlug })
                .select("id")
                .single();
              if (!newTag) continue;
              tagId = newTag.id;
            }

            await supabase
              .from("article_tags")
              .insert({ article_id: article.id, tag_id: tagId });
          }
        }
        successCount++;
      }

      setProgress({ done: i + 1, total: articles.length });
    }

    toast.success(
      `Upload complete: ${successCount} succeeded, ${failCount} failed.`
    );
    setUploading(false);
    setArticles([]);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Bulk Upload Articles</h1>
      <p className="text-text-secondary mb-6">
        Upload a JSON file containing multiple articles. Each article must have:
        title, content (HTML), and category_slug.
      </p>

      <div className="rounded-2xl border border-border bg-white p-6 mb-6">
        <p className="text-sm font-medium mb-2">Expected JSON format:</p>
        <pre className="bg-surface rounded-xl p-4 text-xs overflow-x-auto">
          {JSON.stringify(
            [
              {
                title: "Article Title",
                excerpt: "Short summary",
                content: "<p>Full HTML content...</p>",
                category_slug: "payroll",
                author_name: "Editorial Team",
                status: "draft",
                tags: ["HMRC", "payroll"],
                thumbnail_url: "",
                meta_title: "",
                meta_description: "",
              },
            ],
            null,
            2
          )}
        </pre>
      </div>

      {articles.length === 0 ? (
        <div
          className="rounded-2xl border-2 border-dashed border-border p-12 text-center hover:border-brand-accent/40 transition cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-8 w-8 text-text-secondary mx-auto mb-3" />
          <p className="text-text-secondary">
            Drop a JSON file here, or click to select
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-border bg-white overflow-hidden mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.map((a, i) => (
                  <TableRow key={i}>
                    <TableCell>{i + 1}</TableCell>
                    <TableCell className="font-medium max-w-xs truncate">
                      {a.title}
                    </TableCell>
                    <TableCell>{a.category_slug}</TableCell>
                    <TableCell>
                      <Badge
                        variant={a.status === "published" ? "default" : "secondary"}
                        className={
                          a.status === "published"
                            ? "bg-gray-900 text-white"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        {a.status || "draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {a.tags?.join(", ") || "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {uploading && (
            <p className="text-sm text-text-secondary mb-4">
              Uploading {progress.done} of {progress.total}...
            </p>
          )}

          <div className="flex gap-3">
            <Button
              className="rounded-xl bg-brand-accent text-white hover:bg-accent-hover"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Confirm Upload"}
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => setArticles([])}
              disabled={uploading}
            >
              Cancel
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
