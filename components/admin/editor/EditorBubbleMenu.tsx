"use client";

import React, { useState } from "react";
import { type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Heading2,
  Heading3,
  Link as LinkIcon,
} from "lucide-react";
import { LinkPopover } from "./LinkPopover";

interface EditorBubbleMenuProps {
  editor: Editor;
}

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
  const [showLinkInput, setShowLinkInput] = useState(false);

  // When the bubble menu hides (selection lost), reset link input state
  const handleBubbleMenuUpdate = () => {
    // We don't reset here because it causes flicker; the BubbleMenu
    // handles visibility automatically
  };

  const ToolbarBtn = ({
    onClick,
    active = false,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-all ${
        active
          ? "bg-white/20 text-white"
          : "text-neutral-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );

  return (
    <BubbleMenu
      editor={editor}
      options={{
        placement: "top",
        onHide: () => setShowLinkInput(false),
      }}
      className="flex items-center gap-0.5 px-2 py-1.5 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
    >
      {showLinkInput ? (
        <LinkPopover
          editor={editor}
          onClose={() => setShowLinkInput(false)}
        />
      ) : (
        <>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold"
          >
            <Bold className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic"
          >
            <Italic className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline"
          >
            <UnderlineIcon className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough className="w-3.5 h-3.5" />
          </ToolbarBtn>

          {/* Separator */}
          <div className="w-px h-4 bg-white/15 mx-1" />

          <ToolbarBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-3.5 h-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-3.5 h-3.5" />
          </ToolbarBtn>

          {/* Separator */}
          <div className="w-px h-4 bg-white/15 mx-1" />

          <ToolbarBtn
            onClick={() => {
              if (editor.isActive("link")) {
                // Show link display/edit mode
                setShowLinkInput(true);
              } else {
                // Show link input mode
                setShowLinkInput(true);
              }
            }}
            active={editor.isActive("link")}
            title="Insert Link"
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </ToolbarBtn>
        </>
      )}
    </BubbleMenu>
  );
}
