"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
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
import { createClient } from "@/lib/supabase/client";
import { BANNER_SLOTS } from "@/lib/banner-slots";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { BannerRow } from "@/types/banners";

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerRow[]>([]);
  const [filterSlot, setFilterSlot] = useState<string>("all");
  const [filterEnabled, setFilterEnabled] = useState<string>("all");
  const [deleteDialog, setDeleteDialog] = useState<BannerRow | null>(null);

  const fetchBanners = useCallback(async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .order("updated_at", { ascending: false });
    if (error) {
      toast.error(error.message);
      return;
    }
    setBanners((data as BannerRow[]) || []);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const handleDelete = async () => {
    if (!deleteDialog) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("banners")
      .delete()
      .eq("id", deleteDialog.id);
    if (error) toast.error(error.message);
    else toast.success("Banner deleted.");
    setDeleteDialog(null);
    fetchBanners();
  };

  const handleDuplicate = async (b: BannerRow) => {
    const supabase = createClient();
    const { error } = await supabase.from("banners").insert({
      name: `${b.name} (copy)`,
      slot_key: b.slot_key,
      html: b.html,
      embed_mode: b.embed_mode,
      enabled: false,
      priority: b.priority,
      starts_at: b.starts_at,
      ends_at: b.ends_at,
      target_paths: b.target_paths,
      exclude_paths: b.exclude_paths,
      device: b.device,
      notes: b.notes,
    });
    if (error) toast.error(error.message);
    else {
      toast.success("Banner duplicated.");
      fetchBanners();
    }
  };

  const filtered = banners.filter((b) => {
    if (filterSlot !== "all" && b.slot_key !== filterSlot) return false;
    if (filterEnabled === "enabled" && !b.enabled) return false;
    if (filterEnabled === "disabled" && b.enabled) return false;
    return true;
  });

  const slotLabel = (key: string) =>
    BANNER_SLOTS.find((s) => s.key === key)?.label || key;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
            Banners
          </h1>
          <p className="text-neutral-500 mt-1">
            Paste ad-network HTML per placement. No public placeholder until a
            slot is active.
          </p>
        </div>
        <Link
          href="/admin/banners/new"
          className="flex items-center justify-center h-10 px-4 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10 text-sm font-medium"
        >
          New banner
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Select
          value={filterSlot}
          onValueChange={(v) => setFilterSlot(v ?? "all")}
        >
          <SelectTrigger className="rounded-2xl h-10 bg-white border-neutral-200 w-56">
            <SelectValue placeholder="All slots" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All slots</SelectItem>
            {BANNER_SLOTS.map((s) => (
              <SelectItem key={s.key} value={s.key}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={filterEnabled}
          onValueChange={(v) => setFilterEnabled(v ?? "all")}
        >
          <SelectTrigger className="rounded-2xl h-10 bg-white border-neutral-200 w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="enabled">Enabled</SelectItem>
            <SelectItem value="disabled">Disabled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-b-neutral-100 hover:bg-transparent">
              <TableHead className="font-medium text-neutral-500 h-12">
                Name
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">
                Slot
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">
                Enabled
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">
                Priority
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">
                Schedule
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">
                Device
              </TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">
                Updated
              </TableHead>
              <TableHead className="text-right font-medium text-neutral-500 h-12">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-neutral-400"
                >
                  No banners yet.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((b) => (
                <TableRow
                  key={b.id}
                  className="border-b-neutral-100 hover:bg-neutral-50/50"
                >
                  <TableCell className="font-medium text-neutral-900 max-w-[180px] truncate">
                    {b.name}
                  </TableCell>
                  <TableCell className="text-neutral-600 text-sm">
                    {slotLabel(b.slot_key)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {b.enabled ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>{b.priority}</TableCell>
                  <TableCell className="text-xs text-neutral-500 max-w-[200px]">
                    {b.starts_at || b.ends_at
                      ? `${b.starts_at ? formatDate(b.starts_at) : "—"} → ${b.ends_at ? formatDate(b.ends_at) : "—"}`
                      : "Always"}
                  </TableCell>
                  <TableCell className="text-sm capitalize">{b.device}</TableCell>
                  <TableCell className="text-sm text-neutral-500">
                    {formatDate(b.updated_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1 flex-wrap">
                      <Link
                        href={`/admin/banners/${b.id}`}
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 px-3 py-2 rounded-xl hover:bg-neutral-100 inline-block"
                      >
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="text-sm font-medium text-neutral-500 hover:text-neutral-900 px-3 py-2 rounded-xl hover:bg-neutral-100"
                        onClick={() => handleDuplicate(b)}
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        className="text-sm font-medium text-red-500 hover:text-red-700 px-3 py-2 rounded-xl hover:bg-red-50"
                        onClick={() => setDeleteDialog(b)}
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

      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent className="rounded-3xl border-neutral-100 p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
          <DialogHeader className="mb-2">
            <DialogTitle className="text-xl font-semibold text-neutral-900 tracking-tight">
              Delete banner
            </DialogTitle>
            <DialogDescription className="text-neutral-500 mt-2">
              Delete <strong className="text-neutral-900">{deleteDialog?.name}</strong>
              ? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-8 sm:space-x-4">
            <button
              type="button"
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 text-sm font-medium w-full sm:w-auto"
              onClick={() => setDeleteDialog(null)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="flex items-center justify-center h-10 px-6 rounded-xl bg-red-600 text-white hover:bg-red-700 text-sm font-medium w-full sm:w-auto"
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
