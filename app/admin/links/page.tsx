"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
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
import { slugify, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { Copy, ExternalLink, Search } from "lucide-react";
import type { RedirectLink } from "@/types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.finlytic.uk";

export default function AdminLinksPage() {
  const [links, setLinks] = useState<RedirectLink[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<RedirectLink | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [slug, setSlug] = useState("");
  const [destination, setDestination] = useState("");
  const [nofollow, setNofollow] = useState(true);
  const [sponsored, setSponsored] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchLinks = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("redirect_links")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLinks(data as RedirectLink[]);
  }, []);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const openAdd = () => {
    setEditingId(null);
    setLabel("");
    setSlug("");
    setDestination("");
    setNofollow(true);
    setSponsored(true);
    setDialogOpen(true);
  };

  const openEdit = (link: RedirectLink) => {
    setEditingId(link.id);
    setLabel(link.label || "");
    setSlug(link.slug);
    setDestination(link.destination);
    setNofollow(link.nofollow);
    setSponsored(link.sponsored);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!slug.trim()) {
      toast.error("Slug is required.");
      return;
    }
    if (!destination.trim()) {
      toast.error("Destination URL is required.");
      return;
    }

    // Validate destination is a valid URL
    try {
      new URL(destination);
    } catch {
      toast.error("Please enter a valid destination URL.");
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const payload = {
      slug: slug.trim(),
      destination: destination.trim(),
      label: label.trim() || null,
      nofollow,
      sponsored,
    };

    if (editingId) {
      const { error } = await supabase
        .from("redirect_links")
        .update(payload)
        .eq("id", editingId);
      if (error) toast.error(error.message);
      else toast.success("Link updated.");
    } else {
      const { error } = await supabase
        .from("redirect_links")
        .insert(payload);
      if (error) toast.error(error.message);
      else toast.success("Link created.");
    }

    setSaving(false);
    setDialogOpen(false);
    fetchLinks();
  };

  const handleDelete = async () => {
    if (!deleteDialog) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("redirect_links")
      .delete()
      .eq("id", deleteDialog.id);
    if (error) toast.error(error.message);
    else toast.success("Link deleted.");
    setDeleteDialog(null);
    fetchLinks();
  };

  const copyUrl = (linkSlug: string) => {
    const url = `${SITE_URL}/go/${linkSlug}`;
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard");
  };

  const truncateUrl = (url: string, maxLen = 40) => {
    if (url.length <= maxLen) return url;
    return url.slice(0, maxLen) + "…";
  };

  const filtered = links.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.slug.toLowerCase().includes(q) ||
      (l.label && l.label.toLowerCase().includes(q)) ||
      l.destination.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
            Redirect Links
          </h1>
          <p className="text-neutral-500 mt-1">
            Manage affiliate and external link redirects.
          </p>
        </div>
        <button
          className="flex items-center justify-center h-10 px-4 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10 text-sm font-medium"
          onClick={openAdd}
        >
          New Link
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <Input
          placeholder="Search by label, slug, or destination…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
        />
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-neutral-100 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-b-neutral-100 hover:bg-transparent">
              <TableHead className="font-medium text-neutral-500 h-12">
                Label
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">
                Short URL
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12 hidden md:table-cell">
                Destination
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12 text-center">
                Clicks
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12 hidden sm:table-cell">
                Created
              </TableHead>
              <TableHead className="text-right font-medium text-neutral-500 h-12">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((link) => (
              <TableRow
                key={link.id}
                className="border-b-neutral-100 hover:bg-neutral-50/50 transition-colors"
              >
                <TableCell className="font-medium text-neutral-900">
                  {link.label || (
                    <span className="text-neutral-400">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-lg font-mono">
                      /go/{link.slug}
                    </code>
                    <button
                      onClick={() => copyUrl(link.slug)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors text-neutral-400 hover:text-neutral-700"
                      title="Copy URL"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="text-neutral-500 text-sm hidden md:table-cell max-w-[200px]">
                  <a
                    href={link.destination}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-900 hover:underline transition-colors inline-flex items-center gap-1"
                    title={link.destination}
                  >
                    {truncateUrl(link.destination)}
                    <ExternalLink className="w-3 h-3 opacity-50" />
                  </a>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center justify-center min-w-[2.5rem] px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-900 font-semibold text-sm tabular-nums">
                    {link.click_count.toLocaleString()}
                  </span>
                </TableCell>
                <TableCell className="text-neutral-500 text-sm hidden sm:table-cell">
                  {formatDate(link.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors px-3 py-2 rounded-xl hover:bg-neutral-100"
                      onClick={() => openEdit(link)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-sm font-medium text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-xl hover:bg-red-50"
                      onClick={() => setDeleteDialog(link)}
                    >
                      Delete
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow className="border-b-neutral-100">
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-neutral-400"
                >
                  {search.trim()
                    ? "No links match your search."
                    : "No redirect links yet. Create one to get started."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Stats footer */}
      {links.length > 0 && (
        <div className="flex items-center gap-6 mt-4 text-xs text-neutral-400">
          <span>{links.length} link{links.length !== 1 ? "s" : ""}</span>
          <span>
            {links
              .reduce((sum, l) => sum + l.click_count, 0)
              .toLocaleString()}{" "}
            total clicks
          </span>
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-3xl border-neutral-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold text-neutral-900 tracking-tight">
              {editingId ? "Edit Link" : "New Redirect Link"}
            </DialogTitle>
            <DialogDescription className="text-neutral-500 mt-1">
              {editingId
                ? "Update the redirect link details."
                : "Create a short URL that redirects to an external site."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-5">
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                Label{" "}
                <span className="text-neutral-400 font-normal">
                  (optional)
                </span>
              </label>
              <Input
                placeholder="e.g. Sage Accounting"
                value={label}
                onChange={(e) => {
                  setLabel(e.target.value);
                  if (!editingId && !slug) setSlug(slugify(e.target.value));
                }}
                className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                Slug
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-neutral-400 font-mono shrink-0">
                  /go/
                </span>
                <Input
                  placeholder="sage-accounting"
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none font-mono"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                Destination URL
              </label>
              <Input
                placeholder="https://sageuklimited.sjv.io/vD2WKL"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none font-mono text-sm"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={nofollow}
                  onChange={(e) => setNofollow(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span className="text-sm text-neutral-700">nofollow</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sponsored}
                  onChange={(e) => setSponsored(e.target.checked)}
                  className="rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                />
                <span className="text-sm text-neutral-700">sponsored</span>
              </label>
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
              {saving ? "Saving…" : editingId ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="rounded-3xl border-neutral-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-semibold text-neutral-900 tracking-tight">
              Delete Link
            </DialogTitle>
            <DialogDescription className="text-neutral-500 mt-2">
              Are you sure you want to delete{" "}
              <strong className="text-neutral-900">
                /go/{deleteDialog?.slug}
              </strong>
              ? All click analytics for this link will also be removed. This
              action cannot be undone.
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
