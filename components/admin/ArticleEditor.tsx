"use client";

import React, { useRef, useCallback, useState, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table as TiptapTable } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Table,
  Link as LinkIcon,
  Image as ImageIcon,
  Minus,
  Code,
  Undo,
  Redo,
} from "lucide-react";
import { EditorBubbleMenu } from "./editor/EditorBubbleMenu";
import { LinkPopover } from "./editor/LinkPopover";
import { ImageInsertDialog } from "./editor/ImageInsertDialog";

const extensions = [
  StarterKit.configure({
    codeBlock: false,
    link: false, // we add Link below with openOnClick: false
    underline: false, // we add Underline below
  }),
  Link.configure({ openOnClick: false }),
  Image.configure({ allowBase64: true, inline: true }),
  TiptapTable.configure({ resizable: true }),
  TableRow,
  TableCell,
  TableHeader,
  Placeholder.configure({
    placeholder: "Start writing your article...",
  }),
  Underline,
];

interface ArticleEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export function ArticleEditor({ content, onChange }: ArticleEditorProps) {
  const activeTabRef = useRef<string>("visual");
  const htmlRef = useRef(content);
  const [htmlValue, setHtmlValue] = useState(content);
  const [showToolbarLink, setShowToolbarLink] = useState(false);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);

  const editor = useEditor({
    immediatelyRender: false,
    extensions,
    content,
    onUpdate: ({ editor: e }) => {
      if (activeTabRef.current === "visual") {
        const html = e.getHTML();
        htmlRef.current = html;
        setHtmlValue(html);
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: "prose max-w-none p-6 min-h-[400px] focus:outline-none",
      },
    },
  });

  // Sync when parent updates content (e.g. after Import HTML) so Visual and HTML tab show it
  useEffect(() => {
    if (content === htmlRef.current || !editor) return;
    htmlRef.current = content;
    setHtmlValue(content);
    editor.commands.setContent(content, { emitUpdate: false });
  }, [content, editor]);

  const handleTabChange = useCallback(
    (tab: string) => {
      activeTabRef.current = tab;
      if (tab === "visual" && editor) {
        editor.commands.setContent(htmlRef.current);
      }
      if (tab === "html" && editor) {
        setHtmlValue(editor.getHTML());
      }
    },
    [editor]
  );

  const handleHtmlChange = useCallback((value: string) => {
    htmlRef.current = value;
    setHtmlValue(value);
    onChange(value);
  }, [onChange]);

  const ToolbarButton = ({
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
      className={`p-2 rounded-xl transition-all ${
        active 
          ? "bg-neutral-100 text-neutral-900 shadow-sm"
          : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="rounded-3xl border border-neutral-100 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
      <Tabs defaultValue="visual" onValueChange={handleTabChange}>
        <TabsList className="w-full justify-start rounded-none border-b border-neutral-100 bg-neutral-50/50 px-4 pt-4 pb-0 h-auto gap-4">
          <TabsTrigger 
            value="visual" 
            className="rounded-t-xl rounded-b-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
          >
            Visual Editor
          </TabsTrigger>
          <TabsTrigger 
            value="html" 
            className="rounded-t-xl rounded-b-none border-b-2 border-transparent data-[state=active]:border-neutral-900 data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 pb-3"
          >
            HTML Editor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="mt-0 bg-white">
          {editor && (
            <>
              {/* ── Static Toolbar ─────────────────────────────── */}
              <div className="flex flex-wrap items-center gap-1 p-3 border-b border-neutral-100 bg-white">
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  active={editor.isActive("bold")}
                  title="Bold"
                >
                  <Bold className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  active={editor.isActive("italic")}
                  title="Italic"
                >
                  <Italic className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  active={editor.isActive("underline")}
                  title="Underline"
                >
                  <UnderlineIcon className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  active={editor.isActive("heading", { level: 2 })}
                  title="Heading 2"
                >
                  <Heading2 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  active={editor.isActive("heading", { level: 3 })}
                  title="Heading 3"
                >
                  <Heading3 className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleBulletList().run()
                  }
                  active={editor.isActive("bulletList")}
                  title="Bullet List"
                >
                  <List className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleOrderedList().run()
                  }
                  active={editor.isActive("orderedList")}
                  title="Ordered List"
                >
                  <ListOrdered className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleBlockquote().run()
                  }
                  active={editor.isActive("blockquote")}
                  title="Blockquote"
                >
                  <Quote className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor
                      .chain()
                      .focus()
                      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                      .run()
                  }
                  title="Insert Table"
                >
                  <Table className="h-4 w-4" />
                </ToolbarButton>

                {/* ── Link button with inline popover ──────── */}
                <div className="relative">
                  <ToolbarButton
                    onClick={() => setShowToolbarLink(!showToolbarLink)}
                    active={editor.isActive("link") || showToolbarLink}
                    title="Insert Link"
                  >
                    <LinkIcon className="h-4 w-4" />
                  </ToolbarButton>

                  {showToolbarLink && (
                    <div className="absolute top-full left-0 mt-2 z-50 flex items-center px-3 py-2 rounded-2xl bg-neutral-900/95 backdrop-blur-xl border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                      <LinkPopover
                        editor={editor}
                        onClose={() => setShowToolbarLink(false)}
                      />
                    </div>
                  )}
                </div>

                {/* ── Image button ─────────────────────────── */}
                <ToolbarButton
                  onClick={() => setImageDialogOpen(true)}
                  title="Insert Image"
                >
                  <ImageIcon className="h-4 w-4" />
                </ToolbarButton>

                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().setHorizontalRule().run()
                  }
                  title="Horizontal Rule"
                >
                  <Minus className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() =>
                    editor.chain().focus().toggleCodeBlock().run()
                  }
                  active={editor.isActive("codeBlock")}
                  title="Code Block"
                >
                  <Code className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().undo().run()}
                  title="Undo"
                >
                  <Undo className="h-4 w-4" />
                </ToolbarButton>
                <ToolbarButton
                  onClick={() => editor.chain().focus().redo().run()}
                  title="Redo"
                >
                  <Redo className="h-4 w-4" />
                </ToolbarButton>
              </div>

              {/* ── Bubble Menu (appears on text selection) ──── */}
              <EditorBubbleMenu editor={editor} />

              {/* ── Image Insert Dialog ─────────────────────── */}
              <ImageInsertDialog
                editor={editor}
                open={imageDialogOpen}
                onOpenChange={setImageDialogOpen}
              />
            </>
          )}
          <EditorContent editor={editor} />
        </TabsContent>

        <TabsContent value="html" className="mt-0 bg-white">
          <textarea
            className="w-full min-h-[500px] p-8 font-mono text-sm border-0 focus:outline-none resize-none bg-white text-neutral-800 selection:bg-neutral-200"
            value={htmlValue}
            onChange={(e) => handleHtmlChange(e.target.value)}
            spellCheck={false}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
