"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { uploadImage } from "@/src/lib/admin-api";
import ContentRenderer from "@/src/components/ContentRenderer";
import {
  Heading1,
  Heading2,
  Heading3,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Loader2,
  Eye,
  Edit3,
} from "lucide-react";
import { cn } from "@/src/lib/utils";

interface RichMarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  size?: "small" | "large";
  placeholder?: string;
}

export default function RichMarkdownEditor({
  value,
  onChange,
  size = "large",
  placeholder = "Write your content here in markdown...",
}: RichMarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selection = value.substring(start, end);
    const replacement = before + (selection || "") + after;

    const nextValue =
      value.substring(0, start) + replacement + value.substring(end);
    onChange(nextValue);

    setTimeout(() => {
      textarea.focus();
      const newCursor = start + before.length + (selection ? selection.length : 0);
      textarea.setSelectionRange(newCursor, newCursor);
    }, 0);
  };

  const handleImageFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) return;

    const file = files[0];
    setUploading(true);
    try {
      const res = await uploadImage(file);
      insertText(`\n![${file.name.replace(/\.[^/.]+$/, "")}](${res.url})\n`);
    } catch (err) {
      alert(`Image upload failed: ${(err as Error).message}`);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const heightClass = size === "small" ? "min-h-[220px]" : "min-h-[480px]";

  const toolbarButtons = [
    { label: "H1", icon: Heading1, action: () => insertText("# ") },
    { label: "H2", icon: Heading2, action: () => insertText("## ") },
    { label: "H3", icon: Heading3, action: () => insertText("### ") },
    { label: "Bold", icon: Bold, action: () => insertText("**", "**") },
    { label: "Italic", icon: Italic, action: () => insertText("*", "*") },
    { label: "Bullet List", icon: List, action: () => insertText("- ") },
    { label: "Numbered List", icon: ListOrdered, action: () => insertText("1. ") },
    { label: "Quote", icon: Quote, action: () => insertText("> ") },
    { label: "Code", icon: Code, action: () => insertText("```\n", "\n```") },
    { label: "Link", icon: LinkIcon, action: () => insertText("[", "](url)") },
  ];

  return (
    <div className="rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-surface)] overflow-hidden shadow-raised-crisp">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageFile}
        accept="image/*"
        className="hidden"
      />

      {/* Toolbar Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--bg-subtle)] flex-wrap gap-2">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.label}
                type="button"
                onClick={btn.action}
                className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)] transition-colors text-xs font-bold"
                title={btn.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}

          <span className="h-4 w-px bg-[var(--border)] mx-1" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[var(--accent)] hover:bg-[var(--accent)]/10 transition-colors text-xs font-bold"
            title="Upload and insert image at cursor"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ImageIcon className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Image</span>
          </button>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-[var(--bg-surface)] rounded-xl p-0.5 border border-[var(--border)]">
          <button
            type="button"
            onClick={() => setActiveTab("write")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
              activeTab === "write"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Edit3 className="h-3.5 w-3.5" />
            Write
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all",
              activeTab === "preview"
                ? "bg-[var(--accent)] text-white shadow-sm"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>
      </div>

      {/* Editor Body */}
      {activeTab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full bg-transparent p-5 text-sm text-[var(--text-primary)] font-mono focus:outline-none resize-y leading-relaxed",
            heightClass
          )}
        />
      ) : (
        <div className={cn("p-6 overflow-y-auto custom-scrollbar bg-[var(--bg-base)]/40", heightClass)}>
          {value.trim() ? (
            <ContentRenderer content={value} />
          ) : (
            <div className="text-xs text-[var(--text-muted)] italic py-10 text-center">
              Nothing to preview. Switch to write mode and type some markdown.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
