"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { mountAdHtmlInIframe } from "@/lib/banners/mountAdIframe";
import { BANNER_SLOTS, isBannerSlotKey } from "@/lib/banner-slots";
import { BannerEditorHelpPanel } from "@/components/admin/BannerEditorHelpPanel";
import { BannerPlacementPicker } from "@/components/admin/BannerPlacementPicker";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type {
  BannerDevice,
  BannerEmbedMode,
  BannerRow,
  BannerSlotKey,
} from "@/types/banners";

const MAX_HTML = 512 * 1024;

function parsePathsBlock(text: string): string[] | null {
  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  return lines.length ? lines : null;
}

function pathsToText(paths: string[] | null): string {
  return paths?.join("\n") ?? "";
}

function AdminBannerPreview({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const el = iframeRef.current;
    if (!el || !html.trim()) return;
    return mountAdHtmlInIframe(el, html);
  }, [html]);

  if (!html.trim()) {
    return (
      <p className="text-sm text-neutral-500">Add HTML to see a sandboxed preview.</p>
    );
  }

  return (
    <div className="space-y-2">
      <p className="text-xs text-neutral-500">
        Preview runs in an isolated iframe; it may not match every live-network
        behaviour.
      </p>
      <iframe
        ref={iframeRef}
        title="Banner preview"
        className="w-full rounded-md border border-neutral-200 bg-white"
        style={{ display: "block", overflow: "hidden" }}
        sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-forms"
      />
    </div>
  );
}

