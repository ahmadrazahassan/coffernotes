"use client";

import { useMemo, useState } from "react";
import { BANNER_SLOT_GROUPS } from "@/lib/banner-slot-groups";
import { formatAdUnitSize, getBannerSlotDefinition } from "@/lib/banner-slots";
import { cn } from "@/lib/utils";
import type { BannerSlotKey } from "@/types/banners";

export function BannerPlacementPicker({
  value,
  onChange,
  name = "banner-slot",
}: {
  value: string;
  onChange: (key: BannerSlotKey) => void;
  name?: string;
}) {
  const [filter, setFilter] = useState("");

  const filteredGroups = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return BANNER_SLOT_GROUPS;

    return BANNER_SLOT_GROUPS.map((g) => ({
      ...g,
      keys: g.keys.filter((key) => {
        const def = getBannerSlotDefinition(key);
        if (!def) return false;
        const hay = `${def.label} ${def.description} ${key}`.toLowerCase();
        return hay.includes(q);
      }),
    })).filter((g) => g.keys.length > 0);
  }, [filter]);

  return (
    <div className="rounded-md border border-neutral-200 bg-white overflow-hidden">
      <div className="px-3 py-2 border-b border-neutral-200 bg-neutral-50/90">
        <label htmlFor="banner-slot-filter" className="sr-only">
          Filter placements
        </label>
        <input
          id="banner-slot-filter"
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter placements…"
          className="w-full h-8 px-2.5 text-sm rounded border border-neutral-200/90 bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-900/20 focus:border-neutral-300"
        />
      </div>

      <div className="p-3 space-y-4" role="radiogroup" aria-label="Ad placement">
        {filteredGroups.length === 0 ? (
          <p className="text-sm text-neutral-500 py-4 text-center">
            No placements match.
          </p>
        ) : (
          filteredGroups.map((group) => (
            <div key={group.id} className="space-y-2">
              <div className="flex items-baseline justify-between gap-2 px-0.5">
                <h3 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
                  {group.title}
                </h3>
                <span className="text-[10px] text-neutral-400 hidden sm:inline truncate max-w-[55%] text-right">
                  {group.description}
                </span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                {group.keys.map((key) => {
                  const def = getBannerSlotDefinition(key);
                  if (!def) return null;
                  const selected = value === key;
                  const sizeLine = def.recommendedUnits
                    .map((u) => formatAdUnitSize(u))
                    .join(" · ");

                  return (
                    <label
                      key={key}
                      className={cn(
                        "flex cursor-pointer gap-2.5 rounded-md border px-2.5 py-2 text-left transition-colors",
                        selected
                          ? "border-neutral-900 bg-neutral-50 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]"
                          : "border-neutral-200/90 bg-white hover:border-neutral-300 hover:bg-neutral-50/40",
                      )}
                    >
                      <input
                        type="radio"
                        name={name}
                        value={key}
                        checked={selected}
                        onChange={() => onChange(key)}
                        className="mt-0.5 size-3.5 shrink-0 border-neutral-300 text-neutral-900 focus:ring-neutral-900/15"
                      />
                      <span className="min-w-0 flex-1 space-y-0.5">
                        <span className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                          <span className="text-sm font-medium text-neutral-900 leading-tight">
                            {def.label}
                          </span>
                          <span className="text-[11px] tabular-nums text-neutral-400 leading-tight">
                            {sizeLine}
                          </span>
                        </span>
                        <span className="block text-[11px] text-neutral-500 leading-snug line-clamp-2">
                          {def.description}
                        </span>
                        {selected ? (
                          <span className="block text-[11px] text-neutral-600 leading-snug pt-1 border-t border-neutral-200/80 mt-1.5">
                            {def.sizingHint}
                          </span>
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
