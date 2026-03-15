"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Article, Category } from "@/types";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchArticles = async () => {
    const supabase = createClient();
    let query = supabase
      .from("articles")
      .select("*, article_categories(category:categories(id, name, slug))")
      .order("created_at", { ascending: false });

    if (filterStatus !== "all") {
      query = query.eq("status", filterStatus);
    }
    if (filterCategory !== "all") {
      // NOTE: With a junction table, filtering by category requires a different approach
      // Supabase JS doesn't support filtering on a many-to-many relationship easily in a single query
      // For this implementation, we will fetch all and filter client-side if a category is selected.
    }

    if (search.trim()) {
      query = query.ilike("title", `%${search}%`);
    }

    const { data } = await query;
    let finalData = (data as any) || [];
    
    if (filterCategory !== "all") {
      finalData = finalData.filter((article: any) => 
        article.article_categories?.some((ac: any) => ac.category?.id === filterCategory)
      );
    }
    
    setArticles(finalData);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");
    setCategories((data as Category[]) || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(fetchArticles, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, filterCategory, filterStatus]);

  const handleDelete = async () => {
    if (!deleteId) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("articles")
      .delete()
      .eq("id", deleteId);
    if (error) {
      toast.error("Failed to delete article.");
    } else {
      toast.success("Article deleted.");
      setArticles((prev) => prev.filter((a) => a.id !== deleteId));
    }
    setDeleteId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Articles</h1>
          <p className="text-neutral-500 mt-1">Manage and publish your journal entries.</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/articles/bulk-upload"
            className="flex items-center justify-center h-10 px-4 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium"
          >
            Bulk Upload
          </Link>
          <Link 
            href="/admin/articles/upload-html"
            className="flex items-center justify-center h-10 px-4 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium"
          >
            Upload HTML
          </Link>
          <Link 
            href="/admin/articles/new"
            className="flex items-center justify-center h-10 px-4 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10 text-sm font-medium"
          >
            New Article
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-2xl h-10 bg-white border-neutral-200 text-neutral-900 placeholder:text-neutral-400 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 transition-all shadow-sm max-w-xs"
        />
        <Select value={filterCategory} onValueChange={(v) => setFilterCategory(v ?? "all")}>
          <SelectTrigger className="rounded-2xl h-10 bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50 transition-all shadow-sm w-48">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <SelectItem value="all" className="rounded-xl">All categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="rounded-xl">
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v ?? "all")}>
          <SelectTrigger className="rounded-2xl h-10 bg-white border-neutral-200 text-neutral-900 hover:bg-neutral-50 transition-all shadow-sm w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <SelectItem value="all" className="rounded-xl">All statuses</SelectItem>
            <SelectItem value="published" className="rounded-xl">Published</SelectItem>
            <SelectItem value="draft" className="rounded-xl">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-b-neutral-100 hover:bg-transparent">
              <TableHead className="font-medium text-neutral-500 h-12">Title</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Category</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Status</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Date</TableHead>
              <TableHead className="text-right font-medium text-neutral-500 h-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-b-neutral-100">
                <TableCell colSpan={5} className="text-center py-10 text-neutral-400">
                  Loading...
                </TableCell>
              </TableRow>
            ) : articles.length === 0 ? (
              <TableRow className="border-b-neutral-100">
                <TableCell colSpan={5} className="text-center py-10 text-neutral-400">
                  No articles found.
                </TableCell>
              </TableRow>
            ) : (
              articles.map((article) => (
                <TableRow key={article.id} className="border-b-neutral-100 hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="font-medium text-neutral-900 max-w-[200px] truncate sm:max-w-xs">
                    {article.title}
                  </TableCell>
                  <TableCell className="text-neutral-500 text-sm">
                    {/* @ts-ignore */}
                    {article.article_categories?.map((ac) => ac.category?.name).join(", ") || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        article.status === "published"
                          ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-transparent"
                          : "bg-orange-50 text-orange-700 hover:bg-orange-100 border-transparent"
                      }
                    >
                      {article.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500 text-sm">
                    {article.published_at
                      ? formatDate(article.published_at)
                      : formatDate(article.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link 
                        href={`/admin/articles/${article.id}`}
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-2 rounded-xl hover:bg-neutral-100"
                      >
                        Edit
                      </Link>
                      <button
                        className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                        onClick={() => setDeleteId(article.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
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
              onClick={() => setDeleteId(null)}
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
