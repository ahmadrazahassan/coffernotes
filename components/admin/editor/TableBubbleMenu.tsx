"use client";

import React from "react";
import { type Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import {
  Trash,
  Plus,
  Minus,
  Table as TableIcon,
  Columns,
  Rows
} from "lucide-react";

interface TableBubbleMenuProps {
  editor: Editor;
}

export function TableBubbleMenu({ editor }: TableBubbleMenuProps) {
  const ToolbarBtn = ({
    onClick,
    children,
    title,
    danger = false
  }: {
    onClick: () => void;
    children: React.ReactNode;
    title: string;
    danger?: boolean;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded-lg transition-all ${
        danger 
          ? "text-red-400 hover:text-red-300 hover:bg-red-400/10" 
          : "text-neutral-300 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );

  return (
    <BubbleMenu
      editor={editor}
      shouldShow={({ editor }) => editor.isActive("table")}
      pluginKey="tableBubbleMenu"
      options={{
        placement: "top",
      }}
      className="flex items-center gap-0.5 px-2 py-1.5 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]"
    >
      {/* Column Operations */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().addColumnBefore().run()}
        title="Add Column Before"
      >
        <Columns className="w-3.5 h-3.5 rotate-180" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().addColumnAfter().run()}
        title="Add Column After"
      >
        <Columns className="w-3.5 h-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().deleteColumn().run()}
        title="Delete Column"
        danger
      >
        <Minus className="w-3.5 h-3.5" />
      </ToolbarBtn>

      {/* Separator */}
      <div className="w-px h-4 bg-white/15 mx-1" />

      {/* Row Operations */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().addRowBefore().run()}
        title="Add Row Before"
      >
        <Rows className="w-3.5 h-3.5 rotate-180" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().addRowAfter().run()}
        title="Add Row After"
      >
        <Rows className="w-3.5 h-3.5" />
      </ToolbarBtn>
      <ToolbarBtn
        onClick={() => editor.chain().focus().deleteRow().run()}
        title="Delete Row"
        danger
      >
        <Minus className="w-3.5 h-3.5" />
      </ToolbarBtn>

      {/* Separator */}
      <div className="w-px h-4 bg-white/15 mx-1" />

      {/* Table Operations */}
      <ToolbarBtn
        onClick={() => editor.chain().focus().deleteTable().run()}
        title="Delete Table"
        danger
      >
        <Trash className="w-3.5 h-3.5" />
      </ToolbarBtn>
    </BubbleMenu>
  );
}
