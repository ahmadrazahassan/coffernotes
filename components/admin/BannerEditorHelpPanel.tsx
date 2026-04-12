"use client";

import { BANNER_SLOTS, formatAdUnitSize } from "@/lib/banner-slots";

/**
 * Single reference rail: no duplicate “selected placement” card (that info lives on the chosen picker row).
 * Full table has no max-height — it expands with the page, not a nested scroller.
 */
export function BannerEditorHelpPanel({
  selectedSlotKey,
}: {
  selectedSlotKey: string;
}) {
  return (
    <div className="rounded-md border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50/60">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500">
          Reference
        </h2>
        <ul className="mt-2 space-y-1 text-xs text-neutral-600 leading-relaxed">
          <li>Paste your network’s full embed (“Get HTML” / ad tag).</li>
          <li>Keep sandboxed iframe unless the creative is static HTML only.</li>
          <li>Sizes on each placement card are the IAB sizes to traffic.</li>
        </ul>
      </div>

      <details className="group border-t border-neutral-100">
        <summary className="cursor-pointer list-none px-4 py-2.5 text-xs font-medium text-neutral-800 hover:bg-neutral-50 flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
          <span>All placements &amp; sizes</span>
          <span className="text-neutral-400 tabular-nums" aria-hidden>
            {BANNER_SLOTS.length}
          </span>
        </summary>
        <div className="border-t border-neutral-100 px-3 pb-3 pt-2">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500">
                <th className="py-1.5 pr-2 font-medium">Placement</th>
                <th className="py-1.5 font-medium">Sizes</th>
              </tr>
            </thead>
            <tbody>
              {BANNER_SLOTS.map((s) => (
                <tr
                  key={s.key}
                  className={
                    s.key === selectedSlotKey
                      ? "bg-neutral-100/80"
                      : "border-b border-neutral-50 last:border-0"
                  }
                >
                  <td className="py-1.5 pr-2 align-top text-neutral-900 font-medium">
                    {s.label}
                  </td>
                  <td className="py-1.5 align-top text-neutral-600 tabular-nums">
                    {s.recommendedUnits.map((u) => formatAdUnitSize(u)).join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
