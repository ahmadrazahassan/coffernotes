"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { createClient } from "@/lib/supabase/client";
import { slugify, calculateReadTime } from "@/lib/utils";
import { toast } from "sonner";
import type { Category } from "@/types";
import NextImage from "next/image";

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [authorName, setAuthorName] = useState("Editorial Team");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [featured, setFeatured] = useState(false);
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();

      const [{ data: cats }, { data: article }] = await Promise.all([
        supabase.from("categories").select("*").order("sort_order"),
        supabase
          .from("articles")
          .select("*, article_tags(tag:tags(*)), article_categories(category_id)")
          .eq("id", id)
          .single(),
      ]);

      setCategories((cats as Category[]) || []);

      if (article) {
        setTitle(article.title);
        setExcerpt(article.excerpt || "");
        setContent(article.content);
        
        const catIds = (article.article_categories as { category_id: string }[])?.map(
          (ac) => ac.category_id
        ) || [];
        setCategoryIds(catIds);
        
        setAuthorName(article.author_name);
        setThumbnailUrl(article.thumbnail_url || "");
        setStatus(article.status);
        setFeatured(article.featured);
        setMetaTitle(article.meta_title || "");
        setMetaDescription(article.meta_description || "");
        setPublishedAt(article.published_at);

        const tags = (
          article.article_tags as { tag: { name: string } }[]
        )?.map((at) => at.tag?.name);
        if (tags?.length) setTagsInput(tags.filter(Boolean).join(", "));
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const readTime = calculateReadTime(content);

  const handleSave = async (newStatus: "draft" | "published") => {
    if (!title.trim()) {
      toast.error("Title is required.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const slug = slugify(title);

    const updateData = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      author_name: authorName,
      thumbnail_url: thumbnailUrl || null,
      status: newStatus,
      featured,
      read_time: readTime,
      meta_title: metaTitle || null,
      meta_description: metaDescription || null,
      published_at:
        newStatus === "published" && !publishedAt
          ? new Date().toISOString()
          : publishedAt,
    };

    const { error } = await supabase
      .from("articles")
      .update(updateData)
      .eq("id", id);

    if (error) {
      toast.error(error.message);
      setSaving(false);
      return;
    }

    // Handle categories: clear existing, re-insert
    await supabase.from("article_categories").delete().eq("article_id", id);
    if (categoryIds.length > 0) {
      const categoryInserts = categoryIds.map((cid) => ({
        article_id: id,
        category_id: cid,
      }));
      await supabase.from("article_categories").insert(categoryInserts);
    }

    // Handle tags: clear existing, re-insert
    await supabase.from("article_tags").delete().eq("article_id", id);

    if (tagsInput.trim()) {
      const tagNames = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
      for (const tagName of tagNames) {
        const tagSlug = slugify(tagName);
        const { data: existingTag } = await supabase
          .from("tags")
          .select("id")
          .eq("slug", tagSlug)
          .single();

        let tagId: string;
        if (existingTag) {
          tagId = existingTag.id;
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
          .insert({ article_id: id, tag_id: tagId });
      }
    }

    toast.success(
      newStatus === "published" ? "Article published!" : "Draft saved."
    );
    router.push("/admin/articles");
  };

  const handleDelete = async () => {
    const supabase = createClient();
    const { error } = await supabase.from("articles").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete article.");
    } else {
      toast.success("Article deleted.");
      router.push("/admin/articles");
    }
    setDeleteOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-text-secondary">Loading article...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Edit Article</h1>
        <p className="text-neutral-500 mt-1">Make changes to your journal entry.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
        <div className="flex flex-col gap-6">
          <Input
            placeholder="Article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-3xl font-bold bg-white border border-neutral-200 px-5 h-auto py-4 rounded-2xl text-neutral-900 placeholder:text-neutral-300 focus-visible:ring-1 focus-visible:ring-neutral-900 shadow-sm tracking-tight"
          />
          <Textarea
            placeholder="Short summary (2-3 sentences)"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            rows={3}
            className="text-lg bg-white border border-neutral-200 px-5 py-4 rounded-2xl text-neutral-600 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-900 shadow-sm resize-none w-full max-w-2xl"
          />
          <div className="mt-4">
            {content !== "" && (
              <ArticleEditor content={content} onChange={setContent} />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="rounded-3xl border border-neutral-100 bg-white p-6 flex flex-col gap-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Categories</label>
              <div className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-neutral-50/50 p-4 max-h-48 overflow-y-auto min-h-24">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      checked={categoryIds.includes(cat.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCategoryIds([...categoryIds, cat.id]);
                        } else {
                          setCategoryIds(categoryIds.filter((cid) => cid !== cat.id));
                        }
                      }}
                      className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900 bg-white"
                    />
                    <span className="text-sm text-neutral-700 group-hover:text-neutral-900 transition-colors">
                      {cat.name}
                    </span>
                  </label>
                ))}
                {categories.length === 0 && (
                  <span className="text-sm text-neutral-500 italic">No categories available</span>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                Tags (comma-separated)
              </label>
              <Input
                placeholder="HMRC, payroll, VAT"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none placeholder:text-neutral-400"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Thumbnail URL</label>
              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="https://i.imgur.com/..."
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none placeholder:text-neutral-400 flex-1 min-w-0"
                />
                {thumbnailUrl && (
                  <button
                    type="button"
                    onClick={() => setThumbnailUrl("")}
                    className="rounded-2xl h-11 px-4 whitespace-nowrap bg-white border border-neutral-200 text-neutral-600 hover:bg-neutral-50 hover:border-neutral-300 text-xs font-medium shadow-sm flex-shrink-0"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              {thumbnailUrl && (
                <div className="mt-3 relative rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50 aspect-video flex items-center justify-center min-h-[158px]">
                  <NextImage
                    src={thumbnailUrl}
                    alt="Thumbnail preview"
                    width={280}
                    height={158}
                    className="aspect-video object-cover w-full"
                    unoptimized
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Author</label>
              <Input
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
              />
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-5 h-5 rounded-md border-neutral-300 text-neutral-900 focus:ring-neutral-900 bg-neutral-50/50"
              />
              <label htmlFor="featured" className="text-sm font-medium text-neutral-900 cursor-pointer select-none">
                Featured article
              </label>
            </div>

            <div className="h-px bg-neutral-100 my-2" />

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                Meta Title (SEO)
              </label>
              <Input
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none placeholder:text-neutral-400"
                placeholder="Override page title"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                Meta Description (SEO)
              </label>
              <Textarea
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="rounded-2xl bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none placeholder:text-neutral-400 resize-none"
                rows={3}
                placeholder="Override page description"
              />
            </div>

            <div className="bg-neutral-50/80 rounded-2xl p-4 mt-2 border border-neutral-100">
              <p className="text-sm text-neutral-500 font-medium flex justify-between">
                <span>Estimated read time</span>
                <strong className="text-neutral-900">{readTime} min</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t border-neutral-100 p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 -mx-8 -mb-8 px-8 z-20">
        <button
          className="flex items-center justify-center h-10 px-6 rounded-xl bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 transition-all shadow-sm ring-1 ring-red-500/5 text-sm font-medium w-full sm:w-auto"
          onClick={() => setDeleteOpen(true)}
        >
          Delete Article
        </button>
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            className="flex-1 flex items-center justify-center h-10 px-6 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleSave("draft")}
            disabled={saving}
          >
            Save Draft
          </button>
          <button
            className="flex-1 flex items-center justify-center h-10 px-8 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10 text-sm font-medium flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => handleSave("published")}
            disabled={saving}
          >
            {status === "published" ? "Update Article" : "Publish Article"}
          </button>
        </div>
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="rounded-3xl border-neutral-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-semibold text-neutral-900 tracking-tight">Delete Article</DialogTitle>
            <DialogDescription className="text-neutral-500 mt-2">
              Are you sure you want to delete this article? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 sm:space-x-4">
            <button
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium w-full sm:w-auto mt-2 sm:mt-0"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm border border-red-700 ring-1 ring-inset ring-white/10 text-sm font-medium w-full sm:w-auto"
              onClick={handleDelete}
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
