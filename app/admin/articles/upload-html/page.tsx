"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Upload, FileCode } from "lucide-react";
import { toast } from "sonner";
import { ArticleEditor } from "@/components/admin/ArticleEditor";

export default function UploadHtmlPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/html" && !file.name.endsWith(".html")) {
      toast.error("Please select a valid HTML file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlContent(content);
      setFileName(file.name);
      toast.success("HTML file loaded successfully");
    };
    reader.onerror = () => {
      toast.error("Failed to read the file");
    };
    reader.readAsText(file);
  };

  const handleContinue = () => {
    if (!htmlContent) return;
    
    // Convert to base64 or encode for URL to pass to the new article page safely,
    // or store in localStorage as a temporary draft
    try {
      localStorage.setItem("draft_html_content", htmlContent);
      router.push("/admin/articles/new?draft=true");
    } catch (err) {
      toast.error("File is too large to process this way. Please copy and paste instead.");
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">Upload HTML</h1>
        <p className="text-neutral-500 mt-1">
          Upload an HTML document to automatically convert it into a draft article.
        </p>
      </div>

      {!htmlContent ? (
        <div
          className="rounded-3xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 p-12 text-center hover:bg-neutral-50 hover:border-neutral-300 transition-all cursor-pointer flex flex-col items-center justify-center min-h-[400px]"
          onClick={() => fileRef.current?.click()}
        >
          <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-neutral-100 flex items-center justify-center mb-6">
            <Upload className="h-8 w-8 text-neutral-400" />
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-2">
            Click to upload or drag and drop
          </h3>
          <p className="text-neutral-500 max-w-sm mb-6">
            Select an HTML file from your computer. We&apos;ll parse the contents into the visual editor automatically.
          </p>
          <Button className="rounded-xl bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 shadow-sm px-6 h-10 pointer-events-none">
            Select File
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept=".html,text/html"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4 border border-neutral-100 bg-neutral-50 px-4 py-3 rounded-xl flex-1 max-w-md">
              <FileCode className="h-5 w-5 text-blue-500" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium text-neutral-900 truncate">{fileName}</span>
                <span className="text-xs text-neutral-500">HTML Document • Parsed successfully</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="rounded-xl bg-white"
                onClick={() => {
                  setHtmlContent(null);
                  setFileName("");
                }}
              >
                Choose another file
              </Button>
              <Button
                className="rounded-xl bg-neutral-950 text-white hover:bg-neutral-900 shadow-sm px-8"
                onClick={handleContinue}
              >
                Continue to Editor
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-neutral-100 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <h3 className="text-sm font-medium text-neutral-900 mb-4 px-2">Preview Content</h3>
            <div className="pointer-events-none opacity-80 max-h-[500px] overflow-hidden relative">
              <ArticleEditor content={htmlContent} onChange={() => {}} />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
