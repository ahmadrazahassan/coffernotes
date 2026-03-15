"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Subscriber } from "@/types";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      setSubscribers((data as Subscriber[]) || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const exportCSV = () => {
    const header = "email,subscribed,created_at\n";
    const rows = subscribers
      .map(
        (s) =>
          `${s.email},${s.subscribed ? "active" : "unsubscribed"},${s.created_at}`
      )
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Subscribers</h1>
          <p className="text-neutral-500 mt-1">Manage your newsletter audience.</p>
        </div>
        <button
          className="flex items-center justify-center h-10 px-4 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={exportCSV}
          disabled={subscribers.length === 0}
        >
          Export CSV
        </button>
      </div>

      <div className="rounded-3xl border border-neutral-100 bg-white overflow-hidden shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <Table>
          <TableHeader className="bg-neutral-50/50">
            <TableRow className="border-b-neutral-100 hover:bg-transparent">
              <TableHead className="font-medium text-neutral-500 h-12">Email</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Status</TableHead>
              <TableHead className="font-medium text-neutral-500 h-12">Date Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow className="border-b-neutral-100">
                <TableCell
                  colSpan={3}
                  className="text-center py-10 text-neutral-400"
                >
                  Loading...
                </TableCell>
              </TableRow>
            ) : subscribers.length === 0 ? (
              <TableRow className="border-b-neutral-100">
                <TableCell
                  colSpan={3}
                  className="text-center py-10 text-neutral-400"
                >
                  No subscribers yet.
                </TableCell>
              </TableRow>
            ) : (
              subscribers.map((sub) => (
                <TableRow key={sub.id} className="border-b-neutral-100 hover:bg-neutral-50/50 transition-colors">
                  <TableCell className="font-medium text-neutral-900">{sub.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        sub.subscribed
                          ? "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-transparent"
                          : "bg-red-50 text-red-700 hover:bg-red-100 border-transparent"
                      }
                    >
                      {sub.subscribed ? "Active" : "Unsubscribed"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-neutral-500 text-sm">
                    {formatDate(sub.created_at)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
