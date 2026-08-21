"use client";

import { useState, useRef, type ChangeEvent, type DragEvent } from "react";
import { uploadImage } from "@/src/lib/admin-api";
import { Button } from "@/src/components/ui/button";
import { UploadCloud, CheckCircle, AlertCircle, Loader2, X } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  value?: string | null;
  onChange: (url: string | null) => void;
}

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await uploadImage(file);
      onChange(res.url);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  return (
    <div className="space-y-3">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept="image/*"
        className="hidden"
      />

      {value ? (
        <div className="relative rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] p-2 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-[var(--border)] bg-black/40 flex-shrink-0">
              <Image src={value} alt="Preview" fill className="object-contain" unoptimized />
            </div>
            <div className="truncate text-xs font-mono text-[var(--text-secondary)]">{value}</div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(null)}
            className="h-8 w-8 text-[var(--text-muted)] hover:text-[var(--error)] flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            isDragging
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-[var(--border)] hover:border-[var(--accent)] bg-[var(--bg-subtle)]/50"
          }`}
        >
          {loading ? (
            <div className="flex flex-col items-center gap-2 text-[var(--text-secondary)]">
              <Loader2 className="h-6 w-6 animate-spin text-[var(--accent)]" />
              <span className="text-xs font-bold">Uploading to R2...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-[var(--text-muted)]">
              <UploadCloud className="h-7 w-7 text-[var(--accent)]" />
              <div className="text-xs font-semibold">
                <span className="text-[var(--text-primary)] font-bold">Click to upload</span> or drag and drop
              </div>
              <span className="text-[10px]">PNG, JPG, WEBP up to 10MB</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--error)] font-medium">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </div>
      )}
    </div>
  );
}