function toIsoOrNull(local: string): string | null {
  if (!local.trim()) return null;
  const d = new Date(local);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3 pt-6 first:pt-0 border-t border-neutral-100 first:border-0">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
          {title}
        </h2>
        {description ? (
          <p className="text-sm text-neutral-600 mt-1">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const EMBED_OPTIONS: {
  value: BannerEmbedMode;
  title: string;
  subtitle: string;
  badge?: string;
}[] = [
  {
    value: "iframe",
    title: "Sandboxed iframe",
    subtitle:
      "Runs network scripts inside an isolated frame. Use for GAM, AdSense, Impact, and most third-party tags.",
    badge: "Recommended",
  },
  {
    value: "inline",
    title: "Inline HTML",
    subtitle:
      "Renders HTML directly on the page. Only for simple, static snippets (e.g. link + image, no scripts).",
  },
];

const DEVICE_OPTIONS: { value: BannerDevice; label: string }[] = [
  { value: "all", label: "All devices" },
  { value: "desktop", label: "Desktop" },
  { value: "mobile", label: "Mobile" },
];

export interface BannerEditorFormProps {
  bannerId: string | null;
}

export function BannerEditorForm({ bannerId }: BannerEditorFormProps) {
  const router = useRouter();
  const isEdit = bannerId !== null;

  const [loading, setLoading] = useState(isEdit);
  const [name, setName] = useState("");
  const [slotKey, setSlotKey] = useState<string>(BANNER_SLOTS[0].key);
  const [html, setHtml] = useState("");
  const [embedMode, setEmbedMode] = useState<BannerEmbedMode>("iframe");
  const [enabled, setEnabled] = useState(true);
  const [priority, setPriority] = useState(0);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [targetPathsText, setTargetPathsText] = useState("");
  const [excludePathsText, setExcludePathsText] = useState("");
  const [device, setDevice] = useState<BannerDevice>("all");
  const [notes, setNotes] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadBanner = useCallback(async () => {
    if (!bannerId) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("id", bannerId)
      .single();

    if (error || !data) {
      toast.error(error?.message ?? "Banner not found.");
      router.replace("/admin/banners");
      return;
    }

    const b = data as BannerRow;
    setName(b.name);
    setSlotKey(b.slot_key);
    setHtml(b.html);
    setEmbedMode(b.embed_mode);
    setEnabled(b.enabled);
    setPriority(b.priority);
    setStartsAt(b.starts_at ? b.starts_at.slice(0, 16) : "");
    setEndsAt(b.ends_at ? b.ends_at.slice(0, 16) : "");
    setTargetPathsText(pathsToText(b.target_paths));
    setExcludePathsText(pathsToText(b.exclude_paths));
    setDevice(b.device);
    setNotes(b.notes || "");
    setPreviewOpen(false);
    setLoading(false);
  }, [bannerId, router]);

  useEffect(() => {
    if (bannerId) void loadBanner();
  }, [bannerId, loadBanner]);

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name is required.");
      return;
    }
    if (!isBannerSlotKey(slotKey)) {
      toast.error("Invalid slot.");
      return;
    }
    const trimmedHtml = html.trim();
    if (!trimmedHtml) {
      toast.error("HTML embed is required.");
      return;
    }
    if (trimmedHtml.length > MAX_HTML) {
      toast.error(`HTML is too large (max ${MAX_HTML} characters).`);
      return;
    }

    setSaving(true);
    const supabase = createClient();

    const payload = {
      name: name.trim(),
      slot_key: slotKey,
      html: trimmedHtml,
      embed_mode: embedMode,
      enabled,
      priority: Number.isFinite(priority) ? priority : 0,
      starts_at: toIsoOrNull(startsAt),
      ends_at: toIsoOrNull(endsAt),
      target_paths: parsePathsBlock(targetPathsText),
      exclude_paths: parsePathsBlock(excludePathsText),
      device,
      notes: notes.trim() || null,
    };

    if (isEdit && bannerId) {
      const { error } = await supabase
        .from("banners")
        .update(payload)
        .eq("id", bannerId);
      if (error) toast.error(error.message);
      else {
        toast.success("Banner updated.");
        router.push("/admin/banners");
      }
    } else {
      const { error } = await supabase.from("banners").insert(payload);
      if (error) toast.error(error.message);
      else {
        toast.success("Banner created.");
        router.push("/admin/banners");
      }
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-neutral-500 text-sm">Loading…</div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/banners"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1 mb-4"
        >
          ← Back to banners
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900 tracking-tight">
          {isEdit ? "Edit banner" : "New banner"}
        </h1>
        <p className="text-neutral-600 mt-1 text-sm">
          Configure placement, paste your ad-network embed, then set targeting and
          schedule.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-start xl:gap-8">
        <div className="rounded-md border border-neutral-200 bg-white w-full min-w-0 flex-1 shadow-sm">
          <div className="px-5 sm:px-6 py-5">
            <FormSection
              title="Identity"
              description="Internal name for this line in your list."
            >
              <div>
                <label
                  htmlFor="banner-name"
                  className="text-sm font-medium text-neutral-900 mb-1.5 block"
                >
                  Name
                </label>
                <Input
                  id="banner-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="rounded-md h-10 border-neutral-200 bg-white"
                  placeholder="Q1 — leaderboard"
                />
              </div>
            </FormSection>

            <FormSection
              title="Placement"
              description="One winning banner per slot — priority and schedule decide which runs. Layout notes appear under your selection."
            >
              <BannerPlacementPicker
                value={slotKey}
                onChange={(k: BannerSlotKey) => setSlotKey(k)}
              />
            </FormSection>

            <FormSection
              title="Creative"
              description="How the HTML is executed on the public site."
            >
              <div>
                <span className="text-sm font-medium text-neutral-900 mb-2 block">
                  Embed mode
                </span>
                <div
                  className="grid sm:grid-cols-2 gap-2"
                  role="radiogroup"
                  aria-label="Embed mode"
                >
                  {EMBED_OPTIONS.map((opt) => {
                    const active = embedMode === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setEmbedMode(opt.value)}
                        className={cn(
                          "text-left rounded-md border px-3 py-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:ring-offset-2",
                          active
                            ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900/10"
                            : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/50",
                        )}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-sm font-medium text-neutral-900">
                            {opt.title}
                          </span>
                          {opt.badge ? (
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-600 bg-neutral-200/80 px-1.5 py-0.5 rounded-sm">
                              {opt.badge}
                            </span>
                          ) : null}
                        </span>
                        <span className="block text-xs text-neutral-600 mt-1.5 leading-relaxed">
                          {opt.subtitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label
                  htmlFor="banner-html"
                  className="text-sm font-medium text-neutral-900 mb-1.5 block"
                >
                  HTML
                </label>
                <Textarea
                  id="banner-html"
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className="rounded-md min-h-[220px] font-mono text-sm border-neutral-200 bg-white"
                  spellCheck={false}
                />
              </div>

              <button
                type="button"
                className="text-sm font-medium text-neutral-700 hover:text-neutral-900 underline-offset-2 hover:underline"
                onClick={() => setPreviewOpen((p) => !p)}
              >
                {previewOpen ? "Hide sandboxed preview" : "Show sandboxed preview"}
              </button>
              {previewOpen ? <AdminBannerPreview html={html} /> : null}
            </FormSection>

            <FormSection
              title="Schedule & paths"
              description="Optional window and URL rules. Empty paths = all pages (subject to slot wiring)."
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="banner-starts"
                    className="text-sm font-medium text-neutral-900 mb-1.5 block"
                  >
                    Starts at
                  </label>
                  <Input
                    id="banner-starts"
                    type="datetime-local"
                    value={startsAt}
                    onChange={(e) => setStartsAt(e.target.value)}
                    className="rounded-md h-10 border-neutral-200 bg-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="banner-ends"
                    className="text-sm font-medium text-neutral-900 mb-1.5 block"
                  >
                    Ends at
                  </label>
                  <Input
                    id="banner-ends"
                    type="datetime-local"
                    value={endsAt}
                    onChange={(e) => setEndsAt(e.target.value)}
                    className="rounded-md h-10 border-neutral-200 bg-white"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="banner-target-paths"
                  className="text-sm font-medium text-neutral-900 mb-1.5 block"
                >
                  Target paths (one per line)
                </label>
                <Textarea
                  id="banner-target-paths"
                  value={targetPathsText}
                  onChange={(e) => setTargetPathsText(e.target.value)}
                  placeholder={"/\n/accounting"}
                  className="rounded-md min-h-[72px] text-sm border-neutral-200 bg-white"
                />
              </div>
              <div>
                <label
                  htmlFor="banner-exclude-paths"
                  className="text-sm font-medium text-neutral-900 mb-1.5 block"
                >
                  Exclude paths (one per line)
                </label>
                <Textarea
                  id="banner-exclude-paths"
                  value={excludePathsText}
                  onChange={(e) => setExcludePathsText(e.target.value)}
                  placeholder={"/privacy\n/admin"}
                  className="rounded-md min-h-[72px] text-sm border-neutral-200 bg-white"
                />
              </div>
            </FormSection>

            <FormSection
              title="Delivery"
              description="Device filter and priority when multiple banners match."
            >
              <div>
                <span
                  id="device-label"
                  className="text-sm font-medium text-neutral-900 mb-2 block"
                >
                  Device
                </span>
                <div
                  className="inline-flex rounded-md border border-neutral-200 p-0.5 bg-neutral-100"
                  role="group"
                  aria-labelledby="device-label"
                >
                  {DEVICE_OPTIONS.map((opt) => {
                    const on = device === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDevice(opt.value)}
                        className={cn(
                          "px-3 py-1.5 text-sm font-medium rounded-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 focus-visible:ring-offset-1",
                          on
                            ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/80"
                            : "text-neutral-600 hover:text-neutral-900",
                        )}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label
                  htmlFor="banner-priority"
                  className="text-sm font-medium text-neutral-900 mb-1.5 block"
                >
                  Priority (higher wins)
                </label>
                <Input
                  id="banner-priority"
                  type="number"
                  value={priority}
                  onChange={(e) => setPriority(parseInt(e.target.value, 10) || 0)}
                  className="rounded-md h-10 max-w-[140px] border-neutral-200 bg-white"
                />
              </div>
              <label className="flex items-center gap-2.5 cursor-pointer py-1">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setEnabled(e.target.checked)}
                  className="size-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900/20"
                />
                <span className="text-sm font-medium text-neutral-900">Enabled</span>
              </label>
              <div>
                <label
                  htmlFor="banner-notes"
                  className="text-sm font-medium text-neutral-900 mb-1.5 block"
                >
                  Notes (internal)
                </label>
                <Textarea
                  id="banner-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-md min-h-[64px] text-sm border-neutral-200 bg-white"
                />
              </div>
            </FormSection>
          </div>

          <div className="px-5 sm:px-6 py-4 border-t border-neutral-100 bg-neutral-50/50 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <Link
              href="/admin/banners"
              className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              type="button"
              className="inline-flex items-center justify-center h-9 px-4 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 text-sm font-medium disabled:opacity-50"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Saving…" : "Save banner"}
            </button>
          </div>
        </div>

        <aside className="mt-6 xl:mt-0 w-full xl:w-72 shrink-0 xl:sticky xl:top-28 xl:self-start">
          <BannerEditorHelpPanel selectedSlotKey={slotKey} />
        </aside>
      </div>
    </div>
  );
}
