"use client";

import React, { useState, useRef, useCallback } from "react";
import { type Editor } from "@tiptap/react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Globe, Link as LinkIcon, ImageIcon } from "lucide-react";

interface ImageInsertDialogProps {
  editor: Editor;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImageInsertDialog({
  editor,
  open,
  onOpenChange,
}: ImageInsertDialogProps) {
  // Upload tab state
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // URL tab state
  const [imageUrl, setImageUrl] = useState("");
  const [urlPreviewValid, setUrlPreviewValid] = useState(false);

  // Shared state
  const [altText, setAltText] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  const resetState = useCallback(() => {
    setUploadedUrl("");
    setImageUrl("");
    setAltText("");
    setLinkUrl("");
    setUrlPreviewValid(false);
    setDragOver(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) resetState();
    onOpenChange(newOpen);
  };

  // ── Upload handler ──────────────────────────────────────────────
  const uploadFile = async (file: File) => {
    setUploading(true);
    const toastId = toast.loading("Uploading image…");

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `article-content/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from("article-images")
        .upload(path, file);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("article-images").getPublicUrl(path);

      setUploadedUrl(publicUrl);
      toast.success("Image uploaded", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image", { id: toastId });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      uploadFile(file);
    }
  };

  // ── URL preview validation ──────────────────────────────────────
  const handleUrlChange = (val: string) => {
    setImageUrl(val);
    setUrlPreviewValid(false);
  };

  const handleUrlPreviewLoad = () => setUrlPreviewValid(true);
  const handleUrlPreviewError = () => setUrlPreviewValid(false);

  // ── Insert into editor ──────────────────────────────────────────
  const insertImage = (src: string) => {
    if (!src) return;

    const alt = altText.trim() || undefined;
    const link = linkUrl.trim();

    if (link) {
      // Insert image wrapped in an anchor tag via raw HTML
      const href = /^https?:\/\//.test(link) ? link : `https://${link}`;
      const altAttr = alt ? ` alt="${alt}"` : "";
      const html = `<a href="${href}" target="_blank" rel="nofollow sponsored noopener noreferrer"><img src="${src}"${altAttr} /></a>`;
      editor.chain().focus().insertContent(html).run();
    } else {
      editor
        .chain()
        .focus()
        .setImage({ src, alt: alt || "" })
        .run();
    }

    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="rounded-3xl border-neutral-100 p-0 shadow-[0_10px_40px_rgba(0,0,0,0.08)] max-w-lg overflow-hidden">
        <DialogHeader className="px-8 pt-8 pb-0">
          <DialogTitle className="text-xl font-semibold text-neutral-900 tracking-tight flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-neutral-500" />
            Insert Image
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-neutral-100 bg-transparent px-8 pt-4 pb-0 h-auto gap-4">
            <TabsTrigger
              value="upload"
              className="rounded-t-xl rounded-b-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm"
            >
              <Upload className="w-3.5 h-3.5 mr-1.5" />
              Upload
            </TabsTrigger>
            <TabsTrigger
              value="url"
              className="rounded-t-xl rounded-b-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3 text-sm"
            >
              <Globe className="w-3.5 h-3.5 mr-1.5" />
              Paste URL
            </TabsTrigger>
          </TabsList>

          {/* ── Upload Tab ────────────────────────────────────── */}
          <TabsContent value="upload" className="mt-0 px-8 pt-6 pb-2">
            {uploadedUrl ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-neutral-100 overflow-hidden bg-neutral-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={uploadedUrl}
                    alt="Uploaded preview"
                    className="w-full max-h-48 object-contain"
                  />
                </div>
                <button
                  onClick={() => {
                    setUploadedUrl("");
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}
                  className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  Choose a different image
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-10 px-6 transition-all cursor-pointer ${
                  dragOver
                    ? "border-neutral-900 bg-neutral-50"
                    : "border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50/50"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
                    dragOver
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  <Upload className={`w-5 h-5 ${uploading ? "animate-pulse" : ""}`} />
                </div>
                <p className="text-sm font-medium text-neutral-700 mb-1">
                  {uploading
                    ? "Uploading…"
                    : dragOver
                    ? "Drop to upload"
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-neutral-400">
                  PNG, JPG, GIF, WebP up to 5 MB
                </p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </TabsContent>

          {/* ── URL Tab ───────────────────────────────────────── */}
          <TabsContent value="url" className="mt-0 px-8 pt-6 pb-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
                  Image URL
                </label>
                <Input
                  placeholder="https://i.imgur.com/example.jpg"
                  value={imageUrl}
                  onChange={(e) => handleUrlChange(e.target.value)}
                  className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none font-mono text-sm"
                />
              </div>
              {imageUrl.trim() && (
                <div className="rounded-2xl border border-neutral-100 overflow-hidden bg-neutral-50 min-h-[80px] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="URL preview"
                    className="w-full max-h-48 object-contain"
                    onLoad={handleUrlPreviewLoad}
                    onError={handleUrlPreviewError}
                  />
                  {!urlPreviewValid && (
                    <p className="text-xs text-neutral-400 absolute">
                      Loading preview…
                    </p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* ── Shared fields ───────────────────────────────────── */}
        <div className="px-8 pb-4 space-y-4 border-t border-neutral-100 pt-4 mt-2">
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-1.5 block">
              Alt text{" "}
              <span className="text-neutral-400 font-normal">(SEO)</span>
            </label>
            <Input
              placeholder="Describe the image for accessibility"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-neutral-900 mb-1.5 block flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5 text-neutral-400" />
              Link URL
              <span className="text-neutral-400 font-normal">(optional)</span>
            </label>
            <Input
              placeholder="https://finlytic.uk/go/sage-accounting"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="rounded-2xl h-11 bg-neutral-50/50 border-neutral-200 text-neutral-900 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 focus-visible:bg-white transition-all shadow-none font-mono text-sm"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Making the image clickable — opens in a new tab.
            </p>
          </div>
        </div>

        {/* ── Actions ─────────────────────────────────────────── */}
        <div className="px-8 pb-8 flex justify-end gap-3">
          <button
            onClick={() => handleOpenChange(false)}
            className="flex items-center justify-center h-10 px-6 rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all shadow-sm ring-1 ring-black/5 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => insertImage(uploadedUrl || imageUrl)}
            disabled={!uploadedUrl && !imageUrl.trim()}
            className="flex items-center justify-center h-10 px-8 rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 transition-all shadow-sm border border-neutral-800 ring-1 ring-inset ring-white/10 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Insert Image
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
