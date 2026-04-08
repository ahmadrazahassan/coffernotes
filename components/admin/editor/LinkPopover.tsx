"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { type Editor } from "@tiptap/react";
import { Link as LinkIcon, ExternalLink, Unlink, Check, X } from "lucide-react";

interface LinkPopoverProps {
  editor: Editor;
  /** Called after link is applied or removed, so parent can close/reset */
  onClose?: () => void;
  /** If true, auto-focuses the URL input on mount */
  autoFocus?: boolean;
}

export function LinkPopover({ editor, onClose, autoFocus = true }: LinkPopoverProps) {
  const currentUrl = editor.getAttributes("link").href || "";
  const [isEditing, setIsEditing] = useState(!currentUrl);
  const [url, setUrl] = useState(currentUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && isEditing) {
      // Small delay so the popover has rendered
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [autoFocus, isEditing]);

  const applyLink = useCallback(() => {
    const trimmed = url.trim();
    if (!trimmed) {
      // Remove link if URL is empty
      editor.chain().focus().unsetLink().run();
      onClose?.();
      return;
    }

    // Auto-prepend https:// if no protocol
    const href = /^https?:\/\//.test(trimmed) ? trimmed : `https://${trimmed}`;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href })
      .run();

    onClose?.();
  }, [editor, url, onClose]);

  const removeLink = useCallback(() => {
    editor.chain().focus().unsetLink().run();
    onClose?.();
  }, [editor, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyLink();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      onClose?.();
    }
  };

  // ── Display mode: show current link ──────────────────────────────
  if (!isEditing && currentUrl) {
    return (
      <div className="flex items-center gap-1.5 px-1">
        <a
          href={currentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-400 hover:text-blue-300 truncate max-w-[180px] transition-colors"
          title={currentUrl}
        >
          {currentUrl.replace(/^https?:\/\//, "").slice(0, 35)}
          {currentUrl.replace(/^https?:\/\//, "").length > 35 ? "…" : ""}
        </a>
        <button
          onClick={() => {
            setIsEditing(true);
            setUrl(currentUrl);
          }}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
          title="Edit link"
        >
          <LinkIcon className="w-3 h-3" />
        </button>
        <button
          onClick={() => {
            window.open(currentUrl, "_blank");
          }}
          className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
          title="Open in new tab"
        >
          <ExternalLink className="w-3 h-3" />
        </button>
        <button
          onClick={removeLink}
          className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          title="Remove link"
        >
          <Unlink className="w-3 h-3" />
        </button>
      </div>
    );
  }

  // ── Input mode: enter/edit URL ───────────────────────────────────
  return (
    <div className="flex items-center gap-1.5 px-1">
      <LinkIcon className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Paste or type a URL…"
        className="bg-transparent border-none outline-none text-white text-xs placeholder:text-neutral-500 w-[200px]"
      />
      <button
        onClick={applyLink}
        disabled={!url.trim()}
        className="p-1 rounded-lg text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        title="Apply link"
      >
        <Check className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => onClose?.()}
        className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-all"
        title="Cancel"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
