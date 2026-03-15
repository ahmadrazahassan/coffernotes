"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
  article_count: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<CategoryWithCount | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const fetchCategories = async () => {
    const supabase = createClient();
    const { data: cats } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order");

    if (!cats) return;

    // Fetch article counts per category
    const withCounts = await Promise.all(
      cats.map(async (cat) => {
        const { count } = await supabase
          .from("articles")
          .select("*", { count: "exact", head: true })
          .eq("category_id", cat.id);
        return { ...cat, article_count: count || 0 };
      })
    );

    setCategories(withCounts as CategoryWithCount[]);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setName("");
    setSlug("");
    setDescription("");
    setDialogOpen(true);
  };

  const openEdit = (cat: CategoryWithCount) => {
    setEditingId(cat.id);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const catSlug = slug || slugify(name);

    if (editingId) {
      const { error } = await supabase
        .from("categories")
        .update({ name, slug: catSlug, description: description || null })
        .eq("id", editingId);
      if (error) toast.error(error.message);
      else toast.success("Category updated.");
    } else {
      const { error } = await supabase
        .from("categories")
        .insert({ name, slug: catSlug, description: description || null });
      if (error) toast.error(error.message);
      else toast.success("Category added.");
    }

    setSaving(false);
    setDialogOpen(false);
    fetchCategories();
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", deleteDialog.id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Category deleted.");
    }
    setDeleteDialog(null);
    fetchCategories();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Categories</h1>
          <p className="text-neutral-500 mt-1">Organize your content into topics.</p>
        </div>
        <button
          className="flex items-center justify-center h-10 px-4 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10 text-sm font-medium"
          onClick={openAdd}
        >
          Add Category
        </button>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-b-neutral-100 hover:bg-transparent">
              <TableHead className="font-medium text-neutral-500 h-12">Name</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Slug</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Description</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Articles</TableHead>
              <TableHead className="text-right font-medium text-neutral-500 h-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((cat) => (
              <TableRow key={cat.id} className="border-b-neutral-100 hover:bg-neutral-50/50 transition-colors">
                <TableCell className="font-medium text-neutral-900">{cat.name}</TableCell>
                <TableCell className="text-neutral-500 text-sm">{cat.slug}</TableCell>
                <TableCell className="text-neutral-500 text-sm max-w-[200px] truncate sm:max-w-xs">
                  {cat.description || "—"}
                </TableCell>
                <TableCell className="text-neutral-900 font-medium">{cat.article_count}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-2 rounded-xl hover:bg-neutral-100"
                      onClick={() => openEdit(cat)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                      onClick={() => setDeleteDialog(cat)}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {categories.length === 0 && (
              <TableRow className="border-b-neutral-100">
                <TableCell colSpan={5} className="text-center py-10 text-neutral-400">
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl border-neutral-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold text-neutral-900 tracking-tight">
              {editingId ? "Edit Category" : "Add Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Name</label>
              <Input
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!editingId) setSlug(slugify(e.target.value));
                }}
                className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">Slug</label>
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                Description
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="rounded-2xl bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none resize-none"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter className="mt-8 sm:space-x-4">
            <button
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium w-full sm:w-auto mt-2 sm:mt-0"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10 text-sm font-medium w-full sm:w-auto disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="rounded-3xl border-neutral-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-semibold text-neutral-900 tracking-tight">Delete Category</DialogTitle>
            <DialogDescription className="text-neutral-500 mt-2">
              {deleteDialog && deleteDialog.article_count > 0
                ? `This category has ${deleteDialog.article_count} article${deleteDialog.article_count === 1 ? '' : 's'}. Remove or reassign them first.`
                : "Are you sure you want to delete this category? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 sm:space-x-4">
            <button
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium w-full sm:w-auto mt-2 sm:mt-0"
              onClick={() => setDeleteDialog(null)}
            >
              Cancel
            </button>
            <button
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-sm border border-red-700 ring-1 ring-inset ring-white/10 text-sm font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDelete}
              disabled={
                deleteDialog ? deleteDialog.article_count > 0 : false
              }
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
