import Link from "next/link";
import { Plus, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatsCards } from "@/components/admin/StatsCards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import type { Article } from "@/types";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [publishedRes, draftRes, catRes, subRes, recentRes] = await Promise.all(
    [
      supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "published"),
      supabase
        .from("articles")
        .select("*", { count: "exact", head: true })
        .eq("status", "draft"),
      supabase
        .from("categories")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("subscribers")
        .select("*", { count: "exact", head: true }),
      supabase
        .from("articles")
        .select("*, article_categories(category:categories(name))")
        .order("created_at", { ascending: false })
        .limit(10),
    ]
  );

  const stats = [
    { label: "Published Articles", value: publishedRes.count || 0 },
    { label: "Draft Articles", value: draftRes.count || 0 },
    { label: "Categories", value: catRes.count || 0 },
    { label: "Subscribers", value: subRes.count || 0 },
  ];

  const recentArticles = (recentRes.data as Article[]) || [];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight mb-2">Overview</h1>
        <p className="text-neutral-500 mb-8">Welcome back. Here is what is happening today.</p>
        <StatsCards stats={stats} />
      </div>

      <div>
        <h2 className="text-xl font-semibold text-neutral-900 tracking-tight mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            href="/admin/articles/new" 
            className="group flex flex-col items-start p-6 rounded-2xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10"
          >
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-lg">Create New Post</h3>
            <p className="text-neutral-400 text-sm mt-1">Write and publish a new article to your blank canvas.</p>
          </Link>
          <Link 
            href="/admin/articles/upload-html"
            className="group flex flex-col items-start p-6 rounded-2xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm text-left ring-1 ring-black/5"
          >
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Download className="w-5 h-5 text-neutral-600" />
            </div>
            <h3 className="font-semibold text-lg">Import HTML</h3>
            <p className="text-neutral-500 text-sm mt-1">Upload an existing HTML document directly to your drafts.</p>
          </Link>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-neutral-900 tracking-tight">Recent Articles</h2>
          <Link href="/admin/articles" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            View all
          </Link>
        </div>
        <div className="rounded-3xl border border-neutral-100 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentArticles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-text-secondary py-8"
                  >
                    No articles yet.
                  </TableCell>
                </TableRow>
              ) : (
                recentArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium max-w-xs truncate">
                      {article.title}
                    </TableCell>
                    <TableCell className="text-text-secondary">
                      {/* @ts-ignore */}
                      {article.article_categories?.map((ac) => ac.category?.name).join(", ") || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          article.status === "published"
                            ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            : "bg-orange-50 text-orange-700 hover:bg-orange-100"
                        }
                      >
                        {article.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-neutral-500">
                      {article.published_at
                        ? formatDate(article.published_at)
                        : formatDate(article.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link 
                        href={`/admin/articles/${article.id}`}
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-2 rounded-xl hover:bg-neutral-50"
                      >
                        Edit
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
